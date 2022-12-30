import classNames from "classnames"
import { getHours, getMins, getSeconds } from "../lib/time-utils"

const DurationText = ({
  durationM,
}: {
  durationM: moment.Duration
}) => {
  return (
    <>
      <span className={classNames({
        "hidden": getHours(durationM) === 0, 
      })}>
        {getHours(durationM)}h
      </span>
      {' '}
      <span className={classNames({
        "hidden": getMins(durationM) === 0 && getHours(durationM) === 0, 
      })}>
        {getMins(durationM)}m
      </span>
      {' '}
      <span className={classNames({
        "hidden": getSeconds(durationM) === 0 && (getMins(durationM) > 0 || getHours(durationM) > 0),
      })}>
        {getSeconds(durationM)}s
      </span>
    </>
  )
};

export default DurationText;
