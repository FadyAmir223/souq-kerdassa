import type { StateCreator } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = {
  increment: (by: number) => void
}

export type CounterSlice = CounterState & CounterActions

const initState: CounterState = {
  count: 0,
}

export const createCounterSlice: StateCreator<CounterSlice, [], [], CounterSlice> = (
  set,
) => ({
  ...initState,
  increment: (by) => set((state) => ({ count: state.count + by })),
})
