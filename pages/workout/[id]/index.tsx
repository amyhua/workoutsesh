import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import SeshCounter from '../../../components/SeshCounter'
import classnames from 'classnames'
import WorkoutRoutine from '../../../components/WorkoutRoutine'
import { resetServerContext, DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Clamped from '../../../components/Clamped'
import classNames from 'classnames'
import ExerciseDescription from '../../../components/ExerciseDescription'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowRightIcon, ArrowUpIcon, CheckCircleIcon, PencilIcon, PlayCircleIcon, StarIcon, StopCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import SeshHistory from '../../../components/SeshHistory'
import withSeshHistoryExercises from '../../../components/withSeshHistoryExercises'
import ActiveSeshes from '../../../components/ActiveSeshes'
import { SeshDto } from '../../../types'
import { Exercise } from '@prisma/client'
// see: https://github.com/atlassian/react-beautiful-dnd/issues/2350#issuecomment-1242917371

resetServerContext()

enum WorkoutSetType {
  Active = 'Set',
  Rest = 'Rest'
}

enum BottomTab {
  Exercises = 'Exercises',
  WorkoutLog = 'WorkoutLog',
}

const getNextWorkoutSetTypeLabel = (activeExercise: any, currWorkoutSetType: WorkoutSetType, workoutSetNum: number) => {
  if (activeExercise.restBetweenSets) {
    return currWorkoutSetType === WorkoutSetType.Active ?
      WorkoutSetType.Rest : `Set ${workoutSetNum + 1}`
  } else {
    return `Set ${workoutSetNum + 1}`
  }
}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ACTIVE_ROUTINE_ID = 'active-workout-routine'

const MILLISECONDS_IN_SEC = 1000;
const fromNowSeconds = (date: Date) => {
  const now = new Date();
  return Math.round((now.getTime() - date.getTime()) / MILLISECONDS_IN_SEC);
}
function WorkoutSesh({
  workout,
  error,
  pastIntervals,
  saveCurrentInterval,
}: any) {
  const session = useSession();
  workout = workout ? JSON.parse(workout) : undefined;
  error = error ? JSON.parse(error) : undefined;
  const { exercises: initialExercises = [] } = workout || {};
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
  const [exercises, setExercises] = useState(orderedInitialExercises);
  const [activeIntervalCounterIsActive, setActiveIntervalCounterIsActive] = useState(false);
  const [seshStarted, setSeshStarted] = useState(false);
  const [seshCounterIsActive, setSeshCounterIsActive] = useState(seshStarted);
  const [workoutSetNum, setWorkoutSetNum] = useState(1);
  const [currWorkoutSetType, setCurrWorkoutSetType] = useState(WorkoutSetType.Active);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const activeExercise = exercises[activeExerciseIdx];
  console.log('workout.seshes', workout.seshes, 'activeExercise', activeExercise);
  const [expanded, setExpanded] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState(BottomTab.Exercises);
  const [winReady, setWinReady] = useState(false);
  const [exited, setExited] = useState(false);
  const [activeExcNote, setActiveExcNote] = useState('');
  const [activeIntervalSecondsTotal, setActiveIntervalSecondsTotal] = useState(0);
  const [workoutSecondsTotal, setWorkoutSecondsTotal] = useState(0);
  const [seshId, setSeshId] = useState<number>();
  const router = useRouter();
  const onStartSesh = (data: SeshDto) => {
    setSeshId(data.id);
    setWorkoutSecondsTotal(data.timeCompletedS)
    setSeshStarted(true);
    setActiveIntervalCounterIsActive(true);
    setSeshCounterIsActive(true);
    setExpanded(false);
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
      setActiveExerciseIdx(
        data.orderedExerciseIds.length ?
        // start at first of ordered exercise IDs, since orderedExerciseIds: unfinished exercises, ordered
        orderedExercises.findIndex((exc: Exercise) => exc.id === data.orderedExerciseIds[0])
        : 0
      )
    }
  };
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
  const cancelSesh = () => {
    setSeshStarted(false)
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
  }
  const startNextSet = () => {
    saveCurrentInterval({
      exerciseId: activeExercise.id,
      durationS: activeIntervalSecondsTotal,
      setNo: workoutSetNum,
      note: activeExcNote,
      active: currWorkoutSetType === WorkoutSetType.Active,
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
  }
  const startNextExercise = () => {
    setActiveExerciseIdx(idx => idx + 1)
    setCurrWorkoutSetType(WorkoutSetType.Active)
    setWorkoutSetNum(1)
    setActiveIntervalSecondsTotal(0)
  }
  const startPrevExercise = () => {
    setActiveExerciseIdx(idx => idx - 1)
    setCurrWorkoutSetType(WorkoutSetType.Active)
    setWorkoutSetNum(1)
  }
  const finishWorkout = () => {
    // finish last running set, log workout data, and go to summary
    const sure = alert('Are you sure you want to end this workout?');
    if (sure as any) {
      console.log('finishWorkout')
    }
    
  }
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
    // return () => {
    //   console.log('unmount', seshStarted, seshId)
    //   pauseOnUnmount();
    // }
    console.log('mount1')
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
      pauseActiveSesh();
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
          We couldn't find what you were looking for.
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
              "text-black bg-white": !seshStarted,
              "h-[100vh] flex flex-col": seshStarted,
            }
          )}>
            <div className={classNames(
              "z-50 flex text-base font-normal px-4 py-3"
            )}>
              <div className="flex-1">
                <span className='overflow-hidden text-ellipsis w-full'>
                  {workout.name}
                </span>
              </div>
              {
                seshStarted ?
                <>
                  <SeshCounter
                    className="font-semibold text-right opacity-60"
                    active={seshStarted && seshCounterIsActive}
                    secondsTotal={workoutSecondsTotal}
                    setSecondsTotal={setWorkoutSecondsTotal}
                  />
                  <span
                    onClick={finishWorkout}
                    className="ml-2 text-brightGreen">
                    Finish
                  </span>
                </>
                :
                <Link className="text-red-600" href="/">Cancel</Link>
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
                height: 'calc(100vh - 430px)'
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
                    <h1 className="text-white text-lg">
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
                <div className={classnames(
                  "px-3 h-[200px] flex flex-col justify-center",
                  {
                    "pt-5 pb-2": !seshStarted,
                    "pt-3": seshStarted
                  })}>
                    <SeshCounter
                      className={classNames(
                        "pt-2 pb-2 font-semibold tracking-widest text-6xl text-center",
                        {
                          "hidden": !seshStarted
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
                  <h2 className="mx-auto mb-2 text-center text-xl font-normal w-[90%] overflow-hidden">
                    <span>
                      <Clamped clamp={2}>
                        {activeExercise.name}
                      </Clamped>
                    </span>
                  </h2>
                  <div className={classNames(
                    "text-center mb-4 mt-2 mx-2 px-2",
                    "rounded-full text-sm font-bold uppercase tracking-wide",
                    {
                      "text-black": !seshStarted,
                      "py-2 bg-white text-black": seshStarted && isActiveSet,
                      "py-1": seshStarted && !isActiveSet,
                      "hidden": !activeExercise.setsDescription &&
                        !activeExercise.repsDescription && isActiveSet
                    }
                  )}>
                    {
                      isActiveSet && (
                        activeExercise.setsDescription ||
                        activeExercise.repsDescription
                      ) ?
                      <ExerciseDescription
                        fancy={false}
                        setsDescription={activeExercise.setsDescription}
                        repsDescription={activeExercise.repsDescription}
                        setNum={workoutSetNum}
                      />
                      :
                      <span className="text-xl tracking-widest">
                        Resting...
                      </span>
                    }
                  </div>
                </div>
              </div>
              {/* set descriptor */}
              <div className="px-5 py-3 flex">
                <div>
                  <span className="uppercase opacity-50 tracking-wide text-sm mr-1">set</span>
                  <span className="font-bold mr-3 text-base text-brightGreen">#{workoutSetNum}</span>
                </div>
                <div className="flex-1">
                  {
                    new Array(workoutSetNum - 1).fill(0).map((_, i) => (
                      <StarIcon key={i} className="h-4 inline-block align-top mt-[2.5px]" />
                    ))
                  }
                  <StarIcon className="h-4 inline-block align-top mt-[2.5px] text-brightGreen" />
                </div>
                {
                  activeExercise.setsDescription &&
                  <div>
                    <span className="uppercase opacity-50 tracking-wide text-sm mr-1">out of</span>
                    <span className="uppercase text-sm font-semibold">{activeExercise.setsDescription}</span>
                  </div>
                }
              </div>
              <div className="bg-white0 p-2 relative">
                <input
                  type="text"
                  value={activeExcNote}
                  onChange={(e: any) => setActiveExcNote(e.target.value)}
                  placeholder={`Set #${workoutSetNum} Note`}
                  className="focus:outline-none w-full py-2 pl-10 pr-4 text-black border"
                />
                <PencilIcon className="h-5 inline-block absolute left-[18px] top-[19px] text-black z-2" />
              </div>
              <div
                className={classnames(
                  "mt-0 flex-1 font-bold tracking-widest uppercase text-xl",
                  "cursor-pointer transition-all",
                  "flex flex-col justify-center pb-[92px]",
                  {
                    "hidden": !seshStarted,
                    "bg-transparent text-black": seshStarted && isActiveSet,
                    "bg-[#646ccc] text-white": seshStarted && !isActiveSet,
                    "text-black bg-brightGreen py-5": !seshStarted
                  }
                )}>
                  <div className={classNames(
                    "flex h-auto"
                  )}>
                    <div
                      onClick={startPrevExercise}
                      className={classNames(
                        "flex items-center px-5",
                        {
                          "bg-gray-100 text-gray-600 hover:text-gray-700": seshStarted && isActiveSet,
                          "bg-[#858df0] text-white": seshStarted && !isActiveSet,
                        }
                      )}>
                      <ArrowLeftCircleIcon className={classNames(
                        "h-14",
                        {
                          "collapse": !seshStarted || activeExerciseIdx === 0,
                        }
                       )} />
                    </div>
                    {
                      seshStarted ? (
                        <div
                          onClick={startNextSet}
                          className={classNames(
                            "flex-1 py-3 cursor-pointer text-center",
                            {
                              "bg-white text-black": seshStarted && isActiveSet,
                              "bg-[#9fa7fe] text-white": seshStarted && !isActiveSet,
                            }
                          )}>
                          <div>
                            <div className="mx-5">
                              <div className={classNames(
                                "text-center",
                                "py-3 px-3 rounded-full",
                                {
                                  "text-black bg-brightGreen": isActiveSet,
                                  "bg-black text-white": !isActiveSet,
                                }
                              )}>
                                <p className="text-xl mb-0 mt-0 tracking-widest">
                                  {
                                    isActiveSet ?
                                    <CheckCircleIcon className="h-14 text-center inline-block" />
                                    :
                                    <PlayCircleIcon className="h-14 text-center inline-block text-brightGreen" />
                                  }
                                  {
                                    !isActiveSet &&
                                    <span className="align-middle ml-1 opacity-50">#{workoutSetNum + 1}</span>
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex-1 text-2xl h-[56px] text-center">
                          <PlayCircleIcon className="h-16 inline-block -mt-0.5" />
                          {/* <span className="inline-block align-middle"></span> */}
                        </div>
                      )
                    }
                    <div
                      onClick={
                        activeExerciseIdx === exercises.length - 1 ?
                          finishWorkout
                          : startNextExercise
                      }
                      className={classNames(
                        "flex items-center px-5",
                        {
                          "hidden": !seshStarted
                        },
                        {
                          "bg-gray-100 text-gray-600 hover:text-gray-700": seshStarted && isActiveSet,
                          "bg-[#858df0] text-white": seshStarted && !isActiveSet,
                        }
                      )}>
                        {
                          activeExerciseIdx === exercises.length - 1 ?
                          <StopCircleIcon className={classNames(
                            "h-14",
                            isActiveSet ? "text-gray-400" : "text-white"
                          )} />
                          :
                          <ArrowRightCircleIcon className="h-14" />
                        }
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <section className={classNames(
            "px-5 pt-5 z-50 transition-all",
            {
              "bg-active2": seshStarted && isActiveSet,
              "bg-[#353e94]": seshStarted && !isActiveSet,
              "bg-white": !seshStarted,
              "absolute left-0 right-0": seshStarted,
            },
            {
              "top-[55px] min-h-[100vh]": expanded,
            }
          )} style={{
            top: (seshStarted && !expanded) ? 'calc(100vh - 92px)' : '',
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
                "bg-white rounded-xl overflow-hidden shadow-xl drop-shadow-xl",
              )} style={{
                filter: 'drop-shadow(0 -5px 25px rgb(0 0 0 / 4%)) drop-shadow(0 0px 40px rgb(0 0 0 / 0.1))',
              }}>
                <div className={classnames(
                  "flex bg-white pt-2 pb-0 px-3 uppercase tracking-wider font-bold",
                  "text-sm",
                )}>
                  <div className={classNames(
                    {
                    "rounded-full": !seshStarted || activeExerciseIdx === exercises.length - 1,
                    "bg-black text-white px-4": seshStarted && activeExerciseIdx === exercises.length - 1,
                  })} style={{
                    lineHeight: seshStarted ? '32px' : '',
                  }}>
                    <span
                      onClick={() => setActiveBottomTab(BottomTab.Exercises)}
                      className={classNames(
                        "cursor-pointer ml-0.5", {
                        "text-black font-bold": activeBottomTab === BottomTab.Exercises,
                        "text-slate-600 font-normal": activeBottomTab !== BottomTab.Exercises,
                      })}>
                      {
                        seshStarted ?
                          activeExerciseIdx < exercises.length - 1 ? 'Next Exercises' : (
                            seshStarted ?
                            'Last Exercise! 💪' :
                            'Cancel Workout'
                          )
                          :
                          <h3 className="mx-3 text-xl font-bold normal-case text-center">
                            Exercises
                          </h3>
                      }
                    </span>
                    {
                      seshStarted &&
                      <span
                        onClick={() => setActiveBottomTab(BottomTab.WorkoutLog)}
                        className={classNames(
                          "cursor-pointer ml-2", {
                          "text-black font-bold": activeBottomTab === BottomTab.WorkoutLog,
                          "text-slate-500 font-normal": activeBottomTab !== BottomTab.WorkoutLog,
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
                  seshStarted &&
                  activeBottomTab === BottomTab.Exercises &&
                  <div className="px-3 pt-0 pb-2 bg-white">
                    <h3 className="font-semibold text-base">
                      {
                        activeExerciseIdx < exercises.length - 1 ?
                        <Clamped clamp={1}>
                          <strong className="italic font-normal mr-1">
                            <ArrowRightIcon className="text-gray-400 inline-block h-4 align-middle -mt-1" />
                          </strong> {exercises[activeExerciseIdx + 1].name}
                        </Clamped>
                        :
                        null
                      }
                    </h3>
                  </div>
                }
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
                            "bg-white text-black",
                            {
                              "mx-3": !seshStarted
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
                                        className="bg-white"
                                      >
                                        <WorkoutRoutine
                                          isFirst={i === 0}
                                          isLast={i === exercises.length - activeExerciseIdx - (seshStarted ? 2 : 1)}
                                          exercise={exercise}
                                          isDragging={snapshot.isDragging}
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
                  activeBottomTab === BottomTab.WorkoutLog &&
                  <SeshHistory exercises={pastIntervals} />
                }
                <div className={classNames(
                  "mt-2 rounded-b-xl overflow-hidden",
                )}>
                  <button
                    className={classNames(
                      "px-5 w-full font-bold",
                      "text-gray-600 text-xl bg-gray-100 py-7",
                      {
                        "hidden": activeBottomTab !== BottomTab.Exercises
                      }
                    )}
                  >
                    + Add Exercise
                  </button>
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
                <div
                  onClick={cancelSesh}
                  className="mt-5 text-lg p-3 text-center text-gray-600 hover:text-white cursor-pointer">
                  Cancel Workout
                </div>
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
  } catch(error) {
    return {
      props : {
        error: error ? JSON.stringify(error) : null,
      }
    }
  }
}

export default withSeshHistoryExercises(WorkoutSesh);
