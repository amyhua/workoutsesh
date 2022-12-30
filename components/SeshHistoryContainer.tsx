import { ArrowLeftIcon, PlayIcon } from "@heroicons/react/20/solid";
import { Exercise, Sesh, SeshInterval } from "@prisma/client";
import classNames from "classnames";
import moment from "moment";
import { IntervalsMeta } from "../types";
import DurationText from "./DurationText";
import SeshExerciseSummary from "./SeshExerciseSummary";
import Link from "next/link";

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
  sesh?: Sesh;
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
  console.log('intervalsByExerciseName', intervalsByExerciseName)
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
        <div className="mb-3">
          <ul className={classNames(
            "list-style-none p-0",
            {
              "mt-4": isSeshPage,
            }
          )}>
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
          </ul>
        </div>
        {
          Object.keys(intervalsByExerciseName).length ?
          <div className="opacity-70 font-mono text-sm mb-2">
            <span className="mr-4">S = Set</span>
            R = Rest
          </div>
          :
          <div className="text-lg">
            This workout sesh is empty.
          </div>
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
