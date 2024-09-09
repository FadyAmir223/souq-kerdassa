import type { StateCreator } from 'zustand'

import type { CartSlice } from './cart-slice'

type ReviewState = {
  isReviewing: boolean
}

type ReviewActions = {
  setReviewing: (isReviewing: ReviewState['isReviewing']) => void
}

export type ReviewSlice = ReviewState & ReviewActions

const initialState: ReviewState = {
  isReviewing: false,
}

export const createReviewSlice: StateCreator<
  CartSlice & ReviewSlice,
  [['zustand/immer', never]],
  [],
  ReviewSlice
> = (set) => ({
  ...initialState,

  setReviewing: (isReviewing) => set({ isReviewing }),
})
