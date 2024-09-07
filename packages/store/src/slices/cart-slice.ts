import type { Product, ProductVariant } from '@repo/db/types'
import type { StateCreator } from 'zustand'

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
}

export type CartSlice = CartState & CartActions

const initialState: CartState = {
  cart: [],
}

export const createCartSlice: StateCreator<
  CartSlice,
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

    set((state) => {
      if (itemIndex !== -1) state.cart[itemIndex]!.quantity += 1
      else state.cart.push({ ...item, quantity: 1 })
    })
  },

  incrementCartItem: (itemVariantId) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId }) => variantId === itemVariantId,
    )

    set((state) => {
      if (itemIndex === -1) return
      state.cart[itemIndex]!.quantity += 1
    })
  },

  decrementCartItem: (itemVariantId) => {
    const itemIndex = get().cart.findIndex(
      ({ variantId }) => variantId === itemVariantId,
    )

    set((state) => {
      if (itemIndex === -1) return
      if (state.cart[itemIndex]!.quantity > 1) state.cart[itemIndex]!.quantity -= 1
      else state.cart.splice(itemIndex, 1)
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
    set((state) => {
      overQuantities.forEach(({ variantId, remaining }) => {
        const itemIndex = state.cart.findIndex(
          (item) => item.variantId === variantId,
        )
        if (itemIndex === -1) return

        const itemExists = state.cart[itemIndex]!
        itemExists.overQuantity = itemExists.quantity
        itemExists.quantity = remaining
      })
    })
  },
})
