import { BoltIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { Sesh, SeshInterval } from "@prisma/client";
import classNames from "classnames";
import moment from "moment";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Layout from "../../../../components/Layout";
import { prisma } from '../../../../lib/prismadb'

const getHours = (durationM: moment.Duration) => Math.floor(durationM.asHours());
const getMins = (durationM: moment.Duration) => Math.floor(durationM.asMinutes() % 60);
const getSeconds = (durationM: moment.Duration) => Math.floor(durationM.asSeconds() % 60);
const getZeroPrefixedNum = (num: number, length: number = 2) => (
  String(num).length >= length ? num : Array(length - String(num).length).fill(0).join('') + num
);
const getShortDurationFormat = (durationM: moment.Duration) => (
  (getHours(durationM) ? getZeroPrefixedNum(getHours(durationM)) + ':' : '') +
  (getMins(durationM) ? getZeroPrefixedNum(getMins(durationM)) + ':' : '00:') +
  (getSeconds(durationM) ? getZeroPrefixedNum(getSeconds(durationM)) : '00')
);

const DurationText = ({
  durationM,
}: {
  durationM: moment.Duration
}) => {
  return (
    <>
      <span className={classNames("mr-2", {
        "hidden": getHours(durationM) === 0, 
      })}>
        {getHours(durationM)}h
      </span>
      <span className={classNames("mr-2", {
        "hidden": getMins(durationM) === 0 && getHours(durationM) === 0, 
      })}>
        {getMins(durationM)}m
      </span>
      <span className={classNames({
        "hidden": getSeconds(durationM) === 0, 
      })}>
        {getSeconds(durationM)}s
      </span>
    </>
  )
}

type IntervalsMeta = {
  intervalsBySetNo: Record<string, SeshInterval[]>;
  noteBySetNo: Record<string, string>;
}

function SeshExerciseSummary({
  intervalsMeta,
  exerciseName,
}: {
  intervalsMeta: IntervalsMeta;
  exerciseName: string;
}) {
  const [showNotes, setShowNotes] = useState(false);
  return (
    <section className="mb-10 mt-7">
      <header className="mb-2">
        <h3 className="font-semibold text-xl mb-1">
          {exerciseName}
        </h3>
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
            Notes
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

function SeshPage({
  sesh,
}: {
  sesh: Sesh & { intervals: SeshInterval[] } | null
}) {
  sesh = typeof sesh === 'string' ? JSON.parse(sesh) : null;

  if (!sesh) return null; // TODO: handle

  const totalTimeM = moment.duration(sesh.timeCompletedS, 'seconds');
  const activePeriods = sesh.intervals.filter((int: SeshInterval) => int.active);
  const restPeriods = sesh.intervals.filter((int: SeshInterval) => !int.active);
  const activePeriodsTotalDur = activePeriods.reduce((sum: number, int: SeshInterval) => sum + int.durationS, 0);
  const restPeriodsTotalDur = restPeriods.reduce((sum: number, int: SeshInterval) => sum + int.durationS, 0);
  const activePeriodDurationAvg = activePeriodsTotalDur / activePeriods.length;
  const activePeriodDurationAvgM = moment.duration(activePeriodDurationAvg, 'seconds');
  const restPeriodDurationAvg = restPeriodsTotalDur / restPeriods.length;
  const restPeriodDurationAvgM = moment.duration(restPeriodDurationAvg, 'seconds');
  const intervalsByExerciseName: any = {};
  sesh.intervals.forEach((interval: any) => {
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
    <Layout title="Sesh Summary" background="#345537">
      <div className="text-white m-7">
        <h1 className="text-4xl font-bold">
          Great Job!
        </h1>
        <h2 className="tracking-wide mt-5 text-xl font-semibold">
          Workout Summary
        </h2>
        {/* overall stats */}
        <div className="mb-8">
          <ul className="list-style-none p-0 mt-4">
            <li className="mb-1">
              <span className="inline-block opacity-70 w-[130px]">
                Total Time
              </span>
              <span className="ml-1 font-semibold text-lg">
                <DurationText durationM={totalTimeM} />
              </span>
            </li>
            <li className="mb-1">
              <span className="inline-block opacity-70 w-[130px]">
                Average Set
              </span>
              <span className="ml-1 font-semibold text-lg">
                <DurationText durationM={activePeriodDurationAvgM} />
              </span>
            </li>
            <li className={classNames("mb-1", {
              "hidden": restPeriods.length === 0,
            })}>
              <span className="inline-block opacity-70 w-[130px]">
                Average Rest
              </span>
              <span className="ml-1 font-semibold text-lg">
                <DurationText durationM={restPeriodDurationAvgM} />
              </span>
            </li>
          </ul>
        </div>
        <div className="font-mono text-sm mb-2">
          <span className="mr-4">S = Set</span>
          R = Rest
        </div>
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
    </Layout>
  );
}

export default SeshPage;

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);
    if (session && session.user) {
      const { email } = session.user;
      const sesh = await prisma.sesh.findFirstOrThrow({
        where: {
          id: Number(context.query.seshId),
          userEmail: String(email),
        },
        include: {
          intervals: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              createdAt: true,
              active: true,
              durationS: true,
              note: true,
              setNo: true,
              exercise: {
                select: {
                  name: true,
                }
              }
            },
          },
        },
      });
      return {
        props: {
          session: JSON.stringify(session),
          sesh: sesh ? JSON.stringify(sesh) : null,
          params: context.params,
        }
      };
    }
    // TODO: handle not logged in user
  } catch(error) {
    return {
      props: {
        error: error ? JSON.stringify(error): null
        // TODO: handle errors
      }
    }
  }
}