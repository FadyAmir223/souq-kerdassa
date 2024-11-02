import type { StateCreator } from 'zustand'

import type { CartSlice } from './cart-slice'
import type { UnpersistedSlice } from './unpersisted-slice'

type SessionState = {
  token?: string | null
}

type SessionActions = {
  setToken?: (token: string) => void
  deleteToken?: () => void
}

export type SessionSlice = SessionState & SessionActions

const initialState: SessionState = {
  token: null,
}

export const createSessionSlice: StateCreator<
  SessionSlice & CartSlice & UnpersistedSlice,
  [['zustand/immer', never]],
  [],
  SessionSlice
> = (set) => ({
  ...initialState,
  setToken: (token) => set({ token }),
  deleteToken: () => set(initialState),
})
