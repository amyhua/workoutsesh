import classnames from 'classnames'
import Image from 'next/image'

const ReorderIconSvg = ({ color }: { color: string; }) => (
  <svg className="inline-block" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.91406 17.8125H23.0859M6.91406 12.1875H23.0859" stroke={color} strokeWidth="2.57812" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


const WorkoutRoutine = ({
  routine,
  isFirst,
  isDragging,
}: {
  routine: any;
  isFirst?: boolean;
  isDragging?: boolean;
}) => {
  return (
    <div className={classnames(
      "flex bg-white border-b-gray-300",
      isDragging ? "border-t border-b" : "border-b"
    )}>
      <div className="mr-1">
        <div className={classnames(
          "mx-3 relative rounded-md w-[75px] h-[75px] border border-black text-center bg-gray-500 overflow-hidden",
          isFirst ? "mb-5 mt-2" : "my-5",
          isDragging ? "text-teal": "text-black"
        )}>
          <Image
            src={routine.image_url}
            alt="Routine Image"
            priority
            fill
            placeholder={require('./heart-pulse.png')}
            className="inline-block"
          />
        </div>
      </div>
      <div className="flex-1 flex justify-center flex-col">
        <h2 className={classnames(
          "font-bold text-base mb-0.5",
          isDragging ? "text-teal" : "text-black"
        )}>{routine.name}</h2>
        <p className={classnames(
          "text-base",
          "text-gray-500"
        )}>{routine.description}</p>
      </div>
      <div className="leading-[90px] px-4 cursor-pointer">
        <ReorderIconSvg
          color={isDragging ? '#1DBE5D' : '#C2C2C2'}
        />
      </div>
    </div>
  )
}
export default WorkoutRoutine
