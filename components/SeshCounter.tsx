import { useEffect, useState } from "react";

const toSeconds = (secondsTotal: number) => secondsTotal % 60;
const toMinutes = (secondsTotal: number) => Math.floor(secondsTotal / 60);

export default function SeshCounter({
  active
}: {
  active: boolean;
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
    <div className="text-black py-5 font-bold tracking-widest text-5xl text-center">
      {minutes.toFixed(0)}:{seconds <= 9 ? '0' + seconds : seconds}
    </div>
  )
}
