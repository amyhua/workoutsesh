import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import SeshCounter from '../../../components/SeshCounter'
import classnames from 'classnames'
import WorkoutRoutine from '../../../components/WorkoutRoutine'
import { resetServerContext, DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
// see: https://github.com/atlassian/react-beautiful-dnd/issues/2350#issuecomment-1242917371

resetServerContext()

const workout = {
  name: 'Upper Body Extended Workout',
  routines: [{
    id: 1,
    name: 'Chest Press with Dumbbells',
    image_url: 'https://personallevelfitness.com/wp-content/uploads/2018/08/Chest-Press-DB.jpg',
    description: '4 sets of 12-15',
    restBetweenSets: true
  }, {
    id: 2,
    name: 'Chest Flies',
    image_url: 'https://gethealthyu.com/wp-content/uploads/2014/08/Chest-Flies_Exercise.jpg',
    description: '4 sets of 10-12',
    restBetweenSets: true
  }, {
    id: 3,
    name: 'Reverse Lunges',
    image_url: 'https://www.wikihow.com/images/thumb/c/c0/Do-a-Reverse-Lunge-Step-8-Version-2.jpg/v4-460px-Do-a-Reverse-Lunge-Step-8-Version-2.jpg.webp',
    description: '4 sets of 12-15',
    restBetweenSets: false
  }, {
    id: 4,
    name: '(Knee) Push-Ups',
    image_url: 'https://i.pinimg.com/originals/56/e4/61/56e4612e4837f1d0bbd45402c4bc01d7.jpg',
    description: '4 sets of 10-16',
    restBetweenSets: true
  }],
}

const CheckCircleIconSvg = ({ className, color='black', size=20 }: { className?: string; color?: string; size?: number; }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M14 0.25C6.40625 0.25 0.25 6.40625 0.25 14C0.25 21.5937 6.40625 27.75 14 27.75C21.5937 27.75 27.75 21.5937 27.75 14C27.75 6.40625 21.5937 0.25 14 0.25ZM19.96 11.675C20.0697 11.5496 20.1533 11.4034 20.2057 11.2452C20.2582 11.087 20.2784 10.9199 20.2653 10.7537C20.2522 10.5876 20.206 10.4257 20.1295 10.2777C20.0529 10.1296 19.9475 9.99838 19.8194 9.89168C19.6914 9.78497 19.5433 9.70495 19.3839 9.65633C19.2244 9.6077 19.0569 9.59145 18.8911 9.60853C18.7253 9.62562 18.5646 9.67568 18.4184 9.75579C18.2723 9.8359 18.1436 9.94443 18.04 10.075L12.665 16.5238L9.88375 13.7413C9.648 13.5136 9.33224 13.3876 9.0045 13.3904C8.67675 13.3933 8.36324 13.5247 8.13148 13.7565C7.89972 13.9882 7.76826 14.3018 7.76541 14.6295C7.76256 14.9572 7.88855 15.273 8.11625 15.5087L11.8663 19.2588C11.9891 19.3815 12.1361 19.4773 12.298 19.5401C12.4599 19.6028 12.6331 19.6312 12.8066 19.6233C12.98 19.6154 13.15 19.5715 13.3055 19.4943C13.4611 19.4171 13.5988 19.3084 13.71 19.175L19.96 11.675Z" fill={color} />
  </svg>
)

enum WorkoutSetType {
  Active = 'Set',
  Rest = 'Rest'
}

const getNextWorkoutSetTypeLabel = (activeRoutine: any, currWorkoutSetType: WorkoutSetType, workoutSetNum: number) => {
  if (activeRoutine.restBetweenSets) {
    return currWorkoutSetType === WorkoutSetType.Active ?
      WorkoutSetType.Rest : `Set ${workoutSetNum + 1}`
  } else {
    return `Set ${workoutSetNum + 1}`
  }
}

const PrevIconSvg = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 13.25L5.5 7L15.5 0.75V13.25ZM0.5 0.75H4.25V13.25H0.5V0.75Z" fill="#545454"/>
  </svg>
)

const NextIconSvg = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 13.25L10.5 7L0.5 0.75V13.25ZM15.5 0.75H11.75V13.25H15.5V0.75Z" fill="#545454"/>
  </svg>
)

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function WorkoutSesh() {
  const { routines: initialRoutines = [] } = workout
  const [routines, setRoutines] = useState(initialRoutines);
  const [counterIsActive, setCounterIsActive] = useState(false);
  const [seshStarted, setSeshStarted] = useState(false);
  const [workoutSetNum, setWorkoutSetNum] = useState(1);
  const [currWorkoutSetType, setCurrWorkoutSetType] = useState(WorkoutSetType.Active);
  const [activeRoutineIdx, setActiveRoutineIdx] = useState(0)
  const [winReady, setWinReady] = useState(false);
  const startSesh = () => {
    setSeshStarted(true);
    setCounterIsActive(true);
  }
  const startNextSet = () => {
    setWorkoutSetNum(set => set + 1)
  }
  const router = useRouter()
  const { workoutSlug } = router.query
  const initialButtonText = 'Tap here to Start'
  const onRoutineDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }
    // sync with backend
    // if backend successful, update frontend
    const reorderedRoutines = reorder(
      routines,
      result.source.index,
      result.destination.index
    )
    setRoutines(reorderedRoutines)
  }
  useEffect(() => {
    setWinReady(true)
  }, [])

  return (
    <Layout title="Workout Sesh" background="#F4F3EC">
      <main className="bg-wheat max-w-lg mx-auto min-h-[100vh]">
        <div className="sticky top-0 left-0 right-0 bg-wheat z-20">
          <div className="px-4 pt-4">
            <div className="rounded-lg border-2 border-black">
              <div className="flex">
                <div className="relative flex border-r-2 border-black items-center h-[125px] w-[125px] bg-white rounded-tl-lg rounded-bl-lg overflow-hidden">
                  <Image
                    src={routines[activeRoutineIdx].image_url}
                    alt="Active Routine Image"
                    priority
                    height={125}
                    width={125}
                    placeholder={require('./routine-placeholder.png')}
                    className="inline-block"
                  />
                </div>
                <div className="flex-1 ml-4 mr-2 flex items-center">
                  <div className="flex flex-col">
                    <div
                      className="w-[calc(100vw - 251px)] sm:w-auto text-xs text-gray-600 mb-2 block overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {workout.name}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h1 className="font-bold text-lg leading-snug">
                        {routines[activeRoutineIdx].name}
                      </h1>
                      <p className="text-base mt-1 text-left">
                        {routines[activeRoutineIdx].description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-3 flex items-center">
                  <NextIconSvg />
                </div>
              </div>

            </div>
          </div>
          <div className="mt-1 flex flex-col justify-center">
            <div className={classnames(
              "text-center mt-3",
              {
                "hidden": !seshStarted,
                "pt-3": seshStarted
              }
            )}>
              {
                new Array(workoutSetNum).fill(1).map((set: any, i: number) => (
                  <CheckCircleIconSvg
                    key={i}
                    size={28}
                    color={(i + 1) === workoutSetNum ? '#1DBE5D' : 'black'}
                    className={classnames(
                      "inline-block",
                      (i + 1) === workoutSetNum ? 'mr-0' : 'mr-2'
                    )} />
                ))
              }
            </div>
            <div className={classnames({
              "hidden": !seshStarted
            })}>
              <p className="mt-3 text-center text-xl uppercase tracking-widest font-semibold">
                Set {workoutSetNum}
              </p>
            </div>
            <SeshCounter key={workoutSetNum} active={
              seshStarted &&
              counterIsActive}
            />
          </div>
          <button
            onClick={seshStarted ? startNextSet : startSesh}
            className={classnames(
              "mt-0 w-full font-bold p-3 tracking-widest uppercase text-xl",
              seshStarted ? "text-white bg-orange" : "text-black bg-brightGreen",
            )}>
            { seshStarted ? (
              <div className="h-[56px]">
                <p className="text-2xl mb-1 tracking-widest">
                  {currWorkoutSetType === WorkoutSetType.Active ?
                    'Finish Set' : 'Start Set'
                  }
                </p>
                <p className="text-sm uppercase tracking-widest font-normal">
                  Next: {getNextWorkoutSetTypeLabel(routines[activeRoutineIdx], currWorkoutSetType, workoutSetNum)}
                </p>
              </div>
            ) : (
              <div className="text-2xl h-[56px] p-3">
                {initialButtonText}
              </div>
            )
            }
          </button>
        </div>
        <section className="bg-white">
          <div className="mx-3 pt-3 text-sm uppercase tracking-wider font-bold text-gray-600">
            Next
          </div>
          {
            winReady &&
            <DragDropContext onDragEnd={onRoutineDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white"
                  >
                      {
                        routines.map((routine: any, i: number) => {
                          return (
                            <Draggable
                              index={i}
                              key={String(routine.id)}
                              draggableId={String(routine.id)}
                            >
                              {(provided: any, snapshot: any) => (
                                <article
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                  routine={routine}
                                >
                                  <WorkoutRoutine
                                    isFirst={i === 0}
                                    routine={routine}
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
          <div className="p-3 pb-16">
            {
              seshStarted &&
              <button className="text-base py-3 px-5 w-full font-bold uppercase tracking-widest text-white rounded-md bg-gradient-to-r from-finish to-finish2">
                Finish Workout
              </button>
            }
          </div>
        </section>
      </main>
    </Layout>
  )
}