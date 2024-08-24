import type {} from '@redux-devtools/extension'
import type { StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'

import { createCounterSlice } from './slices/counter-slice'
import type { AppStore } from './types'

const x: StateCreator<
  AppStore,
  [],
  [
    ['zustand/devtools', never],
    ['zustand/persist', unknown],
    ['zustand/immer', never],
  ]
> = devtools(
  persist(
    immer((...a) => ({
      ...createCounterSlice(...a),
    })),
    {
      name: 'counter-storage',
    },
  ),
)

export const createAppStore = () => createStore<AppStore>()(x)
