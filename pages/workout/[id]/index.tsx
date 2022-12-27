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
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowRightIcon, ArrowUpIcon, BackwardIcon, CheckCircleIcon, ForwardIcon, PauseCircleIcon, PlayCircleIcon, PlusCircleIcon, StarIcon, StopCircleIcon, StopIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
// see: https://github.com/atlassian/react-beautiful-dnd/issues/2350#issuecomment-1242917371

resetServerContext()

enum WorkoutSetType {
  Active = 'Set',
  Rest = 'Rest'
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

export default function WorkoutSesh({
  workout,
  error
}: any) {
  const session = useSession();
  workout = workout ? JSON.parse(workout) : undefined;
  error = error ? JSON.parse(error) : undefined;
  const { exercises: initialExercises = [] } = workout || {};
  const [exercises, setExercises] = useState(initialExercises);
  const [counterIsActive, setCounterIsActive] = useState(false);
  const [seshStarted, setSeshStarted] = useState(false);
  const [workoutSetNum, setWorkoutSetNum] = useState(1);
  const [currWorkoutSetType, setCurrWorkoutSetType] = useState(WorkoutSetType.Active);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0)
  const activeExercise = exercises[activeExerciseIdx]
  const [expanded, setExpanded] = useState(false)
  const [winReady, setWinReady] = useState(false);
  const router = useRouter();
  const startSesh = () => {
    setSeshStarted(true);
    setCounterIsActive(true);
    setExpanded(false);
  }
  const cancelSesh = () => {
    setSeshStarted(false)
  }
  const isActiveSet = currWorkoutSetType === WorkoutSetType.Active;
  if (!session) {
    if (winReady) router.push(`/signin?error=${'Not logged in'}`);
  }
  const startNextSet = () => {
    if (activeExercise.restBetweenSets) {
      if (isActiveSet) {
        // return rest
        setCurrWorkoutSetType(WorkoutSetType.Rest)
        return
      } else {
        // is rest -> start active set
        setCurrWorkoutSetType(WorkoutSetType.Active)
        setWorkoutSetNum(workoutSetNum + 1)
      }
    }
    setWorkoutSetNum(workoutSetNum + 1)
  }
  const startNextExercise = () => {
    setActiveExerciseIdx(idx => idx + 1)
    setCurrWorkoutSetType(WorkoutSetType.Active)
    setWorkoutSetNum(1)
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
    const reorderedexercises = reorder(
      seshStarted ?
        exercises.slice(activeExerciseIdx + 1) : exercises,
      result.source.index,
      result.destination.index
    )
    setExercises(seshStarted ? [
      ...exercises.slice(0, activeExerciseIdx),
      activeExercise,
      ...reorderedexercises
    ] : reorderedexercises)
  }
  useEffect(() => {
    setWinReady(true)
  }, [])

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
                    active={seshStarted}
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
                  {/* <div className={classNames(
                    "flex-1 ml-4 mr-2 my-1",
                    {
                      "hidden": expanded
                    }
                  )}>
                    <div className="flex flex-col">
                      <div
                        className={classnames(
                          "w-[calc(100vw - 251px)] sm:w-auto text-xs mt-0 mb-3 block overflow-hidden overflow-ellipsis whitespace-nowrap",
                          {
                            "text-navym1": seshStarted && isActiveSet,
                            "text-pink": seshStarted && !isActiveSet,
                            "text-gray-500": !seshStarted
                          }
                        )}>
                        {workout.name}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h1 className={classnames(
                          "font-bold text-left text-lg leading-snug",
                          {
                            "text-white": seshStarted,
                            "text-black": !seshStarted
                          }
                        )}>
                          <Clamped clamp={2}>
                            {activeExercise.name}
                          </Clamped>
                        </h1>
                        <div className={classnames(
                            "mt-1 text-base text-left",
                            {
                              "text-navym1": seshStarted && isActiveSet,
                              "text-pink": seshStarted && !isActiveSet,
                              "text-black": !seshStarted,
                            }
                          )}>
                            <ExerciseDescription
                              setsDescription={activeExercise.setsDescription}
                              repsDescription={activeExercise.repsDescription}
                            />
                            <RestBetweenSetsDescription
                              value={activeExercise.restBetweenSets}
                              className={seshStarted ?
                                isActiveSet ? 'text-navym1' : 'text-pink' :
                                'text-black'
                              }
                            />
                        </div>
                      </div>
                    </div>
                  </div> */}
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
                  "px-3 h-[260px] flex flex-col justify-center",
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
                    active={counterIsActive}
                  />
                  <h2 className="mx-auto mb-2 text-center text-xl font-normal w-[90%] overflow-hidden">
                    <span>
                      <Clamped clamp={2}>
                        {activeExercise.name}
                      </Clamped>
                    </span>
                  </h2>
                  <div className={classNames(
                    "text-center mb-4 mt-2 mx-2 p-2",
                    "rounded-full text-sm font-bold uppercase tracking-wide",
                    {
                      "text-black": !seshStarted,
                      "bg-white text-black": seshStarted && isActiveSet,
                    }
                  )}>
                    {
                      isActiveSet ?
                      <ExerciseDescription
                        fancy={false}
                        setsDescription={activeExercise.setsDescription}
                        repsDescription={activeExercise.repsDescription}
                        setNum={workoutSetNum}
                      />
                      :
                      <span className="text-4xl tracking-widest">
                        Rest
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 flex">
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
                <div>
                  <span className="uppercase opacity-50 tracking-wide text-sm mr-1">out of</span>
                  <span className="uppercase text-sm font-semibold">{activeExercise.setsDescription}</span>
                </div>
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
                              {/* {
                                isActiveSet ?
                                <CheckCircleIcon className="inline-block h-[70px] text-green-600" />
                                :
                                <ArrowRightCircleIcon className="inline-block h-[65px] text-white" />
                              } */}
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
                                    <PauseCircleIcon className="h-14 text-center inline-block" />
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
              // "transform-y-[107px]": !expanded,
              "top-[55px] min-h-[100vh]": expanded,
            }
          )} style={{
            top: (seshStarted && !expanded) ? 'calc(100vh - 92px)' : '',
          }}>
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
                    lineHeight: '32px',
                  }}>
                    {
                      seshStarted ?
                        activeExerciseIdx < exercises.length - 1 ? 'Exercises' : (
                          seshStarted ?
                          'Last Exercise! 💪' :
                          'Cancel Workout'
                        )
                        :
                        'Exercises'
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
                  <div className="px-3 pt-2 pb-2 bg-white">
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
                  <DragDropContext onDragEnd={onExerciseDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white text-black"
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
                <div className="rounded-b-xl overflow-hidden">
                  <button
                    className={classNames(
                      "px-5 w-full font-bold",
                      "text-gray-600 text-xl bg-gray-100 py-7"
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
                      </> : <>
                        <PlayCircleIcon className="h-7 inline-block align-top mr-2" />
                        Start Workout
                      </>
                    }
                  </button>
                </div>
              </div>
                <div
                  onClick={cancelSesh}
                  className="mt-5 text-base uppercase tracking-widest p-3 text-center text-gray-300 hover:text-white cursor-pointer">
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
        }
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
