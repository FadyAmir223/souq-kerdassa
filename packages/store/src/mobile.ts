import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createCartSlice } from './slices/cart-slice'
import { createReviewSlice } from './slices/review-slice'
import type { AppStore } from './types'

export const mobileStorage = {
  setItem: async (key: string, value: string) =>
    await AsyncStorage.setItem(key, value),
  getItem: async (key: string) => await AsyncStorage.getItem(key),
  removeItem: async (key: string) => await AsyncStorage.removeItem(key),
}

export const useCombinedStore = create<AppStore>()(
  persist(
    immer((...a) => ({
      ...createCartSlice(...a),
      ...createReviewSlice(...a),
    })),
    {
      name: 'store',
      storage: createJSONStorage(() => mobileStorage),
      partialize: (s) => ({ cart: s.cart }),
    },
  ),
)
