import '../styles/globals.css'
import '../fonts/fonts.css'
import type { AppProps } from 'next/app'
import React, { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import AppContext from '../contexts/app-context';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [indexError, setIndexError] = useState('');
  const [indexSuccess, setIndexSuccess] = useState('');
  const appContext = {
    setIndexError,
    indexError,
    indexSuccess,
    setIndexSuccess,
  }
  return (
    <SessionProvider session={session}>
      <AppContext.Provider value={appContext}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </SessionProvider>
  )
}