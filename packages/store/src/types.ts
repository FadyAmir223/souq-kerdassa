import type { CartSlice } from './slices/cart-slice'
import type { UnpersistedSlice } from './slices/unpersisted-slice'

export type AppStore = CartSlice & UnpersistedSlice

export type { CartItem } from './slices/cart-slice'
