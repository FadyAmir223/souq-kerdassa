import type {} from '@redux-devtools/extension'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'

import { createCartSlice } from './slices/cart-slice'
import type { AppStore } from './types'

export const createAppStore = () =>
  createStore<AppStore>()(
    devtools(
      persist(
        immer((...a) => ({
          ...createCartSlice(...a),
        })),
        {
          name: 'cart',
          skipHydration: true,
        },
      ),
    ),
  )