import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

const RestBetweenSetsDescription = ({
  value,
  className='text-gray-700',
}: {
  value: boolean;
  className?: string;
}) => (
  <div className={className}>
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

export default RestBetweenSetsDescription;
