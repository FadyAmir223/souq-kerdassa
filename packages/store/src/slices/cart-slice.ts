import type { Product, ProductVariant, Size } from '@repo/db/types'
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
  size: Size
  color: string
  quantity: number
  overQuantity?: number
}

type CartState = {
  cart: CartItem[]
}

type ItemArgs = {
  itemVariantId: ProductVariant['id']
  itemSize: Size
  itemColor: string
}

type CartActions = {
  resetCart: () => void
  addCartItem: (item: Omit<CartItem, 'quantity'>) => void
  incrementCartItem: ({ itemVariantId, itemSize, itemColor }: ItemArgs) => void
  decrementCartItem: ({ itemVariantId, itemSize, itemColor }: ItemArgs) => void
  deleteCartItem: ({ itemVariantId, itemSize, itemColor }: ItemArgs) => void
  getCartTotalPrice: () => CartItem['price']
  getCartTotalQuantity: () => number
  updateOverQuantities: (
    overQuantities: {
      variantId: ProductVariant['id']
      remaining: CartItem['quantity']
    }[],
  ) => void
  resetOverQuantities: () => void
}

export type CartSlice = CartState & CartActions

const initialState: CartState = {
  cart: [],
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
      ({ variantId, size, color }) =>
        variantId === item.variantId && size === item.size && color === item.color,
    )

    set(({ cart }) => {
      if (itemIndex !== -1) cart[itemIndex]!.quantity += 1
      else cart.push({ ...item, quantity: 1 })
    })
  },

  incrementCartItem: ({ itemVariantId, itemSize, itemColor }) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId, size, color }) =>
        variantId === itemVariantId && size === itemSize && color === itemColor,
    )

    set(({ cart }) => {
      if (itemIndex === -1) return
      cart[itemIndex]!.quantity += 1
    })
  },

  decrementCartItem: ({ itemVariantId, itemSize, itemColor }) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId, size, color }) =>
        variantId === itemVariantId && size === itemSize && color === itemColor,
    )

    set(({ cart }) => {
      if (itemIndex === -1) return
      if (cart[itemIndex]!.quantity > 1) cart[itemIndex]!.quantity -= 1
      else cart.splice(itemIndex, 1)
    })
  },

  deleteCartItem: ({ itemVariantId, itemSize, itemColor }) =>
    set((state) => {
      state.cart = state.cart.filter(
        ({ variantId, size, color }) =>
          !(variantId === itemVariantId && size === itemSize && color === itemColor),
      )
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
})
