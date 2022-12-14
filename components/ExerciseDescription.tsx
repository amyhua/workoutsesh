import Clamped from "./Clamped";

const ExerciseDescription = ({
  setsDescription,
  repsDescription,
  fancy = false,
  setNum,
}: {
  setsDescription: string;
  repsDescription: string;
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
            <span className="text-sm mr-2 text-gray-400">Set</span>
            <span className="mr-2 text-xl">{setNum}</span>
            <span className="text-sm mr-2 text-gray-400">of</span>
            <span className="mr-2 text-xl">
              {setsDescription || '<Sets>'}
            </span>
          </>
          : <>
            <span className="bg-green-600 inline-block p-2 text-white rounded-full text-base font-bold">
              {setsDescription || '<Sets>'}
            </span>
            <span className="mx-2">
              sets of
            </span>
          </>
        }
        <span className="ml-3 text-black inline-block rounded-full text-lg font-bold">
          <span className="text-sm mr-2 text-gray-400">Reps:</span>{repsDescription || '<Reps>'}
        </span>
      </>
      :
      <>
      {setsDescription || '<Sets>'} sets of {repsDescription || '<Reps>'}
      </>
    }
  </>
)

export default ExerciseDescription
