import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import moment from "moment";
import DurationText from "./DurationText";

const RestCounterBadge = ({
  timerS,
  timeLimitS,
  className,
}: {
  timerS: number;
  timeLimitS: number;
  className?: string;
}) => {
  return (
    timerS === timeLimitS ?
    <strong className="font-bold ml-1 text-xl text-green-400">Done!</strong>
    :
    timerS > timeLimitS ?
    <span className={classNames(
      "text-white font-bold text-xl ml-1",
      className
    )}>
      <ExclamationTriangleIcon className="inline-block h-6 text-yellow-400 mr-1 -mt-[1px]" />
      <DurationText short={true}
          durationM={moment.duration(timerS - timeLimitS, 'seconds')}
        /> <span className="text-red-300">over!</span>
    </span>
    :
    <span className={classNames(
      "text-xl",
      className
    )}>
      <strong className={classNames("font-bold", {
        "text-green-300": timeLimitS - timerS > 20,
        "text-yellow-200": timeLimitS - timerS <= 20 &&
        timeLimitS - timerS > 10,
        "text-yellow-300": timeLimitS - timerS <= 10 &&
        timeLimitS - timerS > 5,
        "text-yellow-400": timeLimitS - timerS <= 5,
      })}>
        <DurationText short={true}
          durationM={moment.duration(timeLimitS - timerS, 'seconds')}
        />
      </strong> left
    </span>
  )
}
export default RestCounterBadge;
