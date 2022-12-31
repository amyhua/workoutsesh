import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import Layout from '../../../components/Layout'
import SeshCounter from '../../../components/SeshCounter'
import classnames from 'classnames'
import WorkoutRoutine from '../../../components/WorkoutRoutine'
import { resetServerContext, DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Clamped from '../../../components/Clamped'
import classNames from 'classnames'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'
import { ArrowLeftIcon, ArrowRightCircleIcon, ArrowRightIcon, ArrowUpIcon, BackwardIcon, Bars3Icon, BoltIcon, BoltSlashIcon, ChatBubbleLeftIcon, CheckCircleIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon, ForwardIcon, ListBulletIcon, PencilIcon, PlayCircleIcon, PlayIcon, StopCircleIcon, StopIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import withSeshHistoryExercises from '../../../components/withSeshHistoryExercises'
import ActiveSeshes from '../../../components/ActiveSeshes'
import { SeshDto } from '../../../types'
import { Exercise, Sesh, SeshInterval } from '@prisma/client'
import { getNextIntervalProps, getShownExercises } from '../../../lib/sesh-utils'
import SeshHistoryContainer from '../../../components/SeshHistoryContainer'
import moment from 'moment'
import { formatShortFromNow } from '../../../lib/time-utils'
import DurationText from '../../../components/DurationText'
import RestCounterBadge from '../../../components/RestCounterBadge'
import IntervalNote from '../../../components/IntervalNote'
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

function WorkoutSesh({
  workout,
  error,
  saveCurrentInterval,
}: any) {
  const session = useSession();
  workout = workout ? JSON.parse(workout) : {};
  error = error ? JSON.parse(error) : undefined;
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
    return fetch(`/api/intervals?exerciseId=${exercise.id}`)
      .then((r: any) => r.json())
      .then((intervals: SeshInterval[]) => {
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
  const [expanded, setExpanded] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState(BottomTab.Exercises);
  const [winReady, setWinReady] = useState(false);
  const [isConfirmingStop, setIsConfirmingStop] = useState(false);
  const [activeExcNote, setActiveExcNote] = useState('');
  const [activeIntervalSecondsTotal, setActiveIntervalSecondsTotal] = useState(0);
  const [workoutSecondsTotal, setWorkoutSecondsTotal] = useState(0);
  const [preExerciseRestS, setPreExerciseRestS] = useState(0);
  const [seshId, setSeshId] = useState<number>();
  const [showAddNote, setShowAddNote] = useState(false);
  const router = useRouter();
  const addNoteEl = useRef(null);
  const onStartSesh = useCallback((data: Sesh & { intervals: (SeshInterval & { exercise: Exercise })[] }) => {
    setSeshId(data.id);
    setWorkoutSecondsTotal(data.timeCompletedS)
    setSeshStarted(true);
    setActiveIntervalCounterIsActive(data ? false : true);
    setSeshCounterIsActive(true);
    setExpanded(false);
    setPastIntervals(data.intervals);
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
      const newActiveExerciseIdx = data.orderedExerciseIds.length ?
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
  }, [
    exercises,
    loadActiveExercisePastActivePeriods
  ]);
  const startSesh = (resumePrevSeshId: any) => {
    // start or resume sesh
    return (
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
    .then((resp: any) => resp.json())
    .then(onStartSesh)
    .catch((err: any) => {
      console.error('onStartSesh failed', err);
      alert(`Something went wrong. Workout session cannot be saved. ${err.message}`);
    });
  };
  const isActiveSet = currWorkoutSetType === WorkoutSetType.Active;
  if (!session) {
    if (winReady) router.push(`/signin?error=${'Not logged in'}`);
  }
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
  useEffect(() => {
    setWinReady(true);
  }, [])

  useEffect(() => {
    const pauseActiveSesh = () => {
      setActiveIntervalCounterIsActive(false);
      setSeshCounterIsActive(false);
      return fetch(`/api/sesh/${seshId}?action=pause&duration=${workoutSecondsTotal}` +
        `&orderedExerciseIds=${exercises.slice(activeExerciseIdx).map((exc: any) => exc.id).join(',')}`
      )
    };
    const unpauseActiveSesh = () => {
      return fetch(`/api/sesh/${seshId}?action=unpause`)
        .then((r: any) => r.json())
        .then(onStartSesh)
    };

    const visibilityChangeHandler = function() {
      if (document.visibilityState !== 'visible') {
        if (seshStarted) pauseActiveSesh();
      } else {
        if (seshStarted) unpauseActiveSesh();
      }
    };
    const handleRouteChange = function() {
      if (seshId) pauseActiveSesh();
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler, {
      passive: true
    });
    window.addEventListener('beforeunload', handleRouteChange);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      // @ts-ignore
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
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
        <p className="mt-3 text-red-500">
          {JSON.stringify(error)}
        </p>
      </div>
    )
  }
  
  return (
    <Layout title="Workout Sesh" background="#9ca3a5">
      <main className={classNames(
        "bg-gray-400",
        {
          "min-h-[100vh]": !seshStarted,
          "h-[100vh] overflow-hidden absolute top-0 bottom-0 left-0 right-0": seshStarted,
        }
      )}>
        <div className="max-w-md relative mx-auto">
          <div className={classnames(
            "transition-all",
            {
              "text-white bg-gradient-to-b from-active1 to-active2": seshStarted && isActiveSet,
              "text-white bg-gradient-to-b from-rest1 to-rest2": seshStarted && !isActiveSet,
              "h-[100vh] flex flex-col": seshStarted,
            }
          )}>
            {
              isConfirmingStop &&
              <div className="py-3 px-4 flex text-white bg-black">
                <span className="py-1 font-semibold">
                  <StopIcon className="text-red-400 inline-block h-4 align-middle relative -top-0.5 mr-1" /> Finish this workout?
                </span>
                <div className="flex-1 text-right mt-0.5">
                  <button
                    onClick={() => setIsConfirmingStop(false)}
                    className="mx-3 py-1 px-3 rounded-full bg-gray-700 text-sm">
                    Cancel
                  </button>
                  <button
                    onClick={finishWorkout}
                    className="ml-1 py-1 px-3 rounded-full font-semibold bg-brightGreen text-black text-sm">
                    Finish
                  </button>
                </div>
              </div>
            }
            <div className={classNames(
              "z-50 flex text-base text-white font-normal mx-5 pt-3"
            )}>
              <div className="flex-1">
                <span className='overflow-hidden text-ellipsis w-full inline-block'>
                  {workout.name}
                </span>
              </div>
              {
                seshStarted ?
                <>
                  <SeshCounter
                    className="font-semibold text-right opacity-60 mt-1 mr-1"
                    active={seshStarted && seshCounterIsActive}
                    secondsTotal={workoutSecondsTotal}
                    setSecondsTotal={setWorkoutSecondsTotal}
                  />
                  <span
                    onClick={() => setIsConfirmingStop(true)}
                    className="cursor-pointer inline-block mt-1.5 ml-2 text-red-300 text-sm rounded-full">
                    <StopIcon className="inline-block h-4 align-middle relative -top-0.5" />
                  </span>
                </>
                :
                <Link className="text-white/60" href="/">Cancel</Link>
              }
            </div>
            <div
              className={classNames(
                "px-4 text-center flex items-center md:min-h-[calc(100% - 32px)] max-w-xl",
                {
                  "hidden": !seshStarted
                }
              )}
              style={{
                height: 'calc(100vh - 475px)'
              }}>
              <div className={classnames(
                "mt-0 sm:mt-5 w-full flex flex-col justify-center",
                {
                  "opacity-25": !isActiveSet,
                }
              )} style={{
                minHeight: 'calc(100% - 32px)'
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
                      placeholder={require('../../../components/routine-placeholder.png')}
                      className="w-full text-center inline-block"
                    />
                    :
                    activeExercise.imageUrl ?
                    <video
                      autoPlay={true}
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
              "pt-[50px] left-0 right-0",
              {
                "bg-gradient-to-b from-transparent via-active2 to-active2": seshStarted && isActiveSet,
                "bg-gradient-to-b from-transparent via-[#353e94] to-[#353e94]": seshStarted && !isActiveSet,
                "absolute bottom-0": seshStarted,
                "hidden": !seshStarted,
                // "absolute left-0 right-0": seshStarted,
              }
            )}>
              <div className="flex flex-col justify-center">
                <div
                  className={classnames(
                  "px-3 flex flex-col justify-center",
                  {
                    "pt-5 pb-2": !seshStarted,
                    "pt-3": seshStarted
                  })}>
                    <header className={classNames(
                      "mx-2 w-full items-center",
                      "mb-0",
                    )}>
                      {isActiveSet ? (
                        <>
                          <div className="text-2xl font-bold">

                            <Clamped clamp={2}>
                              <BoltIcon className={classNames(
                                "inline-block h-5 -mt-0.5 mr-1",
                                {
                                  "text-gray-400": !activeIntervalCounterIsActive,
                                  "animate-pulse text-brightGreen": activeIntervalCounterIsActive,
                                }
                              )} /> {activeExercise.name}
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
                    <div className="flex">
                      {
                        activeIntervalCounterIsActive ?
                        <SeshCounter
                          className={classNames(
                            "pl-2 pt-2 pb-0 font-semibold tracking-widest text-6xl relative",
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
                          {/* <h2 className="font-bold text-2xl py-6 ml-2 mr-5">Start</h2> */}
                        </div>
                      }
                      {
                        !activeExercise.isRest &&
                        <div className="flex-1 pt-2.5 pl-2">
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
                "px-5 flex min-h-[36px]",
              )}>
                <div className="flex-1">
                  {
                    activeIntervalCounterIsActive ?
                      (activeExercise.isRest || !isActiveSet) ?
                      <div className={classNames(
                        {
                          "mt-1.5": !isActiveSet
                        }
                      )}>
                        <Clamped clamp={1}>
                          <span className="mr-2 text-white/60 flex">
                            <span className="text-white text-right flex-1">
                              {
                                getNextPeriodText().setNum ?
                                <>
                                  <span className="opacity-50 text-base mr-1.5 align-bottom">
                                    Set
                                  </span>
                                  <span className="text-base font-semibold mr-1">{workoutSetNum}</span>
                                  <span className="opacity-50 text-base mr-1.5">out of</span>
                                  <span className="text-base font-semibold">{activeExercise.setsDescription}</span>
                                </>
                                :
                                <>
                                  <em className="italic mr-2">Next up...</em> {getNextPeriodText().setText}
                                </>
                              }
                              </span>
                            </span>
                        </Clamped>
                      </div>
                      :
                      <div className="flex relative top-1.5">
                        {/* <div className="inline-block -mt-1.5 mr-2">
                          <span className="mt-1.5 text-lg align-bottom font-bold inline-block">Set #{workoutSetNum}</span>
                        </div> */}
                        <div className="flex-1">
                          {
                            new Array(workoutSetNum - 1).fill(0).map((_, i) => (
                              <CheckIcon key={i} className="h-5 inline-block align-top" />
                            ))
                          }
                          <CheckIcon className="h-5 inline-block align-top text-brightGreen" />
                        </div>
                        {
                          activeExercise.setsDescription &&
                          <div className="mt-0 mr-2">
                            <span className="opacity-50 text-base mr-1.5">Set</span>
                            <span className="text-base font-semibold mr-1">{workoutSetNum}</span>
                            <span className="opacity-50 text-base mr-1.5">out of</span>
                            <span className="text-base font-semibold">{activeExercise.setsDescription}</span>
                          </div>
                        }
                      </div>
                    :
                    <div className="m-1">
                      <SeshCounter
                        active={!activeIntervalCounterIsActive}
                        seshStarted={true}
                        className="inline-block font-semibold text-lg"
                        secondsTotal={preExerciseRestS}
                        setSecondsTotal={setPreExerciseRestS}
                      />
                      <span className="ml-2 opacity-60">
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
                    "px-1 -mt-[2px] py-1.5 inline-block align-top cursor-pointer",
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
                        <ChatBubbleLeftIcon className="h-5 -mt-0.5 mr-3 ml-1 inline-block" />
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
                      <ChatBubbleLeftIcon className="h-4 -mt-2 ml-1 mr-2 inline-block" />
                    </span>
                  </div>
                </div>
              }
              <div
                className={classnames(
                  "mt-0 font-bold",
                  "transition-all",
                  "flex flex-col justify-center pb-[70px]",
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
                          // "bg-gray-100 text-gray-600 hover:text-gray-700": seshStarted && isActiveSet,
                          // "bg-[#858df0] text-white": seshStarted && !isActiveSet,
                          // "bg-gray-300 text-gray-600 hover:text-gray-700": seshStarted,
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
                            {
                              // "bg-gray-100 text-gray-600 hover:text-gray-700": seshStarted,
                              // "bg-white text-black": seshStarted && isActiveSet,
                              // "bg-[#9fa7fe] text-white": seshStarted && !isActiveSet,
                            }
                          )}>
                          <div>
                            <div className="mx-2">
                              <div className={classNames(
                                "rounded-full",
                                "px-0",
                                {
                                  "bg-white/20": seshStarted,
                                  // "bg-[#3c4095] text-white": seshStarted && !isActiveSet,
                                  // "bg-black text-white": !isActiveSet,
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
                                              "tracking-normal w-full pr-3 overflow-hidden font-semibold text-white",
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
                  <div className="text-sm text-white/40 rounded-full tracking-normal font-normal mx-5 normal-case">
                    <div className="flex text-left">
                      {
                        exercises[activeExerciseIdx - 1] &&
                        <div className="flex-1 flex">
                          <div className="mr-2">
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
                          <div className="ml-2">
                            <ForwardIcon className="inline-block h-4 -mt-0.5 mr-1" />
                          </div>
                        </div>
                      }
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <section className={classNames(
            "px-5 pt-2 z-50 transition-all",
            {
              "bg-active2": seshStarted && isActiveSet,
              "bg-[#353e94]": seshStarted && !isActiveSet,
              "bg-transparent": !seshStarted,
              "absolute left-0 right-0 bottom-0": seshStarted,
              "overflow-auto": seshStarted && expanded,
            },
            {
              "top-[55px] min-h-[100vh]": expanded,
            }
          )} style={{
            top: (seshStarted && !expanded) ? 'calc(100vh - 70px)' : '',
          }}>
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
            <div className="pb-10 bg-transparent">
              <div className={classNames(
                "shadow-xl drop-shadow-xl",
              )} style={{
                filter: 'drop-shadow(0 -5px 25px rgb(0 0 0 / 4%)) drop-shadow(0 0px 40px rgb(0 0 0 / 0.1))',
              }}>
                <div className={classnames(
                  "flex pt-2 px-3 uppercase tracking-wider font-bold",
                  "text-sm rounded-t-2xl transition-all",
                  {
                    "pb-0.5": activeBottomTab === BottomTab.Exercises,
                    "pb-2": activeBottomTab === BottomTab.History,
                    "bg-white/90": !expanded,
                    "bg-white": expanded,
                  }
                )}>
                  <div className={classNames(
                    {
                    "rounded-full": !seshStarted,
                  })} style={{
                    lineHeight: seshStarted ? '32px' : '',
                  }}>
                    <span
                      onClick={() => setActiveBottomTab(BottomTab.Exercises)}
                      className={classNames(
                        "cursor-pointer ml-0.5 mr-2", {
                        "text-black font-bold": activeBottomTab === BottomTab.Exercises,
                        "text-slate-600 font-normal": activeBottomTab !== BottomTab.Exercises,
                        "hidden": activeExerciseIdx === exercises.length - 1,
                      })}>
                      {
                        seshStarted ?
                          'Scheduled'
                          :
                          <h3 className="mx-3 text-xl font-bold normal-case text-center">
                            Exercises
                          </h3>
                      }
                    </span>
                    {
                      seshStarted &&
                      <span
                        onClick={() => setActiveBottomTab(BottomTab.History)}
                        className={classNames(
                          "cursor-pointer", {
                          "text-black font-bold": activeBottomTab === BottomTab.History,
                          "text-slate-500 font-normal": activeBottomTab !== BottomTab.History,
                        })}>
                        History
                      </span>
                    }
                  </div>
                  <div
                    onClick={() => setExpanded(!expanded)}
                    className={classNames(
                      "flex-1 text-right",
                      {
                        "hidden": !seshStarted
                      }
                    )}>
                    <span className={classNames(
                      "inline-block cursor-pointer text-xs font-semibold px-4 py-2 rounded-full",
                      {
                        "bg-gray-200 text-gray-600": seshStarted && isActiveSet,
                        "bg-[#858df0] text-white": seshStarted && !isActiveSet,
                        "bg-gray-200": !seshStarted
                      }
                    )}>
                      {
                        expanded ? 'Less' : 'More'
                      } <ArrowUpIcon className={classNames(
                        "-mt-[3px] h-[12px] inline-block transition-all",
                        {
                          "rotate-180": expanded
                        }
                      )} />
                    </span>
                  </div>
                </div>
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
                          className={classNames(
                            "text-black",
                            {
                              "px-3 bg-white": !seshStarted
                            }
                          )}
                          style={{
                            paddingBottom: snapshot.isDraggingOver ? 112 : 0,
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
                                        className=""
                                      >
                                        <WorkoutRoutine
                                          isFirst={i === 0}
                                          isLast={i === exercises.length - activeExerciseIdx - (seshStarted ? 2 : 1)}
                                          exercise={exercise}
                                          isDragging={snapshot.isDragging}
                                          expanded={expanded}
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
                <div className={classNames(
                  "rounded-b-xl overflow-hidden",
                )}>
                  {/* <button
                    className={classNames(
                      "px-5 w-full font-bold",
                      "text-gray-600 text-xl bg-gray-100 py-7",
                      {
                        "hidden": activeBottomTab !== BottomTab.Exercises
                      }
                    )}
                  >
                    + Add Exercise
                  </button> */}
                  <button
                    onClick={seshStarted ? finishWorkout : startSesh}
                    className={classNames(
                      "py-7 px-5 w-full font-bold",
                      "text-black text-xl bg-brightGreen"
                    )}>
                    {
                      seshStarted ?
                      <>
                        Finish Workout
                      </> : <div className="relative top-1">
                        <PlayCircleIcon className="h-14 inline-block align-top mr-2 -mt-2.5" />
                        <span className="inline-block text-2xl mt-0.5">
                          Start Sesh
                        </span>
                      </div>
                    }
                  </button>
                </div>
              </div>
              <Link
                href="/"
                className="block mt-5 text-lg p-3 text-center text-gray-600 cursor-pointer">
                Cancel Workout
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);
    let workout;
    if (session && session.user) {
      const { email } = session.user || {};
      workout = await prisma.workout.findFirstOrThrow({
        where: {
          id: Number(context.query.id),
        },
        include: {
          exercises: true,
          seshes: {
            where: {
              finishedAt: null,
            }
          }
        },
      });
    }
    return {
      props : {
        session: JSON.stringify(session),
        workout: workout ? JSON.stringify(workout) : null,
        params: context.params
      }
    }
    // TODO: handle not logged in user
  } catch(error) {
    return {
      props : {
        error: error ? JSON.stringify(error) : null,
      }
    }
  }
}

export default withSeshHistoryExercises(WorkoutSesh);
