import { Bars2Icon } from '@heroicons/react/20/solid';
import { Exercise } from '@prisma/client';
import classnames from 'classnames'
import moment from 'moment';
import Image from 'next/image'
import { useState } from 'react';
import Clamped from './Clamped';
import DurationText from './DurationText';
import ExerciseDescription from './ExerciseDescription';
import RestTile from './RestTile';

const ReorderIconSvg = ({ color }: { color: string; }) => (
  <svg className="inline-block" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.91406 17.8125H23.0859M6.91406 12.1875H23.0859" stroke={color} strokeWidth="2.57812" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


const WorkoutRoutine = ({
  exercise,
  isFirst,
  isLast,
  isDragging,
  counter,
  isDraggingClassName,
}: {
  exercise: Exercise;
  isFirst?: boolean;
  isLast?: boolean;
  isDragging?: boolean;
  counter: number;
  isDraggingClassName: string;
}) => {
  const [isImageError, setIsImageError] = useState(false);
  return (
    <div className={classnames(
      "flex text-white border-white/20 py-4",
      isDragging ?
        "border-t border-b" :
        isLast ? "border-none" : "border-b",
        "bg-transparent",
      {
        "relative -left-[80px]": isDragging,
        [isDraggingClassName]: isDragging,
      }
    )}>
      {
        (isFirst && isLast) ?
        null :
        <div className="ml-1 px-1 cursor-pointer flex flex-col justify-center">
          <Bars2Icon className="text-white/50 h-4 rounded-full" />
        </div>
      }
      <div className="flex items-center ml-3 mr-4">
        {counter}.
      </div>
      <div className={classnames(
        "relative w-[50px] h-[50px] text-center bg-transparent overflow-hidden",
        "text-black z-100",
        isDragging ? "text-navy0": "text-black"
      )}>
        {
          exercise.isRest ?
          <RestTile className="h-[50px] w-[50px]" />
          :
          (exercise.imageUrl && !isImageError) ?
          <Image
            src={exercise.imageUrl}
            alt="Exercise"
            priority
            fill
            placeholder={require('./heart-pulse.png')}
            className="inline-block h-[50px]"
            onError={() => setIsImageError(true)}
          />
          :
          (exercise.imageUrl && String(exercise.imageUrl).match(/\.(mp4)$/)) ?
          <video
            autoPlay={false}
            muted
            src={exercise.imageUrl}
          />
          :
          <div className="inline-block bg-white/30 w-[50px] h-[50px]" />
        }
      </div>
      <div className="flex-1 flex justify-center flex-col h-[50px]">
        <div className="ml-4">
          <h2 className={classnames(
            "font-normal text-base text-white",
            { 
              "font-bold": isDragging,
            },
          )}>
            <Clamped clamp={2}>
              {exercise.name}
            </Clamped>
          </h2>
          <div className="text-white/70 text-sm">
            {
              exercise.isRest ?
              exercise.timeLimitS ?
                <DurationText durationM={moment.duration(exercise.timeLimitS, 'seconds')} />
                :
                'Until Ready'
              :
              <ExerciseDescription 
                setsDescription={exercise.setsDescription}
                repsDescription={exercise.repsDescription}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default WorkoutRoutine
