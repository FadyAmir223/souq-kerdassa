import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createCounterSlice } from './slices/counter-slice'
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
      ...createCounterSlice(...a),
    })),
    {
      name: 'counter-storage',
      storage: createJSONStorage(() => mobileStorage),
    },
  ),
)
