import { useEffect, useState } from "react";
import classnames from "classnames"

const toSeconds = (secondsTotal: number) => secondsTotal % 60;
const toMinutes = (secondsTotal: number) => Math.floor(secondsTotal / 60);

export default function SeshCounter({
  active,
  isActiveSet,
  seshStarted,
}: {
  active: boolean;
  isActiveSet: boolean;
  seshStarted: boolean;
}) {
  const [secondsTotal, setSecondsTotal] = useState(0);
  const seconds = toSeconds(secondsTotal);
  const minutes = toMinutes(secondsTotal);
  let timerInterval: any;
  useEffect(() => {
    if (active) {
      // begin counter
      if (timerInterval) clearInterval(timerInterval)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timerInterval = setInterval(() => {
        setSecondsTotal((oldTotal: number) => oldTotal + 1);
      }, 1000)
    }
  }, [active])
  return (
    <div className={classnames(
      "pt-3 pb-5 font-bold tracking-widest text-6xl text-center",
      {
        "text-pink": seshStarted && !isActiveSet,
        "text-white": seshStarted && isActiveSet,
        "text-black": seshStarted
      }
    )}>
      {minutes.toFixed(0)}:{seconds <= 9 ? '0' + seconds : seconds}
    </div>
  )
}
