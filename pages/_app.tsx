import '../styles/globals.css'
import '../fonts/fonts.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}