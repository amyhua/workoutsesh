import { SeshInterval } from "@prisma/client";
import moment from "moment";
import { formatShortFromNow } from "../lib/time-utils";
import Clamped from "./Clamped";

const IntervalNote = ({
  interval,
  className,
}: {
  interval: SeshInterval;
  className?: string;
}) => (
  <div className={className}>
    <div className="text-xs sm:text-base text-white/50">
      <Clamped clamp={1}>
        <span className="text-white/70">
          {
            moment(interval.createdAt).isSame(new Date(), 'day') ?
            'Today at' : moment(interval.createdAt).format('ddd MMM D [at]')
          }
          {' '}
          {
            moment(interval.createdAt).format('h:mma')
          }
        </span> {formatShortFromNow(moment(interval.createdAt).fromNow())}
      </Clamped>
    </div>
    <div className="text-sm sm:text-lg text-white whitespace-nowrap text-ellipsis w-full overflow-hidden">
      {interval.note}
    </div>
  </div>
)
export default IntervalNote;
