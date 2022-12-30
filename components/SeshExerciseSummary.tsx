import {  SeshInterval } from "@prisma/client";
import classNames from "classnames";
import moment from "moment";
import { useState } from "react";
import { getShortDurationFormat } from "../lib/time-utils";
import { IntervalsMeta } from "../types";

function SeshExerciseSummary({
  intervalsMeta,
  exerciseName,
}: {
  intervalsMeta: IntervalsMeta;
  exerciseName: string;
}) {
  const [showNotes, setShowNotes] = useState(false);
  return (
    <section className="mb-2 mt-0 py-6 border-b border-white0 last:border-none">
      <header className="mb-2">
        <h3 className="font-semibold text-2xl mb-1">
          {exerciseName}
        </h3>
        <h4>
          {Object.keys(intervalsMeta.intervalsBySetNo).length} sets
        </h4>
        <div className="mb-4 mt-3 text-sm uppercase tracking-widest">
          <span
            onClick={() => setShowNotes(false)}
            className={classNames(
              "mr-3 pb-1 border-b",
              {
                "opacity-50 border-transparent": showNotes,
                "border-white": !showNotes,
              }
            )}>
            Times
          </span>
          <span
            onClick={() => setShowNotes(true)}
            className={classNames(
              "pb-1 border-b",
              {
                "opacity-50 border-transparent": !showNotes, 
                "border-white": showNotes,
              }
            )}>
            Notes ({Object.keys(intervalsMeta.noteBySetNo).length})
          </span>
        </div>
      </header>
      <ul className="list-style-none p-0 whitespace-nowrap">
        {
          Object.keys(intervalsMeta.intervalsBySetNo)
          .map((setNo: string, k: number) => (
            <li key={k}>
              <div className="flex mb-1">
                <div className="mr-4 min-w-[28px]">#{setNo}</div>  
                <div className="flex">
                  {
                    showNotes ?
                    <span className="text-base">
                      {intervalsMeta.noteBySetNo[setNo]}
                    </span> :
                    intervalsMeta.intervalsBySetNo[setNo]
                    .map((interval: SeshInterval, l: number) => (
                      <div key={l} className="mr-4">
                        <span className={classNames(
                          "mr-4 w-[7px] inline-block",
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
                </div>
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  )
};

export default SeshExerciseSummary;
