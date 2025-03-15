import type { Product, ProductVariant } from '@repo/db/types'
import type { StateCreator } from 'zustand'

import type { UnpersistedSlice } from './unpersisted-slice'

export type CartItem = {
  id: Product['id']
  name: Product['name']
  image: Product['images'][number]
  size: Product['sizes'][number]
  color: Product['colors'][number]
  season: Product['seasons'][number]
  variantId: ProductVariant['id']
  price: ProductVariant['price']
  discount?: ProductVariant['discount']
  category: ProductVariant['category']
  quantity: number
}

type CartState = {
  cart: CartItem[]
}

type ItemArgs = {
  itemVariantId: ProductVariant['id']
  itemSize: Product['sizes'][number]
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
    get().cart.reduce(
      (acc, { quantity, price, discount }) => acc + (discount ?? price) * quantity,
      0,
    ),

  getCartTotalQuantity: () =>
    get().cart.reduce((acc, { quantity }) => acc + quantity, 0),
})
