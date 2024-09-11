import type { Address, City, CityCategoryPrice } from '@repo/db/types'
import type { StateCreator } from 'zustand'

import type { CartSlice } from './cart-slice'

type UnpersistedState = {
  isReviewing: boolean
  selectedAddress:
    | {
        id: Address['id']
        cityId: City['id']
        region: Address['region']
        street: Address['street']
        building: Address['building']
        mark: Address['mark']
        price: CityCategoryPrice['price']
      }
    | null
    | undefined
}

type UnpersistedActions = {
  setReviewing: (isReviewing: UnpersistedState['isReviewing']) => void
  setSelectedAddress: (selectedAddress: UnpersistedState['selectedAddress']) => void
}

export type UnpersistedSlice = UnpersistedState & UnpersistedActions

const initialState: UnpersistedState = {
  isReviewing: false,
  selectedAddress: null,
}

export const createUnpersistedSlice: StateCreator<
  CartSlice & UnpersistedSlice,
  [['zustand/immer', never]],
  [],
  UnpersistedSlice
> = (set) => ({
  ...initialState,

  setReviewing: (isReviewing) => set({ isReviewing }),

  setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
})
