import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import Layout from './Layout'
import SeshCounter from './SeshCounter'
import classnames from 'classnames'
import WorkoutRoutine from './WorkoutRoutine'
import { resetServerContext, DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Clamped from './Clamped'
import classNames from 'classnames'
import { ArrowUpIcon, BackwardIcon, BoltIcon, BoltSlashIcon, ChatBubbleLeftIcon, CheckIcon, ChevronDownIcon, ForwardIcon, PlayCircleIcon, PlayIcon, ShareIcon, StopIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import withSeshHistoryExercises from './withSeshHistoryExercises'
import ActiveSeshes from './ActiveSeshes'
import { SeshDto } from '../types'
import { Exercise, Sesh, SeshInterval } from '@prisma/client'
import { getNextIntervalProps, getShownExercises } from '../lib/sesh-utils'
import SeshHistoryContainer from './SeshHistoryContainer'
import moment from 'moment'
import DurationText from './DurationText'
import RestCounterBadge from './RestCounterBadge'
import IntervalNote from './IntervalNote'
import ConfirmStopWorkoutModal from './ConfirmStopWorkoutModal'
// see: https://github.com/atlassian/react-beautiful-dnd/issues/2350#issuecomment-1242917371

resetServerContext()

enum WorkoutSetType {
  Active = 'Set',
  Rest = 'Rest'
}

enum BottomTab {
  Exercises = 'Exercises',
  History = 'History',
}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function WorkoutSeshPlayer({
  workout,
  error,
  saveCurrentInterval,
  isUnsavedSesh,
}: any) {
  // const session = useSession();
  workout = workout ? JSON.parse(workout) : {};
  error = error ? JSON.parse(error) : undefined;
  const EMPTY_SESH = {
    intervals: [],
    createdAt: new Date(),
    timeCompletedS: 0,
    workoutId: workout.id,
    workout: workout,
    orderedExerciseIds: [],
  };
  const initialExercises = (getShownExercises(workout.exercises) || [])
    .filter((exc: Exercise) => exc.connectedToCurrentWorkout);
  const [unfinishedSeshes, setUnfinishedSeshes] = useState<SeshDto[]>(workout.seshes
    .sort(
      (a: SeshDto, b: SeshDto) =>
        new Date (b.updatedAt).getTime() - new Date (a.updatedAt).getTime()
    )
  );
  const orderedInitialExercises = initialExercises
    .sort(
      (a: Exercise, b: Exercise) => a.workoutOrder - b.workoutOrder
    );
  const [exercises, setExercises] = useState<Exercise[]>(orderedInitialExercises);
  const [activeIntervalCounterIsActive, setActiveIntervalCounterIsActive] = useState(false);
  const [seshStarted, setSeshStarted] = useState(false);
  const [pastIntervals, setPastIntervals] = useState<(SeshInterval & { exercise: Exercise })[]>([]);
  if (pastIntervals && pastIntervals[0] && !pastIntervals[0].exercise) console.log('pastIntervals', pastIntervals)
  // sorted by most recent first
  const [seshCounterIsActive, setSeshCounterIsActive] = useState(seshStarted);
  const [workoutSetNum, setWorkoutSetNum] = useState(1);
  const [currWorkoutSetType, setCurrWorkoutSetType] = useState(WorkoutSetType.Active);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const activeExercise = exercises[activeExerciseIdx];
  const isLastExercise = activeExerciseIdx >= exercises.length - 1;
  const getNextPeriodText = (): { setText: string; isSameExercise: boolean; setNum?: number; } => {
    if (activeExercise.isRest) {
      // moves onto next exercise if any
      return (
        !isLastExercise ?
        {
          setText: exercises[activeExerciseIdx + 1].name,
          isSameExercise: false,
        } :
        {
          setText: 'You are finished.',
          isSameExercise: false,
        }
      );
    } else {
      // goes to next set in exercise
      return {
        setText: 'Set #' + (workoutSetNum + 1),
        setNum: workoutSetNum + 1,
        isSameExercise: true,
      };
    }
  }
  const [showAdditionalActiveExerciseNotes, setShowAdditionalActiveExerciseNotes] = useState(false);
  const [activeExerciseActiveNotedPeriodsByMostRecent, setActiveExerciseActiveNotedPeriodsByMostRecent] = useState<SeshInterval[]>([]);
  const loadActiveExercisePastActivePeriods = useCallback((
    exercise: Exercise = activeExercise,
    activeExcLastSavedInterval?: SeshInterval,
  ) => {
    if (!exercise) throw new Error('Active exercise required');
    // return fetch(`/api/intervals?exerciseId=${exercise.id}&notesOnly=true`)
    return fetch(`/api/intervals?exerciseId=${exercise.id}`)
      .then((r: any) => r.json())
      .then((intervals: SeshInterval[]) => {
        console.log('intervals', intervals);
        if (activeExcLastSavedInterval &&
          activeExcLastSavedInterval.note &&
          intervals[0] &&
          intervals[0].id !== activeExcLastSavedInterval.id) {
          // we are fetching records that are old compared to
          // the (pending) last saved interval.
          // -> add it here
          setActiveExerciseActiveNotedPeriodsByMostRecent([
            activeExcLastSavedInterval,
            ...intervals
          ]);
        } else {
          setActiveExerciseActiveNotedPeriodsByMostRecent(intervals);
        }
      })
  }, [activeExercise]);
  const toggleShowActiveExerciseNotes = () => {
    const newVal = !showAdditionalActiveExerciseNotes;
    setShowAdditionalActiveExerciseNotes(newVal);
    if (newVal) {
      loadActiveExercisePastActivePeriods();
    }
  };
  const [activeBottomTab, setActiveBottomTab] = useState(BottomTab.Exercises);
  const [winReady, setWinReady] = useState(false);
  const [isConfirmingStop, setIsConfirmingStop] = useState(false);
  const [activeExcNote, setActiveExcNote] = useState('');
  const [activeIntervalSecondsTotal, setActiveIntervalSecondsTotal] = useState(0);
  const [workoutSecondsTotal, setWorkoutSecondsTotal] = useState(0);
  const [preExerciseRestS, setPreExerciseRestS] = useState(0);
  const [seshId, setSeshId] = useState<number>();
  const [showAddNote, setShowAddNote] = useState(false);
  const [notScrolledToTop, setNotScrolledToTop] = useState(false);
  const router = useRouter();
  const addNoteEl = useRef(null);
  const onStartSesh = useCallback((data: Sesh & { intervals: (SeshInterval & { exercise: Exercise })[] }) => {
    setSeshStarted(true);
    setActiveIntervalCounterIsActive(data ? false : true);
    setSeshCounterIsActive(true);
    setSeshId(data ? data.id : undefined);
    setWorkoutSecondsTotal(data.timeCompletedS)
    setPastIntervals(data.intervals || []);
    if (data.orderedExerciseIds.length) {
      const orderedExercises = exercises.sort(
        (a: Exercise, b: Exercise) => {
          // smaller first
          const aIdx = data.orderedExerciseIds.findIndex((id: number) => id === a.id);
          const bIdx = data.orderedExerciseIds.findIndex((id: number) => id === b.id);
          return aIdx - bIdx;
        }
      );
      setExercises(orderedExercises);
      const newActiveExerciseIdx = data && data.orderedExerciseIds.length ?
        // start at first of ordered exercise IDs, since orderedExerciseIds: unfinished exercises, ordered
        orderedExercises.findIndex((exc: Exercise) => exc.id === data.orderedExerciseIds[0])
        : 0;
      setActiveExerciseIdx(newActiveExerciseIdx);
      loadActiveExercisePastActivePeriods(exercises[newActiveExerciseIdx]);
    }
    // set set# + workout set type, based on last saved intervals, if any
    const { setNo: newSetNo, active: newIsActiveSet } = getNextIntervalProps(data.intervals);
    setWorkoutSetNum(newSetNo);
    // auto-start rests
    if (!newIsActiveSet) setActiveIntervalCounterIsActive(true);
    setCurrWorkoutSetType(newIsActiveSet ? WorkoutSetType.Active : WorkoutSetType.Rest);
    window.scrollTo(0, 0);
  }, [
    exercises,
    loadActiveExercisePastActivePeriods
  ]);
  const startSesh = (resumePrevSeshId: any) => {
    // start or resume sesh
    return (
      isUnsavedSesh ?
      Promise.resolve(EMPTY_SESH)
      :
      !isNaN(resumePrevSeshId) ?
      fetch(`/api/sesh/${resumePrevSeshId}`)
      :
      fetch(`/api/sesh`, {
        method: 'POST',
        body: JSON.stringify({
          workoutId: workout.id,
        })
      })
    )
    .then((resp: any) => resp && resp.json ? resp.json() : resp)
    .then(onStartSesh)
    .catch((err: any) => {
      console.error('onStartSesh failed', err);
      alert(`Something went wrong. Workout session cannot be saved. ${err.message}`);
    });
  };
  const isActiveSet = currWorkoutSetType === WorkoutSetType.Active;
  // if (!session) {
  //   if (winReady) router.push(`/signin?error=${'Not logged in'}`);
  // }
  const resumeSesh = (seshId: number) => {
    return startSesh(seshId);
  };
  const unstopSesh = (seshId: number) => {
    return fetch(`/api/sesh/${seshId}?action=unstop`)
  };
  const stopSesh = (seshId: number) => {
    return fetch(`/api/sesh/${seshId}?action=stop`)
  };
  const onSaveCurrentInterval = (
    justSavedInterval: SeshInterval,
    savedIntervalExc: Exercise = activeExercise,
    activeExc: Exercise = activeExercise
  ) => {
    setPastIntervals([
      // save by most recent order
      {
        ...justSavedInterval,
        exercise: {
          ...savedIntervalExc,
          name: savedIntervalExc.name,
        }
      },
      ...pastIntervals,
    ]);
    loadActiveExercisePastActivePeriods(
      activeExc,
      justSavedInterval.exerciseId === activeExc.id ?
        justSavedInterval : undefined
    );
  };
  const startNextSet = () => {
    saveCurrentInterval({
      seshId: seshId,
      exerciseId: activeExercise.id,
      durationS: activeIntervalSecondsTotal,
      setNo: workoutSetNum,
      note: activeExcNote,
      active: currWorkoutSetType === WorkoutSetType.Active,
    })
    .then((interval: SeshInterval) => {
      onSaveCurrentInterval(
        interval,
        activeExercise,
        activeExercise
      );
    });
    if (activeExercise.restBetweenSets && isActiveSet) {
      setCurrWorkoutSetType(WorkoutSetType.Rest)
    } else {
      // go to nex (active) set
      setCurrWorkoutSetType(WorkoutSetType.Active)
      setWorkoutSetNum(workoutSetNum + 1)
      setActiveExcNote('');
    }
    setActiveIntervalSecondsTotal(0);
    setPreExerciseRestS(0);
  }
  const getNewExcWorkoutSetNum = (newActiveExc: Exercise): number => {
    if (
      pastIntervals[0] &&
      newActiveExc.id === pastIntervals[0].exerciseId) {
      // pile on set number of last saved interval,
      // given we are returning to the same last completed exc.
      return pastIntervals[0].setNo + 1;
    }
    return 1;
  };
  const startNearbyExercise = (delta: number) => {
    const newActiveExerciseIdx = activeExerciseIdx + delta;
    const newActiveExc = exercises[newActiveExerciseIdx];
    const setNewExerciseParams = (newActiveExc: Exercise, loadedNotes = false) => {
      setActiveExerciseIdx(newActiveExerciseIdx);
      setShowAddNote(false);
      setWorkoutSetNum(getNewExcWorkoutSetNum(newActiveExc));
      setCurrWorkoutSetType(newActiveExc.isRest ? WorkoutSetType.Rest : WorkoutSetType.Active);
      setActiveIntervalCounterIsActive(newActiveExc.isRest);
      setActiveIntervalSecondsTotal(0);
      setPreExerciseRestS(0);
      setActiveExcNote('');
      if (!loadedNotes) loadActiveExercisePastActivePeriods(newActiveExc);
    };
    if (activeIntervalCounterIsActive) {
      saveCurrentInterval({
        seshId: seshId,
        exerciseId: activeExercise.id,
        durationS: activeIntervalSecondsTotal,
        setNo: workoutSetNum,
        note: activeExcNote,
        active: currWorkoutSetType === WorkoutSetType.Active,
      })
      .then((interval: SeshInterval) => {
        onSaveCurrentInterval(
          interval,
          activeExercise,
          newActiveExc,
        );
      })
      .then(() => {
        setNewExerciseParams(newActiveExc, true);
      });
    } else {
      setNewExerciseParams(newActiveExc);
    }
  };
  const startNextExercise = () => startNearbyExercise(1);
  const startPrevExercise = () => startNearbyExercise(-1);
  const finishWorkout = () => {
    // finish last running set, log workout data, and go to summary
    return fetch(`/api/sesh/${seshId}?action=finish&duration=${workoutSecondsTotal}`)
      .then(() => {
        router.push(`/workout/${workout.id}/sesh/${seshId}?finished=true`);
      })    
  };
  const onExerciseDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }
    // sync with backend
    // if backend successful, update frontend
    const reorderedExercises = reorder(
      seshStarted ?
        exercises.slice(activeExerciseIdx + 1) : exercises,
      result.source.index,
      result.destination.index
    )
    setExercises(seshStarted ? [
      ...exercises.slice(0, activeExerciseIdx),
      activeExercise,
      ...reorderedExercises
    ] : reorderedExercises)
  }
  const handleScroll = () => {
    setNotScrolledToTop(window.pageYOffset !== 0);
  };
  useEffect(() => {
    setWinReady(true);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  useEffect(() => {
    const pauseActiveSesh = () => {
      setActiveIntervalCounterIsActive(false);
      setSeshCounterIsActive(false);
      return fetch(`/api/sesh/${seshId}?action=pause&duration=${workoutSecondsTotal}` +
        `&orderedExerciseIds=${exercises.slice(activeExerciseIdx).map((exc: any) => exc.id).join(',')}`
      )
    };
    const handleRouteChange = function() {
      if (seshId) pauseActiveSesh();
    };

    window.addEventListener('beforeunload', handleRouteChange);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      // @ts-ignore
      window.removeEventListener('beforeunload', handleRouteChange);
      router.events.off('routeChangeStart', handleRouteChange);
    }
  }, [seshId, seshStarted, workoutSecondsTotal, router.events, activeExerciseIdx, exercises, onStartSesh])

  if (error) {
    console.error(error)
    return (
      <div className="p-3 max-w-md mx-auto my-14">
        <h1 className="text-3xl font-bold mb-4">
          404 Not Found
        </h1>
        <h1 className="text-xl font-semibold">
          We couldn&apos;t find what you were looking for.
        </h1>
        <div className="mt-3 text-red-500">
          {JSON.stringify(error)}
        </div>
      </div>
    )
  }

  const shareLink = !winReady ? '' : `${window.location.host}/w/${workout.slug}`;
  
  return (
    <Layout title="Workout Sesh" background="#9ca3a5">
      {
        notScrolledToTop &&
        seshStarted &&
        <div
          onClick={() => window && window.scrollTo(0, 0)}
          className="fixed left-0 bottom-0 right-0 m-5 z-50 text-center">
          <div className="bg-black/50 text-white text-sm py-2 px-3 rounded-full inline-block">
            Back to Top <ArrowUpIcon className="inline-block h-4 -mt-0.5" />
          </div>
        </div>
      }
      <main className={classNames(
        {
          "min-h-[100vh] bg-gradient-to-b from-active1 to-active2": !seshStarted,
          "h-[100vh]": seshStarted,
        }
      )}>
        <div className="max-w-md relative mx-auto">
          <div className={classnames(
            "transition-all",
            {
              "bg-transparent": !seshStarted,
              "text-white bg-gradient-to-b from-active1 to-active2": seshStarted && isActiveSet,
              "text-white bg-gradient-to-b from-rest1 to-rest2": seshStarted && !isActiveSet,
              "flex flex-col": seshStarted,
            }
          )}>
            {
              isConfirmingStop &&
              <ConfirmStopWorkoutModal
                open={isConfirmingStop}
                onClose={() => setIsConfirmingStop(false)}
                onConfirm={finishWorkout}
              />
            }
            {
              !seshStarted &&
              <header className="pt-8 text-left mx-2 text-white">
                <div className="text-3xl">
                  🤾‍♀️
                </div>
                <h1 className="text-3xl mb-5 font-bold">
                  {workout.name}
                </h1>
                {
                  winReady &&
                  <div className="mb-4 flex items-center">
                    <ShareIcon className="h-4 inline-block mr-2 text-white/50" />
                    <a target="_blank"
                      className="text-white" href={`//${shareLink}`} rel="noreferrer">
                      {shareLink.replace(window.location.host, '')}
                    </a>
                  </div>
                }
                {
                  workout.seshes && workout.seshes.length && seshId === undefined ?
                  <ActiveSeshes
                    seshes={unfinishedSeshes}
                    resumeSesh={resumeSesh}
                    stopSesh={stopSesh}
                    unstopSesh={unstopSesh}
                  />
                  : null
                }
              </header>
            }
            <div
              className={classNames(
                "text-center flex items-center md:min-h-[calc(100% - 32px)] max-w-xl",
                {
                  "hidden": !seshStarted
                }
              )}
            >
              <div className={classnames(
                "mt-0 w-full flex flex-col justify-center",
                {
                  "opacity-25": !isActiveSet,
                }
              )} style={{
                minHeight: '350px'
              }}>
                <div>
                  {
                    activeExercise.imageUrl && String(activeExercise.imageUrl).match(/\.(jpeg|jpg|gif|png)$|data/) ?
                    <Image
                      src={activeExercise.imageUrl}
                      alt="Active Exercise"
                      priority
                      height={500}
                      width={500}
                      placeholder={require('./routine-placeholder.png')}
                      className="w-full text-center inline-block"
                    />
                    :
                    activeExercise.imageUrl ?
                    <video
                      autoPlay={true}
                      playsInline={true}
                      loop
                      muted
                      src={activeExercise.imageUrl}
                    />
                    :
                    <h1 className="text-white text-3xl">
                      {activeExercise.name}
                    </h1>
                  }
                  <div className={classNames(
                    "relative flex ease-linear items-center bg-white overflow-hidden w-full",
                  )}>
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames(
              {
                "bg-gradient-to-b from-transparent via-active2 to-active2": seshStarted && isActiveSet,
                "bg-gradient-to-b from-transparent via-[#353e94] to-[#353e94]": seshStarted && !isActiveSet,
                // "absolute bottom-0": seshStarted,
                "hidden": !seshStarted,
              }
            )}>
              <div className="flex flex-col justify-center">
                <div
                  className={classnames(
                  "px-3 flex flex-col justify-center",
                  {
                    "pt-5 pb-2": !seshStarted,
                    "pt-5": seshStarted
                  })}>
                    <header className="mx-2 w-full items-center mb-0.5">
                      {isActiveSet ? (
                        <>
                          <div className="text-2xl font-bold relative">
                            <Clamped clamp={2}>
                              <BoltIcon className={classNames(
                                "inline-block z-10 h-5 -mt-0.5 mr-2 px-0.5",
                                {
                                  "text-gray-400": !activeIntervalCounterIsActive,
                                  "text-brightGreen": activeIntervalCounterIsActive,
                                }
                              )} />
                              <BoltIcon className={classNames(
                                "absolute left-0 top-2 inline-block z-10 h-5 -mt-0.5 mr-2 px-0.5",
                                {
                                  "text-brightGreen animate-ping": activeIntervalCounterIsActive,
                                }
                              )} />
                              {
                                isActiveSet &&
                                activeIntervalCounterIsActive &&
                                false &&
                                <span
                                  className="animate-ping rounded-full h-5 w-5 ml-0.5 bg-brightGreen inline-block align-middle absolute left-0 top-1"
                                />
                              }
                              {activeExercise.name}
                            </Clamped>
                          </div>
                        </>
                      ) : 
                      <div className="flex">
                        <div className="text-2xl font-bold align-top">
                          <BoltSlashIcon className={classNames(
                            "inline-block h-5 -mt-0.5 mr-1",
                            {
                              "text-gray-400": !activeIntervalCounterIsActive,
                              "animate-pulse text-blue-300": activeIntervalCounterIsActive,
                            }
                          )} /> Rest
                          <span className="font-light text-base ml-2 mr-2 inline-block align-middle">
                            {
                              !activeExercise.isRest &&
                              activeExercise.betweenSetsRestTimeLimitS ?
                              <>
                                <span className="text-xl mr-1">
                                  <span className="opacity-60">for</span> <DurationText
                                    durationM={moment.duration(activeExercise.betweenSetsRestTimeLimitS, 'seconds')}
                                  />
                                </span>
                                <RestCounterBadge
                                  timerS={activeIntervalSecondsTotal}
                                  timeLimitS={activeExercise.betweenSetsRestTimeLimitS}
                                />
                              </>
                              :
                              (activeExercise.isRest && activeExercise.timeLimitS) ?
                              <>
                                <span className="text-xl mr-1">
                                  <span className="opacity-60">for</span> <DurationText
                                    durationM={moment.duration(activeExercise.timeLimitS, 'seconds')}
                                  />
                                </span>
                                <RestCounterBadge
                                  timerS={activeIntervalSecondsTotal}
                                  timeLimitS={activeExercise.timeLimitS}
                                />
                              </>
                              :
                              <>
                                {/* <span className="opacity-60 mr-1">Next:</span> Set #{workoutSetNum + 1} */}
                              </>
                            }
                          </span>
                        </div>
                      </div>
                    }
                    </header>
                    <div className="flex min-h-[75px] items-center">
                      {
                        activeIntervalCounterIsActive ?
                        <SeshCounter
                          className={classNames(
                            "pl-2 min-w-[70px] pb-0 font-semibold tracking-widest text-6xl relative",
                            {
                              "hidden": !seshStarted,
                            }
                          )}
                          key={[
                            workoutSetNum,
                            isActiveSet,
                            activeExerciseIdx
                          ].join('-')}
                          isActiveSet={isActiveSet}
                          seshStarted={seshStarted}
                          active={activeIntervalCounterIsActive}
                          secondsTotal={activeIntervalSecondsTotal}
                          setSecondsTotal={setActiveIntervalSecondsTotal}
                        />
                        :
                        <div className="flex cursor-pointer" onClick={() => setActiveIntervalCounterIsActive(true)}>
                          <PlayCircleIcon
                            className="cursor-pointer inline-block h-[75px] text-brightGreen" />
                        </div>
                      }
                      {
                        !activeExercise.isRest &&
                        <div className="flex-1 pl-2">
                          {
                            activeExercise.setsDescription &&
                            <div>
                              <span className="opacity-60 mr-2 w-[40px] inline-block">Sets</span>{activeExercise.setsDescription}
                            </div>
                          }
                          {
                            activeExercise.repsDescription &&
                            <div>
                              <span className="opacity-60 mr-2 w-[40px] inline-block">Reps</span>{activeExercise.repsDescription}
                            </div>
                          }
                        </div>
                      }
                    </div>
                </div>
              </div>
              {/* set descriptor */}
              <div className={classNames(
                "px-5 min-h-[30px] flex items-center",
              )}>
                <div className="flex-1">
                  {
                    activeIntervalCounterIsActive ?
                    <div className="text-lg">
                      {
                        activeExercise.setsDescription &&
                        <div className="mr-2">
                          <span className="opacity-50 mr-1.5">Set</span>
                          <span className="font-semibold mr-1">{workoutSetNum}</span>
                          <span className="opacity-50 mr-1.5">out of</span>
                          <span className="font-semibold">{activeExercise.setsDescription}</span>
                        </div>
                      }
                    </div>
                    :
                    <div className="m-1">
                      <SeshCounter
                        active={!activeIntervalCounterIsActive}
                        seshStarted={true}
                        className="inline-block font-semibold text-lg min-w-[40px] w-[40px]"
                        secondsTotal={preExerciseRestS}
                        setSecondsTotal={setPreExerciseRestS}
                      />
                      <span className="inline-block ml-4 opacity-60 align-top mt-[1px]">
                        Pre-Exercise Rest
                      </span>
                    </div>
                  }
                </div>
                <div
                  onClick={() => {
                    setShowAddNote(!showAddNote);
                  }}
                  className={classNames(
                    "relative -top-0.5 px-1 inline-block align-top cursor-pointer",
                  )}>
                  + <ChatBubbleLeftIcon className="h-4 inline-block align-middle" />
                </div>
              </div>
              {
                activeExerciseActiveNotedPeriodsByMostRecent[0] &&
                <div className="mx-5 text-base flex mb-2">
                  <div className="flex-1 max-h-[120px] overflow-y-auto">
                    <div className="flex pt-2">
                      <div>
                        <ChatBubbleLeftIcon className="h-5 mr-3 ml-1 inline-block" />
                      </div>
                      <div>
                        <IntervalNote
                          className="mr-2"
                          interval={activeExerciseActiveNotedPeriodsByMostRecent[0]}
                        />
                        {
                          showAdditionalActiveExerciseNotes &&
                          activeExerciseActiveNotedPeriodsByMostRecent.length ?
                          activeExerciseActiveNotedPeriodsByMostRecent
                          .slice(1)
                          .map((activeExerciseActivePeriod: SeshInterval, i: number) => (
                            <IntervalNote
                              key={i}
                              className="my-2"
                              interval={activeExerciseActivePeriod}
                            />
                          ))
                          :
                          (
                            showAdditionalActiveExerciseNotes &&
                            <div className="ml-5 mt-1 italic">
                              No more notes.
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={toggleShowActiveExerciseNotes}
                    className="ml-1 text-white cursor-pointer">
                    <ChevronDownIcon className={classNames(
                      "h-5 inline-block mt-2.5",
                      {
                        "rotate-180": showAdditionalActiveExerciseNotes
                      }
                    )} />
                  </div>
                </div>
              }
              {
                showAddNote &&
                <div className="px-1 py-1 mx-3 flex">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      ref={addNoteEl}
                      value={activeExcNote}
                      onChange={(e: any) => setActiveExcNote(e.target.value)}
                      placeholder={`Note for ${!isActiveSet && activeExercise.restBetweenSets ? 'Previous ' : ''}Set #${workoutSetNum}`}
                      className="text-base focus:text-white bg-white/20 group focus:outline-none rounded-full w-full transition-all py-2 pl-[45px] pr-4 text-white"
                    />
                    <span className="inline-block text-white/60 group:text-white font-semibold align-middle absolute left-[12px] top-[8.5px] z-2">
                      <ChatBubbleLeftIcon className="h-4 -mt-1 ml-1 mr-1 inline-block" />
                    </span>
                  </div>
                </div>
              }
              <div
                className={classnames(
                  "mt-0 font-bold",
                  "transition-all",
                  "flex flex-col justify-center",
                  {
                    "hidden": !seshStarted,
                    "bg-transparent text-white": seshStarted,
                    // "bg-[#646ccc] text-white": seshStarted && !isActiveSet,
                    "text-black bg-brightGreen py-5": !seshStarted
                  }
                )}>
                  <div className={classNames(
                    "flex h-auto",
                    {
                      "text-white": seshStarted,
                    }
                  )}>
                    <div
                      onClick={(!seshStarted || activeExerciseIdx === 0) ? undefined : startPrevExercise}
                      className={classNames(
                        "flex items-center px-3",
                        {
                          "cursor-pointer": seshStarted && activeExerciseIdx > 0,
                        }
                      )}>
                        <BackwardIcon className={classNames(
                          "text-white h-16 p-4 rounded-full bg-white/10",
                          {
                            "collapse": !seshStarted || activeExerciseIdx === 0,
                          }
                        )} />
                    </div>
                    {
                      seshStarted ? (
                        <button
                          onClick={
                            activeIntervalCounterIsActive ?
                            (
                              activeExercise.isRest && isLastExercise ?
                              () => setIsConfirmingStop(true) :
                              activeExercise.isRest ?
                                startNextExercise :
                                startNextSet
                            ) :
                            () => setActiveIntervalCounterIsActive(true)
                          }
                          className={classNames(
                            "cursor-pointer flex-1 py-3 text-left",
                          )}>
                          <div>
                            <div className="mx-2">
                              <div className={classNames(
                                "rounded-full",
                                "px-0",
                                {
                                  "bg-white/20": seshStarted,
                                }
                              )}>
                                <div className="flex text-xl mb-0 mt-0 tracking-widest">
                                  {
                                    isActiveSet ? (
                                      <>
                                      {
                                        activeIntervalCounterIsActive ?
                                        <CheckIcon className="border-r-2 border-white/10 ml-2 px-3 py-5 h-[84px] inline-block text-brightGreen" /> :
                                        <PlayIcon className="border-r-2 border-white/10 ml-2 px-3 py-5 h-[84px] inline-block text-brightGreen" />
                                      }
                                      <div className="pl-4 text-xl flex-1 align-middle flex flex-col justify-center">
                                        <div className="text-base tracking-normal font-normal text-white/60">
                                          {
                                            activeIntervalCounterIsActive ?
                                            'Finish' : 'Start'
                                          }
                                        </div>
                                        <div className={classNames(
                                          "text-xl tracking-normal w-full pr-3 overflow-hidden font-semibold text-white",
                                        )}>
                                          <Clamped clamp={1}>
                                            Set #{workoutSetNum}
                                          </Clamped>
                                        </div>
                                      </div>
                                      </>
                                    )
                                    :
                                    <div className="flex">
                                      {
                                        activeExercise.isRest ?
                                        <CheckIcon className="border-r-2 border-white/30 ml-2 px-3 py-5 h-[84px] inline-block text-brightGreen" />
                                        :
                                        <BoltIcon className="border-r-2 border-white/30 ml-2 px-3 py-5 h-[84px] inline-block text-brightGreen" />
                                      }
                                      <div className="pl-4 text-xl flex-1 align-middle flex flex-col justify-center">
                                        {
                                          activeExercise.isRest && isLastExercise ?
                                          <span className="tracking-normal text-base leading-tight font-semibold">Finish workout!</span>
                                          :
                                          <>
                                            <div className="text-base tracking-normal font-normal text-white/60">
                                              Start Next
                                            </div>
                                            <div className={classNames(
                                              "tracking-normal w-full pr-3 overflow-hidden text-white",
                                              {
                                                "text-xl": !activeExercise.isRest,
                                                "text-base": activeExercise.isRest,
                                              }
                                            )}>
                                              <Clamped clamp={1}>
                                                {getNextPeriodText().setText}
                                              </Clamped>
                                            </div>
                                          </>
                                        }
                                      </div>
                                    </div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div
                          className="cursor-pointer flex-1 text-2xl h-[56px] text-center">
                          <PlayCircleIcon className="h-16 inline-block -mt-0.5" />
                        </div>
                      )
                    }
                    <div
                      onClick={
                        activeExerciseIdx === exercises.length - 1 ?
                          () => setIsConfirmingStop(true)
                          : startNextExercise
                      }
                      className={classNames(
                        "flex items-center px-3 cursor-pointer",
                        {
                          "hidden": !seshStarted
                        }
                      )}>
                        {
                          activeExerciseIdx === exercises.length - 1 ?
                          <StopIcon className="text-white h-16 p-4 rounded-full bg-white/10" />
                          :
                          <ForwardIcon className="text-white h-16 p-4 rounded-full bg-white/10" />
                        }
                    </div>
                  </div>
                  {/* <div className="text-sm text-white/40 mt-1 mb-2 tracking-normal font-normal mx-4 normal-case">
                    <div className="flex text-left">
                      {
                        exercises[activeExerciseIdx - 1] &&
                        <div className="flex-1 flex">
                          <div className="mr-1">
                            <BackwardIcon className="inline-block h-4 -mt-0.5 mr-1" />
                          </div>
                          <div className="flex-1">
                            <Clamped clamp={1}>
                              {exercises[activeExerciseIdx - 1].name}
                            </Clamped>
                          </div>
                        </div>
                      }
                      {
                        !isLastExercise &&
                        <div className="flex-1 flex text-right">
                          <div className="flex-1">
                            <Clamped clamp={1}>
                              {exercises[activeExerciseIdx + 1].name}
                            </Clamped>
                          </div>
                          <div className="ml-1">
                            <ForwardIcon className="inline-block h-4 -mt-0.5 mr-1" />
                          </div>
                        </div>
                      }
                    </div>
                  </div> */}
              </div>
            </div>
          </div>
          <section className={classNames(
            "px-2 z-50 transition-all overflow-auto",
            {
              "bg-active2": seshStarted && isActiveSet,
              "bg-[#353e94]": seshStarted && !isActiveSet,
            },
            {
              // "top-[55px] min-h-[100vh]": expanded,
            }
          )} style={{
            // top: (seshStarted && !expanded) ? 'calc(100vh - 70px)' : '',
          }}>
            <div className="pb-8 bg-transparent">
              {
                !seshStarted ?
                <h2 className="text-white font-semibold text-2xl mb-3 mt-3">
                  Exercises <span className="text-white/60 font-normal">({exercises.length})</span>
                </h2>
                :
                <h2 className={classNames(
                  "text-white font-semibold text-lg mb-0.5 flex",
                )}>
                  <span
                    onClick={() => setActiveBottomTab(BottomTab.Exercises)}
                    className={classNames(
                      "cursor-pointer inline-block px-2 pb-0",
                      {
                        "opacity-60": activeBottomTab !== BottomTab.Exercises,
                      }
                    )}>
                    Upcoming <span className="text-white/60 font-normal">({exercises.length - activeExerciseIdx - 1})</span>
                  </span>
                  <span
                    onClick={() => setActiveBottomTab(BottomTab.History)}
                    className={classNames(
                      "cursor-pointer inline-block px-2 pb-0",
                      {
                        "opacity-60": activeBottomTab !== BottomTab.History,
                      }
                    )}>
                    History
                  </span>
                  <div className="flex-1 text-right mr-3">
                    <span className="font-normal text-white/60 mr-1">Total</span>
                    <SeshCounter
                      className="font-semibold text-white inline-block ml-1"
                      active={seshStarted && seshCounterIsActive}
                      secondsTotal={workoutSecondsTotal}
                      setSecondsTotal={setWorkoutSecondsTotal}
                    />
                  </div>
                </h2>
              }
              <div className={classNames(
                "overflow-hidden",
              )}>
                {
                  winReady &&
                  activeBottomTab === BottomTab.Exercises &&
                  <DragDropContext onDragEnd={onExerciseDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            paddingBottom: snapshot.isDraggingOver ? 100 : 0,
                          }}
                        >
                            {
                              (
                                seshStarted ?
                                exercises.slice(activeExerciseIdx + 1) :
                                exercises
                              ).map((exercise: any, i: number) => {
                                return (
                                  <Draggable
                                    index={i}
                                    key={String(exercise.id)}
                                    draggableId={String(exercise.id)}
                                  >
                                    {(provided: any, snapshot: any) => (
                                      <article
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <WorkoutRoutine
                                          counter={i + 1}
                                          isFirst={i === 0}
                                          isLast={i === exercises.length - activeExerciseIdx - (seshStarted ? 2 : 1)}
                                          exercise={exercise}
                                          isDragging={snapshot.isDragging}
                                          isDraggingClassName={
                                            seshStarted && isActiveSet ? "bg-active2" :
                                            seshStarted && !isActiveSet ? "bg-[#353e94]" :
                                            "bg-gray-700"
                                          }
                                        />
                                      </article>
                                    )}
                                  </Draggable>
                                )
                              })
                            }
                          </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                }
                {
                  activeBottomTab === BottomTab.History &&
                  <SeshHistoryContainer
                    intervals={pastIntervals}
                    workoutName={workout.name}
                    workoutId={workout.id}
                  />
                }
                <div className="mx-2 mt-2 bg-white/10 text-white/60 p-4 mb-4 rounded-lg">
                  <h3 className="mb-0.5">
                    {workout.name}
                  </h3>
                  <SeshCounter
                    className="font-semibold text-2xl text-white"
                    active={seshStarted && seshCounterIsActive}
                    secondsTotal={workoutSecondsTotal}
                    setSecondsTotal={setWorkoutSecondsTotal}
                  />
                  <span className="text-white/60 mr-2">Total Workout Time</span>
                </div>
                <div className="mx-2">
                  <button
                      onClick={seshStarted ? finishWorkout : startSesh}
                      className={classNames(
                        "w-full py-3 px-3 rounded-lg font-bold",
                        "text-black text-xl bg-brightGreen text-left"
                      )}>
                      {
                        seshStarted ?
                        <>
                          <CheckIcon className="h-6 inline-block align-top mt-0.5" /> Finish Workout
                        </> : <div>
                          <PlayIcon className="h-10 inline-block align-middle mr-2" />
                          <span className="inline-block align-middle">
                            Start
                          </span>
                        </div>
                      }
                    </button>
                </div>
              </div>
              {
                !seshStarted &&
                <Link
                  href="/"
                  className="block py-4 text-lg text-center text-white/60 cursor-pointer">
                  Cancel
                </Link>
              }
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}

export default withSeshHistoryExercises(WorkoutSeshPlayer);
