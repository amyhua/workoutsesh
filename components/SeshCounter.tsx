import { useEffect, useState } from "react";
import classnames from "classnames"

const toSeconds = (secondsTotal: number) => secondsTotal % 60;
const toMinutes = (secondsTotal: number) => Math.floor(secondsTotal / 60) % 60;
const toHours = (secondsTotal: number) => Math.floor((Math.floor(secondsTotal / 60)) / 60);

export default function SeshCounter({
  active,
  seshStarted,
  className,
  secondsTotal,
  setSecondsTotal,
  children,
}: {
  active: boolean;
  isActiveSet?: boolean;
  seshStarted?: boolean;
  className?: string;
  secondsTotal: number;
  setSecondsTotal: (val: any) => void;
  children?: any;
}) {
  const seconds = toSeconds(secondsTotal);
  const minutes = toMinutes(secondsTotal);
  const hours = toHours(secondsTotal)
  let timerInterval: any;
  useEffect(() => {
    if (active) {
      // begin counter
      if (timerInterval) clearInterval(timerInterval)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timerInterval = setInterval(() => {
        setSecondsTotal((oldTotal: number) => oldTotal + 1);
      }, 1000)
    } else {
      if (timerInterval) clearInterval(timerInterval)
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [active])
  return (
    <div className={classnames(
      className,
      "text-white font-roboto",
      {
        "text-white": seshStarted !== undefined && seshStarted,
        "text-black": seshStarted !== undefined && !seshStarted,
      }
    )}>
      <span className={classnames({
        "opacity-50": !active,
      })}>
        {
          hours ? (
            (hours <= 9 ? '0' + hours : hours)
            + ':'
          )
          : null
        }
        {minutes <= 9 ? '0' + minutes : minutes}:{seconds <= 9 ? '0' + seconds : seconds}
      </span>
      {children}
    </div>
  )
}
