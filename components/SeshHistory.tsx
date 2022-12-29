import { BoltIcon, BoltSlashIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Exercise, SeshInterval } from "@prisma/client";
import classNames from "classnames";
import moment from "moment";

const SeshHistory = ({
  intervals=[],
}: {
  intervals: (SeshInterval & { exercise: Exercise })[];
}) => {
  return (
    <div className="px-4 overflow-auto bg-white">
      {
        intervals.map((interval: SeshInterval & { exercise: Exercise }, i: number) => (
          <div key={i} className="pt-1 pb-2 text-xs">
            <div className="flex">
              <div className="mr-3 text-xs text-gray-400">
                {moment(interval.createdAt).format('hh:mm:ss')}
              </div>
              <div className={classNames(
                "w-12 text-xs",
                {
                  "text-green-600": interval.active,
                  "text-gray-400": !interval.active,
                }
              )}>
                {interval.active && <span className="inline-block mr-1 text-xs">SET {interval.setNo}</span>}
                {!interval.active && <BoltSlashIcon className="h-3" />}
              </div>
              <div className="flex-1 font-bold">{interval.exercise && interval.exercise.name}</div>
            </div>
            {
              interval.note ?
              <div className="mt-2 ml-[107px] rounded-sm bg-yellow-50">
                {interval.note}
              </div>
              : null
            }
          </div>
        ))
      }
    </div>
  );
};

export default SeshHistory;
