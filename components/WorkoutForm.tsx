import { Bars2Icon, CheckCircleIcon, CheckIcon, ChevronLeftIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Clamped from "./Clamped";
import { resetServerContext, DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

type Exercise = {
  name: string;
  imageUrl: string;
  setsDescription: string;
  id?: string;
  // "5" or "2-3"
  repsDescription: string;
  // "15" or "12-15" or "15-20 each leg"
  restBetweenSets: boolean;
}

const RestBetweenSetsDescription = ({
  value
}: {
  value: boolean;
}) => (
  <div className="text-gray-700">
    {
      value ?
      <span>
        <CheckIcon className="-ml-0.5 inline-block h-5 align-top mt-0.5 text-green-500" /> Rest between sets
      </span> : (
        <span>
          <XMarkIcon className="-ml-1.5 inline-block h-5 align-top mt-0.5 text-red-500" /> No rest between sets
        </span>
      )
    }
  </div>
)

const ExerciseDescription = ({ setsDescription, repsDescription }: { setsDescription: string; repsDescription: string; }) => (
  <Clamped clamp={1}>
      {setsDescription || '<Sets>'} sets of {repsDescription || '<Reps>'}
  </Clamped>
)

const OptionalText = () => (
  <span className="text-gray-400 ml-1">optional</span>
)

resetServerContext()

function ExerciseForm({
  open,
  onClose,
  setExercise,
  exercise={
    name: '',
    imageUrl: '',
    repsDescription: '',
    setsDescription: '',
    restBetweenSets: true,
  },
  editing,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  setExercise: any;
  exercise: Exercise;
  editing: boolean;
  onRemove?: () => void;
}) {
  const [name, setName] = useState(exercise.name)
  const [imageUrl, setImageUrl] = useState(exercise.imageUrl)
  const [repsDescription, setRepsDescription] = useState(exercise.repsDescription)
  const [setsDescription, setSetsDescription] = useState(exercise.setsDescription)
  const [restBetweenSets, setRestBetweenSets] = useState(true)
  return (!open ? null :
    <form
      className="z-50 relative rounded-md bg-white shadow-xl sm:mt-[90px] border border-slate-800 py-8 px-7 border-3 max-w-md mx-auto mb-5"
      onSubmit={() => {
        setExercise({
          name,
          imageUrl,
          setsDescription,
          repsDescription,
          restBetweenSets,
        })
        onClose()
      }}>
      <div onClick={onClose} className="absolute top-0 right-0 p-3 text-gray-200 cursor-pointer hover:text-gray-600 text-2xl">
        ✖
      </div>
      <h2 className="font-bold text-2xl">
        { editing ? 'Edit' : 'Add'} {name ?
          <em className="italic">{name}</em> :
          'Exercise'
        }
      </h2>
      <label htmlFor="name" className="mt-3 mb-2 block font-semibold">
        Name
      </label>
      <input
        className="rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
        type="text"
        name="name"
        required
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        placeholder="Chest Press"
      />

      <label
        htmlFor="imageUrl"
        className="mt-3 mb-2 block font-semibold">
        Image URL <OptionalText />
      </label>
      <input
        className="rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
        type="url"
        name="imageUrl"
        value={imageUrl}
        onChange={(e: any) => setImageUrl(e.target.value)}
        placeholder="https://..."
      />

      <label htmlFor="setsDescription" className="mt-3 mb-2 block font-semibold">
        Sets <OptionalText />
      </label>
      <input
        className="rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
        type="text"
        name="setsDescription"
        value={setsDescription}
        onChange={(e: any) => setSetsDescription(e.target.value)}
        placeholder='"5-8" or "10"'
      />

      <label htmlFor="repsDescription" className="mt-3 mb-2 block font-semibold">
        Reps <OptionalText />
      </label>
      <input
        className="rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
        type="text"
        name="repsDescription"
        value={repsDescription}
        onChange={(e: any) => setRepsDescription(e.target.value)}
        placeholder='"5-8", "10", or "15 each leg"'
      />
      <label htmlFor="repsDescription" className="mt-3 mb-2 block font-semibold">
        Rest between Sets?
      </label>
      <div
        className="flex rounded-lg text-base w-full mb-3 border-2 border-black focus:border-black focus:outline-none"
      >
        <div
          onClick={() => setRestBetweenSets(true)}
          className={classNames(
            "cursor-pointer flex-1 relative border-r-2 border-black p-3",
            {
              "font-semibold text-black": restBetweenSets === true,
              "text-gray-500": restBetweenSets !== true,
            }
          )}>
          Include Rest
          <span className={classNames({
            "hidden": restBetweenSets !== true
          })}>
            <CheckCircleIcon className="absolute right-3 h-6 inline-block align-top text-right" />
          </span>
        </div>
        <div
          onClick={() => setRestBetweenSets(false)}
          className={classNames(
            "cursor-pointer flex-1 relative p-3",
            {
              "font-semibold text-black": restBetweenSets === false,
              "text-gray-500": restBetweenSets !== false,
            }
          )}>
          Skip Rest
          <span className={classNames({
            "hidden": restBetweenSets !== false,
          })}>
            <CheckCircleIcon className="absolute right-3 h-6 inline-block align-top text-right" />
          </span>
        </div>
      </div>
      <div>
        <label htmlFor="repsDescription" className="mt-3 mb-2 block font-semibold">
          Preview
        </label>
        <div className="flex rounded-lg border-2 border-black">
          <div className="relative h-[125px] w-[125px] bg-slate-200 flex border-r-2 border-black items-center rounded-tl-lg rounded-bl-lg overflow-hidden">
            {
              imageUrl &&
              <Image
                src={imageUrl}
                alt="Exercise Image"
                priority
                height={125}
                width={125}
                placeholder={require('./routine-placeholder.png')}
                className="inline-block bg-slate-200"
              />
            }
          </div>
          <div className="flex-1 ml-4 mr-2 my-3">
            <div className="flex flex-col">
              <h2 className="font-semibold text-md leading-snug mb-0.5">
                <Clamped clamp={2}>
                  {name || '<Name>'}
                </Clamped>
              </h2>
              <div className="text-gray-700 text-base">
                <ExerciseDescription
                  setsDescription={setsDescription}
                  repsDescription={repsDescription}
                />
              </div>
              <RestBetweenSetsDescription
                value={restBetweenSets}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="cursor-pointer text-lg font-bold mt-9 p-3 rounded-md border-2 border-black hover:bg-brightGreen text-black w-full">
        { editing ? 'Update' : 'Add'} <em className="italic">{name || 'New Exercise'}</em>
      </button>
      <div onClick={editing ? onRemove : onClose} className={classNames(
        "mt-5 py-1 cursor-pointer text-slate-400 hover:text-red-300 text-center",
        {
          "text-slate-400": !editing,
          "text-red-400": editing,
        }
      )}>
        { editing ? 'Remove from Workout' : 'Cancel'}
      </div>
    </form>
  )
}

export enum FormMode {
  Edit = 'Edit',
  Create = 'Create'
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function WorkoutForm({
  mode,
  workout = {},
}: {
  mode: FormMode
  workout?: any
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState(workout.name || '')
  const [description, setDescription] = useState(workout.description || '')
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises || [])
  const [editingExerciseIdx, setEditingExerciseIdx] = useState<number | undefined>()
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [winReady, setWinReady] = useState(false);
  const onEditExercise = (excIdx: number) => () => {
    setEditingExerciseIdx(excIdx)
    setShowExerciseForm(true)
  }
  const goBack = () => {
    router.push(`/`)
  }
  const onSubmit = (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    fetch('/api/workouts', {
      method: mode === FormMode.Create ?
        'POST' : 'PUT',
      body: JSON.stringify({
        name,
        description,
        exercises: exercises.map((exc: any, i: number) => ({
          ...exc,
          workoutOrder: i,
        }))
      })
    })
    .then(() => {
      router.push(`/`)
    })
  }
  useEffect(() => {
    setWinReady(true);
  }, [])
  const onExerciseDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }
    const reorderedExercises = reorder(
      exercises,
      result.source.index,
      result.destination.index
    )
    setExercises(reorderedExercises)
  }
  return (
    <>
      <div
        className={classNames(
          "absolute z-10 top-0 bottom-o right-0 py-10 left-0 bg-black0",
          {
            "hidden": !showExerciseForm
          }
        )}>
        <ExerciseForm
          key={showExerciseForm ? 1 : 0}
          editing={editingExerciseIdx !== undefined}
          open={showExerciseForm}
          exercise={editingExerciseIdx !== undefined ?
            exercises[editingExerciseIdx] : {
              name: '',
              imageUrl: '',
              setsDescription: '',
              repsDescription: '',
              restBetweenSets: true,
            }
          }
          onClose={
            () => {
              setEditingExerciseIdx(undefined)
              setShowExerciseForm(false)
            }
          }
          onRemove={() => {
            if (editingExerciseIdx !== undefined) {
              setExercises((excs: Exercise[]) => {
                const temp = [...excs]
                temp.splice(editingExerciseIdx, 1)
                return temp
              })
              setShowExerciseForm(false)
            }
          }}
          setExercise={(exc: any) => {
            if (editingExerciseIdx !== undefined) {
              setExercises([
                ...exercises.slice(0, editingExerciseIdx),
                exc,
                ...exercises.slice(editingExerciseIdx + 1)
              ])
            } else {
              setExercises([
                ...exercises,
                exc,
              ])
            }
          }} />
      </div>
      <main className="max-w-xl mx-auto mt-[70px] p-5">
        <div
          onClick={goBack}
          className="group text-2xl cursor-pointer mb-5 inline-block rounded-full">
          <ChevronLeftIcon className="bg-white border border-black text-black group-hover:bg-black group-hover:text-white rounded-full text-center p-1 mr-1 h-7 inline-block align-top mt-0.5" />
          <span className="text-lg align-middle pl-1 font-semibold relative -top-[1.5px]">
            Back
          </span>
        </div>
        <h1 className="font-bold text-2xl mb-2 text-black">
          {name || (
            mode === FormMode.Create ? 'Create' : 'Edit'
          ) + ' Workout'}
        </h1>
        <form className="mt-6" onSubmit={onSubmit}>
          <label htmlFor="name" className="mt-3 mb-2 block font-semibold">Name</label>
          <input
            disabled={submitting}
            className="rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
            type="text"
            name="name"
            required
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Upper Body Fridays"
          />

          <label htmlFor="description" className="mt-3 mb-2 block font-semibold">
            Brief Description <OptionalText />
          </label>
          <textarea
            disabled={submitting}
            className="rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
            name="description"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="(45 minutes) Fridays: arms, shoulders abs"
          />

          <label htmlFor="exercises" className="mt-3 mb-2 block font-semibold">
            🏋️ Exercises
          </label>
          <div className="border-2 border-black px-3 py-4 rounded-lg bg-slate-50">
            <ul>
              {
                winReady &&
                <DragDropContext onDragEnd={onExerciseDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided: any, snapshot: any) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="block"
                        style={{
                          paddingBottom: snapshot.isDraggingOver ? (102 + 12) : 0,
                        }}
                      >
                      {
                        exercises.map((exc: Exercise, i) => (
                          <Draggable
                            index={i}
                            key={String(exc.id)}
                            draggableId={String(exc.id)}
                          >
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              className="flex-1 flex bg-white rounded-lg mb-3 shadow-md border border-black"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div className="relative h-[100px] w-[100px] bg-slate-200 flex border-r border-black items-center rounded-tl-lg rounded-bl-lg overflow-hidden">
                                {
                                  exc.imageUrl &&
                                  <Image
                                    src={exc.imageUrl}
                                    alt="Exercise Image"
                                    priority
                                    height={100}
                                    width={100}
                                    placeholder={require('./routine-placeholder.png')}
                                    className="inline-block bg-slate-200"
                                  />
                                }
                              </div>
                              <div className="flex-1 p-3">
                                <h3 className="font-semibold text-base">
                                  {exc.name}
                                </h3>
                                <div className="text-slate-600">
                                  <ExerciseDescription
                                    setsDescription={exc.setsDescription}
                                    repsDescription={exc.repsDescription}
                                  />
                                  <RestBetweenSetsDescription
                                    value={exc.restBetweenSets}
                                  />
                                </div>
                              </div>
                              <div className="pl-2 relative">
                                <div
                                  className="whitespace-nowrap absolute top-0 right-0 px-2 py-1 text-lg">
                                  <div
                                    onClick={onEditExercise(i)}
                                    className="cursor-pointer text-sm align-top inline-block p-2 text-gray-400 hover:text-black">
                                    <PencilSquareIcon className="mt-2 h-5" />
                                  </div>
                                  <div className="mt-3">
                                    <Bars2Icon
                                      className="cursor-pointer h-5 mx-2 text-gray-400 hover:text-black"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          </Draggable>
                        ))
                      }
                      </li>
                    )}
                  </Droppable>
                </DragDropContext>
              }
              <li
                onClick={() => setShowExerciseForm(true)}
                className="px-2 cursor-pointer font-bold h-[50px] w-full bg-white border-2 border-black text-black text-base flex items-center rounded-lg">
                <PlusCircleIcon className="h-7 align-middle mr-2" /> Add Exercise
              </li>
            </ul>
          </div>
          <button
            onClick={onSubmit}
            disabled={submitting || !name || !(exercises && exercises.length)}
            type="submit"
            className="cursor-pointer text-lg font-bold mt-9 mb-14 p-3 rounded-md border-2 border-black hover:bg-brightGreen text-black w-full">
            {
              submitting ?
              'Submitting...' :
                mode === FormMode.Create ?
                'Create' : 'Update'
            }
          </button>
        </form>
      </main>
    </>
  )
}

export default WorkoutForm
