import React, { useEffect, useRef } from 'react';
import $clamp from '../libs/clamp'

const Clamped = ({ children, clamp }: { children: any; clamp: number; }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (ref && ref.current) {
      // Client-side-only code
      $clamp(window, ref.current, { clamp })
    }
  })
  return (
    <div ref={ref}>{children}</div>
  )
}

export default Clamped
