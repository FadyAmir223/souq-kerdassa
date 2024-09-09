import type { CartSlice } from './slices/cart-slice'
import type { ReviewSlice } from './slices/review-slice'

export type AppStore = CartSlice & ReviewSlice

export type { CartItem } from './slices/cart-slice'
