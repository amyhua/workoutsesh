import classnames from 'classnames'
import Image from 'next/image'
import Clamped from './Clamped';

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
}: {
  exercise: any;
  isFirst?: boolean;
  isLast?: boolean;
  isDragging?: boolean;
}) => {
  return (
    <div className={classnames(
      "flex bg-white border-b-gray-300",
      isDragging ?
        "border-t border-b" :
        isLast ? "border-none" : "border-b"
    )}>
      <div className="mr-1 mt-2">
        <div className={classnames(
          "mx-3 relative rounded-sm w-[75px] h-[75px] text-center bg-gray-500 overflow-hidden",
          "text-black z-100",
          isFirst ? "mb-5 mt-2" : "my-5",
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
      <div className="flex-1 flex justify-center flex-col">
        <h2 className={classnames(
          "font-bold text-base mb-0.5",
          isDragging ? "text-navy0" : "text-black"
        )}>
          <Clamped clamp={2}>
            {exercise.name}
          </Clamped>
        </h2>
        <div className={classnames(
          "text-base",
          "text-gray-500"
        )}>
          <Clamped clamp={1}>
            {exercise.description}
          </Clamped>
        </div>
      </div>
      {
        (isFirst && isLast) ?
        null :
        <div className="leading-[90px] px-4 cursor-pointer">
          <ReorderIconSvg
            color={isDragging ? '#2454e0' : '#C2C2C2'}
          />
        </div>
      }
    </div>
  )
}
export default WorkoutRoutine
