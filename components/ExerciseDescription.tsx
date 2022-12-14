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
            <span className="text-base mr-2 text-gray-300">Set</span>
            <span className="mr-2 text-4xl">{setNum}</span>
            <span className="text-base mr-2 text-gray-300">out of</span>
            <span className="mr-2 text-3xl text-gray-500">
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
        <span className="ml-2 text-black inline-block rounded-full text-2xl font-bold">
          <span className="text-base mr-2 text-gray-300">x</span>{repsDescription || '<Reps>'}
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
