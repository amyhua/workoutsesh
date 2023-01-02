import { CheckIcon, PlayCircleIcon, StopIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import moment from "moment";
import { useState } from "react";
import { SeshDto } from "../types";
import DurationText from "./DurationText";

const ActiveSesh = ({
  sesh,
  resumeSesh,
  stopSesh,
  unstopSesh,
} : {
  sesh: SeshDto,
  resumeSesh: (val: number) => Promise<any>;
  stopSesh: (val: number) => Promise<any>;
  unstopSesh: (val: number) => Promise<any>;
}) => {
  const [finishedAt, setFinishedAt] = useState(sesh.finishedAt);
  const time = sesh.pausedAt || sesh.updatedAt;
  const durationM = moment.duration(sesh.timeCompletedS, 'seconds');
  return (
    <article className={classNames(
      "mb-3 text-slate-700",
      {
        "flex": !finishedAt
      }
    )}>
      {
        finishedAt ?
        <div className="text-gray-600 text-sm my-2">
          <CheckIcon className="ml-1 text-green-500 inline-block mr-1 h-5 -mt-0.5" /> Workout marked completed.
          <span
            onClick={() => unstopSesh(sesh.id).then(() => setFinishedAt(undefined))}
            className="cursor-pointer underline ml-2">
            Undo
          </span>
        </div>
        :
        <>
          <div
            onClick={() => {
              resumeSesh(sesh.id)
            }}
            className="group/play cursor-pointer flex-1 flex">
            <div>
              <PlayCircleIcon className="-ml-1 h-14 mt-0.5 mr-2 group-hover/play:text-green-500 text-black" />
            </div>
            <div className="flex-1 pt-2">
              <span className="mr-1 font-bold">
                {moment(time).format('ddd MMM D h:mma')}
              </span>
              <div className="text-gray-400 text-xs">
                <span className="inline-block mr-2">
                  Duration: <DurationText durationM={durationM} />
                </span>
                <div>
                  {
                    sesh.pausedAt ?
                      'Paused ' + moment(sesh.pausedAt).fromNow() :
                      'Started ' + moment(sesh.createdAt).fromNow()
                  }
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => stopSesh(sesh.id).then(() => setFinishedAt('DEFINED'))}
            className="pl-1 pt-2 cursor-pointer group/stop">
            <div className="p-2 rounded-lg bg-red-100 font-semibold text-red-400 group-hover/stop:text-red-600 text-xs pr-2">
              <StopIcon className="inline-block h-4 -mt-[3px] mr-0.5" /> Stop
            </div>
          </div>
        </>
      }
    </article>
  )
}

const ActiveSeshes = ({
  seshes: initialSeshes=[],
  resumeSesh,
  stopSesh,
  unstopSesh,
}: {
  seshes: SeshDto[],
  resumeSesh: (val: number) => Promise<any>;
  stopSesh: (val: number) => Promise<any>;
  unstopSesh: (val: number) => Promise<any>;
}) => {
  const [seshes, setSeshes] = useState<SeshDto[]>(initialSeshes);
  return (
    <div className="py-5 px-4 bg-white shadow-xl drop-shadow-xl rounded-xl mb-5"
      style={{
        filter: 'drop-shadow(0 -5px 25px rgb(0 0 0 / 4%)) drop-shadow(0 0px 40px rgb(0 0 0 / 0.1))',
      }}>
      <h2 className="text-black text-left text-lg mb-3 font-bold">
        Resume a Workout
      </h2>
      {
        seshes.map((sesh: SeshDto, i) => (
          <ActiveSesh
            key={i}
            sesh={sesh}
            resumeSesh={resumeSesh}
            stopSesh={stopSesh}
            unstopSesh={unstopSesh}
          />
        ))
      }
    </div>
  );
};

export default ActiveSeshes;
