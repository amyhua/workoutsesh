import { BoltIcon, BoltSlashIcon, ChatBubbleLeftIcon, FunnelIcon, HashtagIcon } from "@heroicons/react/20/solid";
import {  SeshInterval } from "@prisma/client";
import moment from "moment";
import { IntervalsMeta } from "../types";
import DurationText from "./DurationText";

const getAverageSet = (ints: SeshInterval[], isActive: boolean) => {
  const periods = ints.filter((int: SeshInterval) => int.active === isActive);
  const sumS = periods.reduce((sum, pd: SeshInterval) => sum + pd.durationS, 0);
  return Number((sumS / periods.length).toFixed(1));
}

function SeshExerciseSummary({
  intervalsMeta,
  exerciseName,
  onSelect,
}: {
  intervalsMeta: IntervalsMeta;
  exerciseName: string;
  onSelect: () => void;
}) {
  const avgActive = getAverageSet(intervalsMeta.intervals, true);
  const avgRest = getAverageSet(intervalsMeta.intervals, false);
  const activeDuration = avgActive ? moment.duration(avgActive, 'seconds') : 0;
  const restDuration = avgRest ? moment.duration(avgRest, 'seconds') : 0;
  return (
    <section className="block sm:inline-block mt-0 py-4 sm:mr-8 min-w-[180px]">
      <header className="mb-2">
        <div
          onClick={onSelect}
          className="flex group cursor-pointer">
          <h3 className="flex-1 font-bold text-xl mb-1 mr-4">
            {exerciseName}
          </h3>
          <div>
            <FunnelIcon
              className="cursor-pointer h-4 inline-block mt-1 -mr-0.5 text-white/20 group-hover:text-pink"
            />
          </div>
        </div>
        <table className="text-white/60 w-full">
          <tbody>
            <tr>
              <td className="pr-5">
                <HashtagIcon className="-mt-1 h-4 mr-1 inline-block w-5" />
                Sets
              </td>
              <td className="text-right">{intervalsMeta.intervals.filter((i: any) => i.active).length}</td>
            </tr>
            <tr>
              <td className="pr-5">
                <HashtagIcon className="-mt-1 h-4 mr-1 inline-block w-5" />
                Rest Periods
              </td>
              <td className="text-right">{intervalsMeta.intervals.filter((i: any) => !i.active).length}</td>
            </tr>
            <tr>
              <td className="pr-5">
              <BoltIcon className="-mt-1 h-4 mr-1 inline-block text-brightGreen" /> Set Average
              </td>
              <td className="text-right">
                {
                  activeDuration ?
                  <DurationText
                    durationM={activeDuration}
                  />
                  :
                  'None'
                }
              </td>
            </tr>
            <tr>
              <td className="pr-5">
                <BoltSlashIcon className="-mt-1 h-4 mr-1 inline-block text-white/40" /> Rest Average
              </td>
              <td className="text-right">
                {
                  restDuration ?
                  <DurationText
                    durationM={restDuration}
                  />
                  :
                  'None'
                }
              </td>
            </tr>
          </tbody>
        </table>
      </header>
      {/* <ul className="list-style-none p-0 whitespace-nowrap">
        {
          Object.keys(intervalsMeta.intervalsBySetNo)
          .map((setNo: string, k: number) => (
            <li key={k}>
              <div className="flex mb-1">
                <div className="mr-4 min-w-[28px]">#{setNo}</div>  
                <div className="flex">
                  {
                    intervalsMeta.intervalsBySetNo[setNo]
                    .sort((a: SeshInterval, b: SeshInterval) => (b.active ? 1 : 0) - (a.active ? 1 : 0))
                    .map((interval: SeshInterval, l: number) => (
                      <div key={l} className="mr-2">
                        <span className={classNames(
                          "mr-3 w-[7px] inline-block",
                          {
                            "text-yellow-100": interval.active,
                            "text-gray-400": !interval.active,
                          }
                        )}>
                          {interval.active ? 'S' : 'R'}
                        </span>
                        <span className={classNames(
                          "font-mono mr-2",
                          {
                            "text-yellow-100": interval.active,
                            "text-gray-400": !interval.active,
                          }
                        )}>
                          {getShortDurationFormat(moment.duration(interval.durationS, 'seconds'))}
                        </span>
                      </div>
                    ))
                  }
                  {
                    intervalsMeta.noteBySetNo[setNo] &&
                    <span>
                      <ChatBubbleLeftIcon className="inline-block h-3 -mt-0.5 mr-1" /> {intervalsMeta.noteBySetNo[setNo]}
                    </span>
                  }
                </div>
              </div>
            </li>
          ))
        }
      </ul> */}
    </section>
  )
};

export default SeshExerciseSummary;
