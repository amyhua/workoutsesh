import { ArrowLeftIcon, BoltIcon, BoltSlashIcon, ChatBubbleLeftIcon, CheckIcon, FunnelIcon, PlayIcon } from "@heroicons/react/20/solid";
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
  const [filterExerciseName, setFilterExerciseName] = useState<string>();
  const exerciseHeaderCount: any = {};
  const intervalsByExerciseName: any = {};
  intervals.forEach((interval: any, i: number) => {
    if (!interval.exercise) {
      console.log('in!', interval);
      debugger
    }
    // at every interval with setNo = 1,
    // specify new group, where group prefix (none, '#2', '#3', etc)
    // is determined by a count of where it previously appeared.

    // we know that set numbers are chronological
    if (interval.setNo === 1) {
      exerciseHeaderCount[interval.exercise.name] = (
        exerciseHeaderCount[interval.exercise.name] || 0
      ) + 1;
    }
    // let groupName = interval.exercise.name + (
    //   exerciseHeaderCount[interval.exercise.name] > 1 ?
    //     ' #' + exerciseHeaderCount[interval.exercise.name] : ''
    // );
    const groupName = interval.exercise.name;
    intervalsByExerciseName[groupName] = intervalsByExerciseName[groupName]|| [];
    intervalsByExerciseName[groupName].push(interval);
  });
  Object.keys(intervalsByExerciseName).forEach((name: string) => {
    intervalsByExerciseName[name] = intervalsByExerciseName[name].reduce((meta: IntervalsMeta, interval: any) => {
      meta.intervalsBySetNo[interval.setNo] = meta.intervalsBySetNo[interval.setNo] || [];
      meta.intervalsBySetNo[interval.setNo].push(interval);
      meta.intervals = meta.intervals || [];
      meta.intervals.push(interval);
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
        "overflow-auto",
        {
          "h-[100vh] p-7 pb-[200px] text-white": isSeshPage,
          "px-2.5 mb-5 bg-transparent pb-[50px] text-white": !isSeshPage,
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
                <li className="flex mb-2">
                  <div className="inline-block opacity-70 w-[110px]">
                    Name
                  </div>
                  <div className="flex-1 ml-1 font-normal">
                    {workoutName}
                  </div>
                </li>
                {
                  sesh && sesh.timeCompletedS &&
                  <li className="mb-1">
                    <span className="inline-block opacity-70 w-[110px]">
                      Total Time
                    </span>
                    <span className="ml-1">
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
                  <span className="ml-1">
                    <DurationText durationM={activePeriodDurationAvgM} />
                  </span>
                </li>
                <li className={classNames("mb-1", {
                  "hidden": restPeriods.length === 0,
                })}>
                  <span className="inline-block opacity-70 w-[110px]">
                    Average Rest
                  </span>
                  <span className="ml-1">
                    <DurationText durationM={restPeriodDurationAvgM} />
                  </span>
                </li>
              </>
            }
          </ul>
        </div>
        <div className="">
        {
          Object.keys(intervalsByExerciseName).map((exerciseName: string, i: number) => (
            <SeshExerciseSummary
              key={i}
              exerciseName={exerciseName}
              intervalsMeta={intervalsByExerciseName[exerciseName]}
              onSelect={() => setFilterExerciseName(exerciseName)}
            />
          ))
        }
        </div>
        {
          !isSeshPage && activePeriods.length ?
          <>
            <h2 className="font-bold text-xl mb-3 mt-0 flex items-center">
              Completed Sets {
                filterExerciseName &&
                <span
                  onClick={() => setFilterExerciseName('')}
                  className="cursor-pointer group font-normal text-base mt-1 inline-block">
                  <FunnelIcon
                    className="cursor-pointer h-4 inline-block ml-4 mr-2 -mt-1 text-pink"
                  />
                  {filterExerciseName} <span className="ml-1 text-white/40 group-hover:text-white underline">clear</span>
                </span>
              }
            </h2>
            <div className="max-h-[400px] overflow-auto">
              {
                intervals
                .filter((int: any) =>
                  filterExerciseName ?
                  int.exercise.name === filterExerciseName : true
                )
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((int: any, i: number) => (
                  <article className={classNames(
                    "text-base bg-white/10 py-3 px-3 rounded-sm mb-2 min-w-[400px]",
                  )} key={i}>
                    <div className="flex items-center">
                      <div className="hidden md:inline-block min-w-[100px] text-white/40 pr-2">
                        {moment(int.createdAt).format('M/D/YYYY H:mm:ss')}
                      </div>
                      <div className="inline-block md:hidden text-white/40 pr-2">
                        {moment(int.createdAt).format('H:mm:ss')}
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden text-ellipsis inline-block whitespace-nowrap">
                        {int.exercise.name}
                      </div>
                      <div className="mr-4">
                        Set {int.setNo}
                      </div>
                      <div className="mr-4">
                        {
                          int.active ?
                          <BoltIcon className="-mt-1 h-4 inline-block text-brightGreen" />
                          :
                          <BoltSlashIcon className="-mt-1 h-4 inline-block text-white/40" />
                        }
                      </div>
                      <div className="mr-4">{getShortDurationFormat(moment.duration(int.durationS, 'seconds'))}</div>
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
            </div>
          </>
          : null
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
