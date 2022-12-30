import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import {  Sesh, SeshInterval } from "@prisma/client";
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
  return (
    <section className="mb-2 mt-0 py-4 border-b border-white0 last:border-none">
      <header className="mb-2">
        <h3 className="font-semibold text-2xl mb-1">
          {exerciseName}
        </h3>
        <h4>
          {Object.keys(intervalsMeta.intervalsBySetNo).length} sets
        </h4>
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
      </ul>
    </section>
  )
};

export default SeshExerciseSummary;
