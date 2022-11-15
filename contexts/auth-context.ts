import { createContext } from "react"

export interface AuthContextState {
  token: string | undefined,
  authorized: boolean,
  setAuthToken: (token: string) => void
}

const initialState = {
  token: undefined,
  authorized: false,
  setAuthToken: (token: string) => {},
}

const AuthContext = createContext(initialState as AuthContextState)

export default AuthContext
