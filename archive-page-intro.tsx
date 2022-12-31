import classNames from "classnames";
import { useRouter } from "next/router";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import Layout from "./components/Layout";
import Logo from "./components/Logo";

const AppChatAvatarSvg = ({ size=22, className }: { size?: number; className: string; }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.49996 14L10 20L0 22L4.49996 14Z" fill="black"/>
    <circle cx="11" cy="11" r="11" fill="black"/>
    <g clipPath="url(#clip0_46_1596)">
    <path d="M9.83324 14.5333H8.43884L8.03564 10.4677H8.01044L6.03644 14.5333H4.65044L4.12964 8.58614H5.60804L5.78444 12.5845H5.80964L7.65764 8.58614H9.10244L9.42164 12.5845H9.44684L11.2192 8.58614H12.6892L9.83324 14.5333Z" fill="#1ED868"/>
    <path d="M16.6009 10.0309C16.4889 9.87973 16.3489 9.76493 16.1809 9.68653C16.0129 9.60813 15.8253 9.56893 15.6181 9.56893C15.5229 9.56893 15.4221 9.58293 15.3157 9.61093C15.2093 9.63333 15.1113 9.67533 15.0217 9.73693C14.9377 9.79293 14.8649 9.86573 14.8033 9.95533C14.7473 10.0449 14.7193 10.1541 14.7193 10.2829C14.7193 10.4509 14.7837 10.5853 14.9125 10.6861C15.0469 10.7813 15.2317 10.8709 15.4669 10.9549C15.7245 11.0445 15.9541 11.1453 16.1557 11.2573C16.3573 11.3637 16.5281 11.4869 16.6681 11.6269C16.8081 11.7669 16.9145 11.9265 16.9873 12.1057C17.0601 12.2793 17.0965 12.4781 17.0965 12.7021C17.0965 13.0605 17.0209 13.3657 16.8697 13.6177C16.7241 13.8697 16.5337 14.0769 16.2985 14.2393C16.0633 14.3961 15.8001 14.5109 15.5089 14.5837C15.2177 14.6565 14.9293 14.6929 14.6437 14.6929C14.4309 14.6929 14.2181 14.6733 14.0053 14.6341C13.7925 14.5949 13.5881 14.5389 13.3921 14.4661C13.1961 14.3877 13.0141 14.2897 12.8461 14.1721C12.6781 14.0545 12.5353 13.9201 12.4177 13.7689L13.4509 12.9289C13.5685 13.1081 13.7421 13.2537 13.9717 13.3657C14.2013 13.4777 14.4337 13.5337 14.6689 13.5337C14.7921 13.5337 14.9097 13.5225 15.0217 13.5001C15.1393 13.4721 15.2429 13.4301 15.3325 13.3741C15.4221 13.3125 15.4921 13.2369 15.5425 13.1473C15.5985 13.0521 15.6265 12.9401 15.6265 12.8113C15.6265 12.6041 15.5425 12.4417 15.3745 12.3241C15.2065 12.2009 14.9825 12.0917 14.7025 11.9965C14.5065 11.9293 14.3217 11.8537 14.1481 11.7697C13.9801 11.6857 13.8317 11.5821 13.7029 11.4589C13.5797 11.3357 13.4789 11.1901 13.4005 11.0221C13.3277 10.8485 13.2913 10.6413 13.2913 10.4005C13.2913 10.0981 13.3529 9.82653 13.4761 9.58573C13.6049 9.33933 13.7785 9.13213 13.9969 8.96413C14.2153 8.79053 14.4701 8.65893 14.7613 8.56933C15.0525 8.47413 15.3633 8.42653 15.6937 8.42653C15.8673 8.42653 16.0437 8.44333 16.2229 8.47693C16.4021 8.51053 16.5729 8.56093 16.7353 8.62813C16.9033 8.68973 17.0573 8.76813 17.1973 8.86333C17.3373 8.95853 17.4549 9.06773 17.5501 9.19093L16.6009 10.0309Z" fill="#F5BCDB"/>
    </g>
    <defs>
    <clipPath id="clip0_46_1596">
    <rect width="14" height="7" fill="white" transform="translate(4 8)"/>
    </clipPath>
    </defs>
  </svg>
)

const chatSets = [
  [
    {
      className: 'text-5xl',
      text: '👋',
      chatAvatarTop: -5,
    },
    {
      className: 'font-semibold',
      text: 'Welcome to Workout Sesh!'
    },
    'Let\'s start tracking your workout sessions!'
  ],
  [
    'To track your workout, design a workout first.',
    'Create workouts like “Leg Day” or "Upper Body Day".',
    'Add exercises to them like "Squats" or "Mountain Climbers".',
  ],
  [
    'Next time you start a workout, we’ll start timing your sets and help you navigate between sets and different exercises.',
    'Competing sets will be like playing songs on a playlist.',
    'You just go from one set to the next.'
  ],
  [
    'At the end of every workout, you\'ll get a summary of your your times and notes.',
    'You can look back at what you did the next time you do the same exercises.',
    {
      text: 'That\'s all there is to it. Let’s get started!',
      isLastLine: true
    },
  ]
]

type ChatLine = string | {className?: string; isLastLine?: boolean; text: string; chatAvatarTop?: number;}

const CHAT_LINE_MY_HEIGHT = 32
const ChatLine = ({ line, lineIndex, delayMs, onNext, isOfLastSet, showChatAvatarUntilNextPress, hideChatAvatarAfterDelayMs, setLineHeight }: {
  line: ChatLine;
  delayMs: number;
  onNext?: () => void;
  isOfLastSet: boolean;
  showChatAvatarUntilNextPress: boolean;
  hideChatAvatarAfterDelayMs: number;
  lineIndex: number;
  setLineHeight: (val: number, index: number) => void;
}) => {
  const ref = useRef(null) as any
  const nextBtnRef = useRef(null) as any
  const [shown, setShown] = useState(delayMs ? false : true)
  const [showChatAvatar, setShowChatAvatar] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setShown(true)
      if (ref && ref.current) {
        setLineHeight(ref.current.clientHeight, lineIndex)
      }
      const nextElScrollee = document.getElementById('next-btn-scrollee')
      if (nextElScrollee) nextElScrollee.scrollIntoView()
    }, delayMs)
    setTimeout(() => {
      if (!showChatAvatarUntilNextPress) {
        setShowChatAvatar(false)
      }
    }, delayMs + hideChatAvatarAfterDelayMs)
  }, [])
  return (<li className={classNames(
    "relative px-3 my-4 auto-fade",
    {
      "opacity-0 h-0 group": !shown && isOfLastSet,
      "opacity-100 h-auto": shown && isOfLastSet,
      "opacity-30": !isOfLastSet,
    }
  )}>
    {
      showChatAvatar &&
      <div className={classNames(
        "absolute",
        isOfLastSet 
      )}>
        <AppChatAvatarSvg
          size={30}
          className={classNames(
            "relative -left-[40px] z-50",
            typeof line === 'object' && line.chatAvatarTop ?
            (line.chatAvatarTop < 0 ? '-' : '') + 'top-[' + line.chatAvatarTop + 'px]'
            :
            '-top-[7px]'
          )}
        />
      </div>
    }
    {
      typeof line === 'string' ?
      <div ref={ref}>{line}</div> :
      <div ref={ref} className={line.className}>{line.text}</div>
    }
    {
      onNext &&
      <div className="mt-6">
        <button
          onClick={() => {
            setShowChatAvatar(false)
            onNext()
          }}
          className="font-semibold text-base rounded-lg py-3 px-5 bg-brightGreen hover:bg-brightGreen1">
          {
            typeof line === 'object' &&
            line.isLastLine ?
            'Get Started' : 'Next'
          }
        </button>
        <div className="h-[30px]" />
        <div id="next-btn-scrollee" />
      </div>
    }
  </li>)
}

const ChatLines = ({ lines, delayMs=2000, isLastSet, onNext }: { lines: ChatLine[]; delayMs?: number; isLastSet: boolean; onNext: () => void; }) => {
  const elRef = useRef(null)
  const [lineHeights, setLineHeights] = useState<Array<number> | any>([...lines.map((x: any) => 0)])
  const setLineHeight = (val: number, lineIndex: number) => {
    setLineHeights((prevHeights: number[]) => {
      const prev = [...prevHeights]
      prev.splice(lineIndex, 1, val)
      return prev
    })
  }
  return (
    <>
      <div ref={elRef} className="mb-14 last:mb-0">
        {lines.map((line: ChatLine, i: number) => {
          const isLastLineOfSet = i === lines.length - 1
          return (
            <ChatLine
              key={i}
              isOfLastSet={isLastSet}
              showChatAvatarUntilNextPress={isLastSet && isLastLineOfSet}
              hideChatAvatarAfterDelayMs={delayMs}
              onNext={(isLastSet && isLastLineOfSet) ? onNext : undefined}
              line={line}
              delayMs={delayMs * i}
              lineIndex={i}
              setLineHeight={setLineHeight}
            />
          )
      })}
      </div>
    </>
  )
}

export default function Intro() {
  const router = useRouter()
  const [endChatIdx, setEndChatIdx] = useState(1)
  const onNextChats = () => {
    const newEndChatIdx = Math.min(endChatIdx + 1, chatSets.length)
    if (newEndChatIdx === endChatIdx) {
      // navigate to home
      router.push('/amyhua')
    } else {
      setEndChatIdx(newEndChatIdx)
    }
  }
  return (
    <Layout title="Workout Sesh" background="#ffffff">
      <div className="absolute top-0 right-0 left-0 bottom-0 h-full overflow-y-auto">
        <nav className="z-50 fixed z-100 top-0 left-0 right-0 bg-white h-[90px]">
          <Logo size={180} className="my-0" />
        </nav>
        <div
          className="absolute left-0 right-0 top-[90px] bg-gradient-to-b from-white to-white0 h-[120px] z-50"
        />
        <main className="px-3 pb-3 absolute top-[0] left-0 right-0 bottom-0 overflow-auto">
          <ul className="max-w-md mx-auto pr-3 pl-11 pt-[220px]">
            {
              chatSets
                .slice(0, endChatIdx)
                .map((chats: ChatLine[], i: number) => (
                  <ChatLines
                    key={i}
                    lines={chats}
                    isLastSet={i === endChatIdx - 1}
                    onNext={onNextChats} />
                ))
            }
          </ul>
        </main>
      </div>
    </Layout>   
  )
}
