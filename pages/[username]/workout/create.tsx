import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Clamped from "../../../components/Clamped";
import Layout from "../../../components/Layout";
import Logo from "../../../components/Logo";

type Exercise = {
  name: string;
  imageUrl: string;
  setsDescription: string;
  // "5" or "2-3"
  repsDescription: string;
  // "15" or "12-15" or "15-20 each leg"
}

const ExerciseDescription = ({ setsDescription, repsDescription }: { setsDescription: string; repsDescription: string; }) => (
  <Clamped clamp={1}>
      {setsDescription || '<Sets>'} sets of {repsDescription || '<Reps>'}
  </Clamped>
)

const sampleExercises = [{
  name: 'Chest Press',
  imageUrl: 'https://www.verywellfit.com/thmb/w-hq2ZW1sxMDVJuEdRo8mlBgic8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/About-194-1231474-Chest-Press-Bench02-1560-fe31b6ad47f042c896163a5e1a89e169.jpg',
  setsDescription: '4-5',
  repsDescription: '12-15'
}, {
  name: 'Chest Press',
  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR396HfThEiaUhaWgjB5k07ywg0CGZnoy2zMsL-DKGRK9r91O7nf6FSWAzfQNzMO-OzSQ&usqp=CAU',
  setsDescription: '4',
  repsDescription: '15-20'
}]

const OptionalText = () => (
  <span className="text-gray-400 ml-1">optional</span>
)

function ExerciseForm({
  open,
  onClose,
  setExercise,
  exercise={
    name: '',
    imageUrl: '',
    repsDescription: '',
    setsDescription: ''
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
  return (!open ? null :
    <form
      className="z-50 relative rounded-md bg-white shadow-xl sm:mt-[90px] border border-slate-800 py-8 px-7 border-3 max-w-md mx-auto mb-5"
      onSubmit={() => {
        setExercise({
          name,
          imageUrl,
          setsDescription,
          repsDescription,
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
        className="rounded-lg text-base w-full p-3 mb-3 border-2 focus:border-black focus:outline-none"
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
        className="rounded-lg text-base w-full p-3 mb-3 border-2 focus:border-black focus:outline-none"
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
        className="rounded-lg text-base w-full p-3 mb-3 border-2 focus:border-black focus:outline-none"
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
        className="rounded-lg text-base w-full p-3 mb-3 border-2 focus:border-black focus:outline-none"
        type="text"
        name="repsDescription"
        value={repsDescription}
        onChange={(e: any) => setRepsDescription(e.target.value)}
        placeholder='"5-8", "10", or "15 each leg"'
      />
      <div>
        <label htmlFor="repsDescription" className="mt-3 mb-2 block font-semibold">
          Preview
        </label>
        <div className="flex rounded-lg border-2 border-black">
          <div className="relative h-[125px] w-[125px] bg-blue-200 flex border-r-2 border-black items-center rounded-tl-lg rounded-bl-lg overflow-hidden">
            {
              imageUrl &&
              <Image
                src={imageUrl}
                alt="Exercise Image"
                priority
                height={125}
                width={125}
                placeholder={require('../../../components/routine-placeholder.png')}
                className="inline-block bg-blue-200"
              />
            }
          </div>
          <div className="flex-1 ml-4 mr-2 my-3">
            <div className="flex flex-col">
              <h2 className="font-semibold text-base leading-snug">
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

function CreateWorkout() {
  const router = useRouter()
  const { username } = router.query
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises)
  const [editingExerciseIdx, setEditingExerciseIdx] = useState<number | undefined>()
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const onEditExercise = (excIdx: number) => () => {
    setEditingExerciseIdx(excIdx)
    setShowExerciseForm(true)
  }
  const goBack = () => {
    router.push(`/${username}`)
  }
  const onSubmit = (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    goBack()
  }
  return (
    <Layout title="Create Workout | WorkoutSesh">
      <div
        className="absolute z-10 top-0 bottom-o right-0 py-10 left-0 bg-black0">
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
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white h-[90px]">
        <div className="max-w-4xl mx-auto h-[90px]">
          <Logo size={180} className="my-0" />
        </div>
      </nav>
      <main className="max-w-xl mx-auto mt-[70px] p-5">
        <div
          onClick={goBack}
          className="text-2xl cursor-pointer mb-2 inline-block rounded-full">
          ⬅️ <span className="text-base align-middle pl-1 font-semibold relative -top-[1.5px]">
            Back
          </span>
        </div>
        <h1 className="font-semibold text-xl my-2">
          Create
        </h1>
        <h1 className="font-bold text-2xl mb-2 text-black">
          {name || 'New Workout'}
        </h1>
        <form className="mt-6" onSubmit={onSubmit}>
          <label htmlFor="name" className="mt-3 mb-2 block font-semibold">Name</label>
          <input
            disabled={submitting}
            className="rounded-lg text-base w-full p-3 mb-3 border-2 focus:border-black focus:outline-none"
            type="text"
            name="name"
            required
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Upper Body Fridays"
          />

          <label htmlFor="description" className="mt-3 mb-2 block font-semibold">Description</label>
          <textarea
            disabled={submitting}
            className="rounded-lg text-base w-full p-3 mb-3 border-2 focus:border-black focus:outline-none"
            name="description"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="(45 minutes) Fridays: arms, shoulders abs"
          />

          <label htmlFor="exercises" className="mt-3 mb-2 block font-semibold">
            🏋️ Exercises
          </label>
          <div className="border-2 px-3 py-4 rounded-lg bg-slate-50">
            <ul>
              {
                exercises.map((exc: Exercise, i) => (
                  <li key={i} className="flex">
                    <div className="flex-1 flex bg-white rounded-lg mb-3 shadow-md border border-slate-300">
                      <div className="relative h-[75px] w-[75px] bg-blue-200 flex border-r border-black items-center rounded-tl-lg rounded-bl-lg overflow-hidden">
                        {
                          exc.imageUrl &&
                          <Image
                            src={exc.imageUrl}
                            alt="Exercise Image"
                            priority
                            height={75}
                            width={75}
                            placeholder={require('../../../components/routine-placeholder.png')}
                            className="inline-block bg-blue-200"
                          />
                        }
                      </div>
                      <div className="flex-1 p-3">
                        <h3 className="font-semibold">
                          {exc.name}
                        </h3>
                        <div className="text-slate-500">
                          <ExerciseDescription
                            setsDescription={exc.setsDescription}
                            repsDescription={exc.repsDescription}
                          />
                        </div>
                      </div>
                      <div className="pl-2 relative">
                        <div
                          onClick={onEditExercise(i)}
                          className="whitespace-nowrap absolute top-0 right-0 px-2 py-1 text-slate-300 cursor-pointer hover:text-gray-700 text-lg">
                          <span className="text-sm align-top inline-block px-1 py-1 cursor-pointer text-blue-400">
                            Edit / Remove
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>

                    </div>
                  </li>
                ))
              }
              <li
                onClick={() => setShowExerciseForm(true)}
                className="px-4 cursor-pointer h-[50px] w-full bg-blue-100 text-blue-700 text-base flex items-center font-semibold rounded-lg">
                + Add Exercise
              </li>
            </ul>
          </div>
          <button
            onClick={onSubmit}
            disabled={submitting}
            type="submit"
            className="cursor-pointer text-lg font-bold mt-9 mb-14 p-3 rounded-md border-2 border-black hover:bg-brightGreen text-black w-full">
            Create
          </button>
        </form>
      </main>
    </Layout>
  )
}

export default CreateWorkout
