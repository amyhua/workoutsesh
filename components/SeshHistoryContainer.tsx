import { ArrowLeftIcon, BoltIcon, ChatBubbleLeftIcon, CheckIcon, PlayIcon } from "@heroicons/react/20/solid";
import { Exercise, Sesh, SeshInterval } from "@prisma/client";
import classNames from "classnames";
import moment from "moment";
import { IntervalsMeta, SeshDatum } from "../types";
import DurationText from "./DurationText";
import SeshExerciseSummary from "./SeshExerciseSummary";
import Link from "next/link";
import { getShortDurationFormat } from "../lib/time-utils";
import { useState } from "react";

function SeshHistoryContainer({
  intervals,
  workoutName,
  workoutId,
  isSeshPage = false,
  sesh,
}: {
  intervals: (SeshInterval & { exercise: Exercise })[];
  workoutName?: string | null;
  workoutId?: number | null;
  isSeshPage?: boolean;
  sesh?: Sesh | SeshDatum;
}) {
  const totalTimeM = moment.duration(sesh ? sesh.timeCompletedS : 0, 'seconds');
  const activePeriods = intervals.filter((int: SeshInterval) => int.active);
  const restPeriods = intervals.filter((int: SeshInterval) => !int.active);
  const activePeriodsTotalDur = activePeriods.reduce((sum: number, int: SeshInterval) => sum + int.durationS, 0);
  const restPeriodsTotalDur = restPeriods.reduce((sum: number, int: SeshInterval) => sum + int.durationS, 0);
  const activePeriodDurationAvg = activePeriodsTotalDur / activePeriods.length;
  const activePeriodDurationAvgM = moment.duration(activePeriodDurationAvg, 'seconds');
  const restPeriodDurationAvg = restPeriodsTotalDur / restPeriods.length;
  const restPeriodDurationAvgM = moment.duration(restPeriodDurationAvg, 'seconds');
  const [lastShownRowIdx, setLastShownRowIdx] = useState(4);
  const intervalsByExerciseName: any = {};
  intervals.forEach((interval: any) => {
    if (!interval.exercise) {
      console.log('in!', interval);
      debugger
    }
    intervalsByExerciseName[interval.exercise.name] = intervalsByExerciseName[interval.exercise.name]|| [];
    intervalsByExerciseName[interval.exercise.name].push(interval);
  });
  Object.keys(intervalsByExerciseName).forEach((name: string) => {
    intervalsByExerciseName[name] = intervalsByExerciseName[name].reduce((meta: IntervalsMeta, interval: any) => {
      meta.intervalsBySetNo[interval.setNo] = meta.intervalsBySetNo[interval.setNo] || [];
      meta.intervalsBySetNo[interval.setNo].push(interval);
      if (interval.note) meta.noteBySetNo[interval.setNo] = interval.note;
      return meta;
    }, {
      intervalsBySetNo: {},
      noteBySetNo: {},
    } as IntervalsMeta)
  });
  return (
    <>
      <div className={classNames(
        "p-7 h-[100vh] pb-[200px] overflow-auto",
        {
          "text-white": isSeshPage,
          "bg-gray-700 text-white": !isSeshPage,
        }
      )}>
        {
          isSeshPage &&
          <h1 className="text-4xl font-bold">
            Great Job!
          </h1>
        }
        {
          isSeshPage &&
          <h2 className={classNames(
            "tracking-wide",
            {
              "mt-5": isSeshPage,
            }
          )}>
            <div className="font-bold text-2xl">Summary</div>
          </h2>
        }
        {/* overall stats */}
        <div>
          <ul className={classNames(
            "list-style-none p-0",
            {
              "mt-4 mb-3": isSeshPage,
            }
          )}>
            {
              isSeshPage &&
              <>
                <li className="mb-2">
                  <span className="inline-block opacity-70 w-[110px]">
                    Name
                  </span>
                  <span className="ml-1 font-semibold text-lg">
                    {workoutName}
                  </span>
                </li>
                {
                  sesh && sesh.timeCompletedS &&
                  <li className="mb-1">
                    <span className="inline-block opacity-70 w-[110px]">
                      Total Time
                    </span>
                    <span className="ml-1 font-semibold text-lg">
                      <DurationText durationM={totalTimeM} />
                    </span>
                  </li>
                }
                <li className={classNames("mb-1", {
                  "hidden": activePeriods.length === 0,
                })}>
                  <span className="inline-block opacity-70 w-[110px]">
                    Average Set
                  </span>
                  <span className="ml-1 font-semibold text-lg">
                    <DurationText durationM={activePeriodDurationAvgM} />
                  </span>
                </li>
                <li className={classNames("mb-1", {
                  "hidden": restPeriods.length === 0,
                })}>
                  <span className="inline-block opacity-70 w-[110px]">
                    Average Rest
                  </span>
                  <span className="ml-1 font-semibold text-lg">
                    <DurationText durationM={restPeriodDurationAvgM} />
                  </span>
                </li>
              </>
            }
          </ul>
        </div>
        {
          Object.keys(intervalsByExerciseName).length ?
          <div className="opacity-70 font-mono text-sm mb-2">
            <span className="mr-4">S = Set</span>
            R = Rest
          </div>
          :
          <div className="mt-1 text-lg">
            Nothing yet.
          </div>
        }
        {
          !isSeshPage && activePeriods.length ?
          <>
            <h2 className="font-semibold mb-2 mt-5">Most recent</h2>
            {
              activePeriods
              .slice(0, lastShownRowIdx + 1)
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((int: any, i: number) => (
                <article className={classNames(
                  "flex text-base mb-2 py-1.5 border-b",
                  {
                    "border-white0": i < Math.min(lastShownRowIdx, activePeriods.length - 1),
                    "border-none": i >= Math.min(lastShownRowIdx, activePeriods.length - 1),
                  }
                )} key={i}>
                  <div>
                    <span className="opacity-60 mr-3">{getShortDurationFormat(moment.duration(int.durationS, 'seconds'))}</span>
                    <span className="whitespace-nowrap">{int.exercise.name}</span>
                    {
                      int.note &&
                      <div className="ml-[28px] text-yellow-100 italic">
                        <ChatBubbleLeftIcon className="inline-block h-3 text-yellow-200 -mt-0.5 mr-3" /> {int.note}
                      </div>
                    }
                  </div>
                </article>
              ))
            }
            {
              lastShownRowIdx < activePeriods.length - 1 &&
              <div
                onClick={() => setLastShownRowIdx((idx:number) => idx + 5)}
                className="inline-block my-2 cursor-pointer text-sm italic">
                Show more
              </div>
            }
          </>
          : null
        }
        {
          Object.keys(intervalsByExerciseName).map((exerciseName: string, i: number) => (
            <SeshExerciseSummary
              key={i}
              exerciseName={exerciseName}
              intervalsMeta={intervalsByExerciseName[exerciseName]}
            />
          ))
        }
      </div>
      {
        isSeshPage &&
        <div className="z-50 bottom-0 left-0 right-0 bg-[#345537] fixed w-[100vw] py-5 px-6 border-t border-white0 text-white">
          <Link href={`/workout/${workoutId}`}>
            <button className="w-full text-lg px-3 py-2 rounded-lg bg-white0 block">
              <PlayIcon className="inline-block h-5 align-middle -mt-[3px] mr-1" /> Start New Sesh
            </button>
          </Link>
          <Link href="/">
            <button className="w-full px-3 py-2 rounded-lg block mt-2 text-base text-whitem1">
              <ArrowLeftIcon className="inline-block h-5 align-middle -mt-[3px] mr-1" /> Back to Workouts
            </button>
          </Link>
        </div>
      }
    </>
  );
}

export default SeshHistoryContainer;
