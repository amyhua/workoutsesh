import { Exercise } from '@prisma/client';
import classnames from 'classnames'
import moment from 'moment';
import Image from 'next/image'
import Clamped from './Clamped';
import DurationText from './DurationText';
import ExerciseDescription from './ExerciseDescription';

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
  expanded,
}: {
  exercise: Exercise;
  isFirst?: boolean;
  isLast?: boolean;
  isDragging?: boolean;
  expanded: boolean;
}) => {
  return (
    <div className={classnames(
      "flex border-b-gray-300",
      isDragging ?
        "border-t border-b" :
        isLast ? "border-none" : "border-b",
        "bg-white",
      {
        "relative -left-[160px]": isDragging,
      }
    )}>
      <div className="m-0">
        <div className={classnames(
          "relative w-[111px] min-h-[111px] text-center bg-white overflow-hidden",
          "text-black z-100 border-r",
          isDragging ? "text-navy0": "text-black"
        )}>
          {
            exercise.imageUrl ?
            <Image
              src={exercise.imageUrl}
              alt="Exercise Image"
              priority
              fill
              placeholder={require('./heart-pulse.png')}
              className="inline-block h-[75px]"
            />
            :
            <div className="inline-block w-[75px] h-[75px] bg-white" />
          }
        </div>
      </div>
      <div className="ml-2 flex-1 flex justify-center flex-col">
        <h2 className={classnames(
          "font-semibold text-base mb-0.5",
          isDragging ? "text-green-500" : "text-black"
        )}>
          <Clamped clamp={2}>
            {exercise.name}
          </Clamped>
        </h2>
        <div className="text-black/70 text-sm">
          {
            exercise.isRest ?
            <DurationText durationM={moment.duration(exercise.timeLimitS, 'seconds')} />
            :
            <ExerciseDescription 
              setsDescription={exercise.setsDescription}
              repsDescription={exercise.repsDescription}
            />
          }
        </div>
      </div>
      {
        (isFirst && isLast) ?
        null :
        <div className="leading-[110px] px-2 cursor-pointer">
          <ReorderIconSvg
            color={isDragging ? '#000000' : '#C2C2C2'}
          />
        </div>
      }
    </div>
  )
}
export default WorkoutRoutine
