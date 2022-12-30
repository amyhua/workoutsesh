import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Clamped from "./Clamped";

export const RestBetweenSetsDescription = ({
  value
}: {
  value: boolean;
}) => (
  <div className="text-gray-700">
    {
      value ?
      <span>
        <CheckIcon className="-ml-0.5 inline-block h-4 align-top mt-0.5 text-green-500" /> Rest between sets
      </span> : (
        <span>
          <XMarkIcon className="-ml-1.5 inline-block h-5 align-top text-red-500" /> No rest between sets
        </span>
      )
    }
  </div>
)

export const ExerciseDescription = ({ setsDescription, repsDescription }: {
  setsDescription?: string | null;
  repsDescription?: string | null;
}) => (
  <Clamped clamp={1}>
    <em>Sets:</em> {setsDescription || '<Sets>'}. <em>Reps:</em> {repsDescription || '<Reps>'}
  </Clamped>
);

export const OptionalText = () => (
  <span className="text-gray-400 ml-1">optional</span>
);
