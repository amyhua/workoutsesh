import { Bars2Icon, CheckCircleIcon, CheckIcon, ChevronLeftIcon, ClockIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Clamped from "./Clamped";
import { resetServerContext, DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import AppContext from "../contexts/app-context";
import { ExerciseDescription, OptionalText, RestBetweenSetsDescription } from "./FormComponents";
import ExerciseForm from "./ExerciseForm";
import { Exercise } from "@prisma/client";
import DurationText from "./DurationText";
import moment from "moment";

resetServerContext()

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
  const { setIndexError, setIndexSuccess } = useContext(AppContext)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState(workout.name || '')
  const [description, setDescription] = useState(workout.description || '')
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises ?
    workout.exercises.sort((a: any, b: any) => a.workoutOrder - b.workoutOrder)
    : [])
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
    let errorStatus: string;
    return fetch(mode === FormMode.Create ?
      '/api/workout' :
      `/api/workout`, {
      method: mode === FormMode.Create ?
        'POST' : 'PUT',
      body: JSON.stringify({
        ...workout,
        name,
        description,
        exercises: exercises.map((exc: any, i: number) => ({
          ...exc,
          workoutOrder: i,
        }))
      })
    })
    .then(async (resp: any) => {
      if (resp.ok) {
        setIndexSuccess(`Workout ${
          mode === FormMode.Create ?
            'was successfully created' :
            'was successfully updated'
        }.`)
        errorStatus = '';
      } else {
        errorStatus = `(${resp.status} ${resp.statusText})`;
      }
      return resp.text()
    })
    .then((text: any) => {
      if (text) {
        const match = text.match(/\"message\":\"([^"]+)\"/);
        if (match) {
          setIndexError([errorStatus, match[1]].filter((x: string)=>!!x).join(' '));
        }
      }
      router.push('/');
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
            exercises[editingExerciseIdx] as Exercise : {
              name: '',
              imageUrl: '',
              setsDescription: '',
              repsDescription: '',
              restBetweenSets: true,
            } as Partial<Exercise>
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
                              <div className="flex-1 py-3 pl-3 pr-8">
                                <h3 className="font-semibold text-base">
                                  {exc.name}
                                </h3>
                                <div className="text-sm text-slate-600">
                                  <ExerciseDescription
                                    setsDescription={exc.setsDescription}
                                    repsDescription={exc.repsDescription}
                                  />
                                  <span className="text-sm">
                                    <RestBetweenSetsDescription
                                      value={exc.restBetweenSets}
                                    />
                                  </span>
                                </div>
                                {
                                  exc.betweenSetsRestTimeLimitS &&
                                  <div className="text-sm text-slate-600">
                                    <ClockIcon className="h-3.5 text-gray-500 -mt-0.5 inline-block" /> Rest Period: <DurationText durationM={moment.duration(
                                      exc.betweenSetsRestTimeLimitS,
                                      'seconds'
                                    )} /> / Set
                                  </div>
                                }
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
