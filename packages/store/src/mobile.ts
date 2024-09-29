import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createCartSlice } from './slices/cart-slice'
import { createUnpersistedSlice } from './slices/unpersisted-slice'
import type { AppStore } from './types'

export const mobileStorage = {
  setItem: async (key: string, value: string) =>
    await SecureStore.setItemAsync(key, value),
  getItem: async (key: string) => await SecureStore.getItemAsync(key),
  removeItem: async (key: string) => await SecureStore.deleteItemAsync(key),
}

export const useCombinedStore = create<AppStore>()(
  persist(
    immer((...a) => ({
      ...createCartSlice(...a),
      ...createUnpersistedSlice(...a),
    })),
    {
      name: 'store',
      storage: createJSONStorage(() => mobileStorage),
      partialize: (s) => ({ cart: s.cart }),
    },
  ),
)
