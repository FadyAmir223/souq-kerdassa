import type {
  Address,
  City,
  CityCategoryPrice,
  ProductVariant,
} from '@repo/db/types'
import type { StateCreator } from 'zustand'

import type { CartSlice } from './cart-slice'

type UnpersistedState = {
  isReviewing: boolean
  selectedVariant: {
    price: ProductVariant['price']
    discount: ProductVariant['discount']
  } | null
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
  isSidebarOpen: boolean
}

type UnpersistedActions = {
  setReviewing: (isReviewing: UnpersistedState['isReviewing']) => void
  setSelectedVariant: (selectedVariant: UnpersistedState['selectedVariant']) => void
  setSelectedAddress: (selectedAddress: UnpersistedState['selectedAddress']) => void
  toggleSidebar: () => void
}

export type UnpersistedSlice = UnpersistedState & UnpersistedActions

const initialState: UnpersistedState = {
  isReviewing: false,
  selectedVariant: null,
  selectedAddress: null,
  isSidebarOpen: false,
}

export const createUnpersistedSlice: StateCreator<
  CartSlice & UnpersistedSlice,
  [['zustand/immer', never]],
  [],
  UnpersistedSlice
> = (set) => ({
  ...initialState,

  setReviewing: (isReviewing) => set({ isReviewing }),

  setSelectedVariant: (selectedVariant) => set({ selectedVariant }),

  setSelectedAddress: (selectedAddress) => set({ selectedAddress }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
})
