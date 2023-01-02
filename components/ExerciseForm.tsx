import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Exercise } from "@prisma/client";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import Clamped from "./Clamped";
import ExerciseDescription from "./ExerciseDescription";
import RestBetweenSetsDescription from "./RestBetweenSetsDescription";
import { OptionalText } from './FormComponents';
import { Dialog } from "@headlessui/react";
import moment from "moment";
import DurationText from "./DurationText";

const TimeQuickPick = ({ seconds, setTimeLimitMin, setTimeLimitS }: {
  seconds: number;
  setTimeLimitMin: (val: number) => any;
  setTimeLimitS: (val: number) => any;
}) => {
  const durationM = moment.duration(seconds, 'seconds');
  return (
    <span
      onClick={() => {
        const mins = Math.floor(durationM.asMinutes());
        const secs = Math.floor(durationM.asSeconds() % 60);
        setTimeLimitMin(mins);
        setTimeLimitS(secs);
      }}
      className="cursor-pointer inline-block p-2 mr-2 mt-2 mb-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300">
      <DurationText durationM={durationM} />
    </span>
  );
};

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
  exercise: Exercise | Partial<Exercise>;
  editing: boolean;
  onRemove?: () => void;
}) {
  const [name, setName] = useState(exercise.name)
  const [imageUrl, setImageUrl] = useState(exercise.imageUrl || '')
  const [repsDescription, setRepsDescription] = useState(exercise.repsDescription || '')
  const [setsDescription, setSetsDescription] = useState(exercise.setsDescription || '')
  const [restBetweenSets, setRestBetweenSets] = useState(true)

  const editedMins = exercise && exercise.betweenSetsRestTimeLimitS ?
    Math.floor(moment.duration(exercise.betweenSetsRestTimeLimitS, 'seconds').asMinutes())
    : undefined;
  const [restTimeLimitS, setRestTimeLimitS] = useState<number | undefined>(
    exercise && exercise.betweenSetsRestTimeLimitS ?
    (exercise.betweenSetsRestTimeLimitS - (editedMins || 0) * 60)
    : undefined
  );
  const [restTimeIsLimited, setRestTimeIsLimited] = useState(false);
  const [restTimeLimitMin, setRestTimeLimitMin] = useState<number | undefined>(
    editedMins ? editedMins : undefined);
  const onSubmit = () => {
    setExercise({
      insertedTime: new Date().getTime(),
      id: exercise ? exercise.id : undefined,
      name,
      imageUrl,
      setsDescription,
      repsDescription,
      restBetweenSets,
      betweenSetsRestTimeLimitS: restBetweenSets ?
        (Number((restTimeLimitMin || 0) * 60) + Number(restTimeLimitS || 0) || undefined) :
        undefined
    });
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* backdrop */}
      <div className="z-10 fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed z-50 inset-0 overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
            <form
              className="text-base relative rounded-md bg-white shadow-xl border border-slate-800 py-8 px-7 border-3 max-w-md mx-auto"
              onSubmit={onSubmit}>
              <div onClick={() => {
                onClose();
              }} className="absolute z-100 top-0 right-0 p-3 text-gray-200 cursor-pointer hover:text-gray-600 text-2xl">
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
                Rest Between Sets?
              </label>
              <div
                className="flex rounded-lg text-base w-full mb-6 border-2 border-black focus:border-black focus:outline-none"
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
                  Yes
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
                  No
                  <span className={classNames({
                    "hidden": restBetweenSets !== false,
                  })}>
                    <CheckCircleIcon className="absolute right-3 h-6 inline-block align-top text-right" />
                  </span>
                </div>
              </div>
              {
                restBetweenSets &&
                <>
                  <label htmlFor="restTimeLimit" className="mt-3 mb-2 block font-semibold">
                    Rest Time
                  </label>
                  <div className="font-semibold">
                    <input type="radio" className="mr-2" checked={!restTimeIsLimited}
                      onChange={(e: any) => setRestTimeIsLimited(!(e.target.value))}
                    /> Unlimited
                  </div>
                  <div className="mb-3">
                    <div className="flex">
                      <input type="radio" className="mr-2" checked={restTimeIsLimited}
                        onChange={(e: any) => setRestTimeIsLimited(e.target.value)}
                      />
                      <div className="relative mt-2.5">
                        <input
                          className="pl-[90px] flex-1 mr-2 rounded-lg text-base w-full p-3 border-2 border-black focus:border-black focus:outline-none"
                          type="number"
                          name="restTimeLimit"
                          value={restTimeLimitMin}
                          onChange={(e: any) => setRestTimeLimitMin(e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                        <label className="font-semibold absolute left-4 top-3.5">Minutes</label>
                      </div>
                      <div className="relative pl-2 mt-2.5">
                        <input
                          className="pl-[95px] flex-1 rounded-lg text-base w-full p-3 border-2 border-black focus:border-black focus:outline-none"
                          type="number"
                          name="restTimeLimit"
                          value={restTimeLimitS}
                          onChange={(e: any) => setRestTimeLimitS(e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                        <label className="font-semibold absolute left-6 top-3.5">Seconds</label>
                      </div>
                    </div>
                    <div className="ml-5 pl-[1px]">
                      <TimeQuickPick seconds={30} setTimeLimitMin={setRestTimeLimitMin} setTimeLimitS={setRestTimeLimitS} />
                      <TimeQuickPick seconds={30 * 2} setTimeLimitMin={setRestTimeLimitMin} setTimeLimitS={setRestTimeLimitS} />
                      <TimeQuickPick seconds={30 * 3} setTimeLimitMin={setRestTimeLimitMin} setTimeLimitS={setRestTimeLimitS} />
                      <TimeQuickPick seconds={30 * 4} setTimeLimitMin={setRestTimeLimitMin} setTimeLimitS={setRestTimeLimitS} />
                    </div>
                    {
                      restTimeIsLimited &&
                      ((restTimeLimitS || 0) + (restTimeLimitMin || 0) <= 0) &&
                      <div className="text-sm text-red-500 ml-5 pl-[1px] my-2">
                        Limited Rest time must be greater than 0.
                      </div>
                    }
                  </div>
                </>
              }
              <div>
                <label htmlFor="repsDescription" className="mt-3 mb-2 block font-semibold">
                  Preview
                </label>
                <div className="flex rounded-lg border-2 border-black">
                  <div className="relative min-h-[125px] w-[125px] bg-slate-200 flex border-r-2 border-black items-center rounded-tl-lg rounded-bl-lg overflow-hidden">
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
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

export default ExerciseForm;
