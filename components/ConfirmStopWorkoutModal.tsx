import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

const ConfirmStopWorkoutModal = ({
  open,
  onClose,
  onConfirm,
} : {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {/* backdrop */}
      <div className="z-10 fixed inset-0 bg-black/70" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed z-50 inset-0 overflow-y-auto">
        {/* Container to center the panel */}
        <div className="min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="z-20 fixed flex inset-4 items-center justify-center text-base overflow-auto">
            <div className="relative bg-white p-4 shadow-2xl">
              <div onClick={onClose}
                className="absolute top-0 right-0 p-3 cursor-pointer text-2xl text-gray-300 hover:text-black focus:text-black">
                <XMarkIcon className="h-9" />
              </div>
              <div>
                <h2 className="font-semibold text-2xl text-center mb-10 mt-10">
                  Are you sure you want to finish this workout?
                </h2>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  type="button"
                  className="bg-brightGreen cursor-pointer text-lg font-bold mt-0 py-3 rounded-md border-2 border-black hover:bg-brightGreen text-black w-full">
                  Finish this Workout
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full my-3 py-3 text-center text-gray-500">
                  No. Continue Workout.
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
};

export default ConfirmStopWorkoutModal;
