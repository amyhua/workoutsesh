import { Dialog } from "@headlessui/react";
import { Exercise } from "@prisma/client";
import classNames from "classnames";
import moment from "moment";
import { useState } from "react";
import { OptionalText } from "./FormComponents";

const RestForm = ({
  open,
  editing,
  onClose,
  exercise,
  onRemove,
  setExercise,
}: {
  open: boolean;
  editing: boolean;
  onClose: () => void;
  exercise: Exercise | Partial<Exercise>;
  onRemove: () => void;
  setExercise: any;
}) => {
  const editedMins = exercise ?
    Math.floor(moment.duration(exercise.timeLimitS, 'seconds').asMinutes())
    : undefined;
  const [restTimeLimitS, setRestTimeLimitS] = useState<number | undefined>(
    exercise && exercise.timeLimitS ?
    (exercise.timeLimitS - (editedMins || 0) * 60)
    : undefined
  );
  const [restTimeLimitMin, setRestTimeLimitMin] = useState<number | undefined>(
    editedMins ? editedMins : undefined);
  const onSubmit = (e: any) => {
    e.preventDefault();
    setExercise({
      id: new Date().getTime(),
      name: 'Rest',
      isRest: true,
      timeLimitS: Number((restTimeLimitMin || 0) * 60) + Number(restTimeLimitS || 0) || null,
    })
    onClose();
  }

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      {/* backdrop */}
      <div className="z-10 fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed z-50 inset-0 overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="z-20 fixed inset-0 flex items-center justify-center p-4 text-base overflow-auto">
            <form
              className="text-base min-w-[350px] relative rounded-md bg-white shadow-xl sm:mt-[90px] border border-slate-800 py-8 px-7 border-3 max-w-md mx-auto"
              onSubmit={onSubmit}
            >
              <div onClick={onClose} className="absolute top-0 right-0 p-3 text-gray-200 cursor-pointer hover:text-gray-600 text-2xl">
                ✖
              </div>
              <h2 className="font-bold text-2xl">
                { editing ? 'Edit' : 'Add'} Rest Period
              </h2>

              <label htmlFor="restTimeLimit" className="mt-3 mb-2 block font-semibold">
                Time Limit <OptionalText />
              </label>
              <div className="flex mb-2">
                <div className="relative">
                  <input
                    className="pl-[90px] flex-1 mr-2 rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
                    type="number"
                    name="restTimeLimit"
                    value={restTimeLimitMin}
                    onChange={(e: any) => setRestTimeLimitMin(e.target.value)}
                    placeholder="0"
                  />
                  <label className="font-semibold absolute left-4 top-3.5">Minutes</label>
                </div>
                <div className="relative pl-2">
                  <input
                    className="pl-[95px] flex-1 rounded-lg text-base w-full p-3 mb-3 border-2 border-black focus:border-black focus:outline-none"
                    type="number"
                    name="restTimeLimit"
                    value={restTimeLimitS}
                    onChange={(e: any) => setRestTimeLimitS(e.target.value)}
                    placeholder="0"
                  />
                  <label className="font-semibold absolute left-6 top-3.5">Seconds</label>
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer text-lg font-bold mt-0 py-3 rounded-md border-2 border-black hover:bg-brightGreen text-black w-full">
                { editing ? 'Update' : 'Add'} Rest
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
};
export default RestForm;
