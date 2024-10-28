import type { Product, ProductVariant } from '@repo/db/types'
import type { StateCreator } from 'zustand'

import type { UnpersistedSlice } from './unpersisted-slice'

export type CartItem = {
  id: Product['id']
  name: Product['name']
  image: Product['images'][number]
  price: Product['price']
  variantId: ProductVariant['id']
  season: ProductVariant['season']
  category: ProductVariant['category']
  quantity: number
  overQuantity?: number
}

type CartState = {
  cart: CartItem[]
  isLoggedIn: boolean
}

type CartActions = {
  resetCart: () => void
  addCartItem: (item: Omit<CartItem, 'quantity'>) => void
  incrementCartItem: (variantId: ProductVariant['id']) => void
  decrementCartItem: (variantId: ProductVariant['id']) => void
  deleteCartItem: (variantId: ProductVariant['id']) => void
  getCartTotalPrice: () => CartItem['price']
  getCartTotalQuantity: () => number
  updateOverQuantities: (
    overQuantities: {
      variantId: ProductVariant['id']
      remaining: CartItem['quantity']
    }[],
  ) => void
  resetOverQuantities: () => void
  toggleLoggedIn: () => void
}

export type CartSlice = CartState & CartActions

const initialState: CartState = {
  cart: [],
  isLoggedIn: false,
}

export const createCartSlice: StateCreator<
  CartSlice & UnpersistedSlice,
  [['zustand/immer', never]],
  [],
  CartSlice
> = (set, get) => ({
  ...initialState,

  resetCart: () => set(initialState),

  addCartItem: (item) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId }) => variantId === item.variantId,
    )

    set(({ cart }) => {
      if (itemIndex !== -1) cart[itemIndex]!.quantity += 1
      else cart.push({ ...item, quantity: 1 })
    })
  },

  incrementCartItem: (itemVariantId) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId }) => variantId === itemVariantId,
    )

    set(({ cart }) => {
      if (itemIndex === -1) return
      cart[itemIndex]!.quantity += 1
    })
  },

  decrementCartItem: (itemVariantId) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId }) => variantId === itemVariantId,
    )

    set(({ cart }) => {
      if (itemIndex === -1) return
      if (cart[itemIndex]!.quantity > 1) cart[itemIndex]!.quantity -= 1
      else cart.splice(itemIndex, 1)
    })
  },

  deleteCartItem: (itemVariantId) =>
    set((state) => {
      state.cart = state.cart.filter(({ variantId }) => variantId !== itemVariantId)
    }),

  getCartTotalPrice: () =>
    get().cart.reduce((acc, { quantity, price }) => acc + price * quantity, 0),

  getCartTotalQuantity: () =>
    get().cart.reduce((acc, { quantity }) => acc + quantity, 0),

  updateOverQuantities: (overQuantities) => {
    set(({ cart }) => {
      overQuantities.forEach(({ variantId, remaining }) => {
        const itemIndex = cart.findIndex((item) => item.variantId === variantId)
        if (itemIndex === -1) return

        const itemExists = cart[itemIndex]!
        itemExists.overQuantity = itemExists.quantity
        itemExists.quantity = remaining
      })
    })
  },

  resetOverQuantities: () =>
    set((state) => {
      state.cart = state.cart.map((item) =>
        item.overQuantity ? { ...item, overQuantity: undefined } : item,
      )
    }),

  toggleLoggedIn: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
})
