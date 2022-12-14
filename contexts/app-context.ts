import { createContext } from "react"

export interface AppContextState {
  indexError?: string;
  indexSuccess?: string;
  setIndexError: (val: string) => any;
  setIndexSuccess: (val: string) => any;
}

const initialState = {
  indexError: undefined,
  setIndexError: (val: string) => {},
}

const AppContext = createContext(initialState as AppContextState)

export default AppContext;
