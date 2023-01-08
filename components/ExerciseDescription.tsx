import classNames from "classnames";
import Clamped from "./Clamped";

const ExerciseDescription = ({
  setsDescription,
  repsDescription,
  fancy = false,
  setNum,
}: {
  setsDescription?: string | null;
  repsDescription?: string | null;
  setNum?: number;
  fancy?: boolean;
}) => (
  <>
    {
      fancy ?
      <>
        {
          setNum ?
          <>
            <span className="text-base mr-2 text-gray-300">Set</span>
            <span className="mr-2 text-4xl">{setNum}</span>
            <span className="text-base mr-2 text-gray-300">out of</span>
            <span className={classNames(
              "mr-2 text-gray-500",
              {
                "text-3xl": setsDescription,
                "text-xl": !setsDescription,
              }
            )}>
              {setsDescription || '--'}
            </span>
          </>
          : <>
            <span className="bg-green-600 inline-block p-2 text-white rounded-full text-base font-bold">
              {setsDescription || '--'}
            </span>
            <span className="mx-2">
              sets of
            </span>
          </>
        }
        <span className="ml-0 text-black inline-block rounded-full text-2xl font-bold">
          <span className="text-base mr-2 text-gray-300">x</span>
          <span className={classNames({
            "text-2xl": repsDescription,
            "text-xl text-gray-500": !repsDescription,
          })}>
            {repsDescription || 'N/A Reps'}
          </span>
        </span>
      </>
      :
      !setsDescription && !repsDescription ? null :
      <>
      <span className="text-white/60 mr-2">Sets</span>
      <span className="text-white">{setsDescription || '--'}</span>
      <span className="mx-2">·</span>
      <span className="text-white/60 mr-2">Reps</span>
      <span className="text-white">{repsDescription || '--'}</span>
      </>
    }
  </>
)

export default ExerciseDescription
