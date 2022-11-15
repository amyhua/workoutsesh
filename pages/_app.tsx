import '../styles/globals.css'
import '../fonts/fonts.css'
import type { AppProps } from 'next/app'
import React, { useState } from 'react'
import AuthContext from '../contexts/auth-context'

export default function App({ Component, pageProps }: AppProps) {
  const [authToken, setAuthToken] = useState<string>('')
  const setAuthTokenFn = (token: string) => setAuthToken(token)
  const authState = {
    token: authToken,
    authorized: false,
    setAuthToken: setAuthTokenFn,
  }
  return <AuthContext.Provider value={authState}>
    <Component {...pageProps} />
  </AuthContext.Provider>
}
