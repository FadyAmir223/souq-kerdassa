import type { Product, ProductVariant } from '@repo/db/types'
import type { StateCreator } from 'zustand'

type CartItem = {
  id: Product['id']
  name: Product['name']
  image: Product['images'][number]
  price: Product['price']
  season: ProductVariant['season']
  category: ProductVariant['category']
  quantity: number
}

type CartState = {
  cart: CartItem[]
}

type ItemIdentifiers = {
  id: CartItem['id']
  season: CartItem['season']
  category: CartItem['category']
}

type CartActions = {
  addCartItem: (item: Omit<CartItem, 'quantity'>) => void
  incrementCartItem: ({ id, season, category }: ItemIdentifiers) => void
  decrementCartItem: ({ id, season, category }: ItemIdentifiers) => void
  deleteCartItem: ({ id, season, category }: ItemIdentifiers) => void
  getCartTotalPrice: () => CartItem['price']
  getCartTotalQuantity: () => number
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

  addCartItem: (item) => {
    const itemIndex = get().cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.season === item.season &&
        cartItem.category === item.category,
    )

    set((state) => {
      if (itemIndex !== -1) state.cart[itemIndex]!.quantity += 1
      else state.cart.push({ ...item, quantity: 1 })
    })
  },

  incrementCartItem: (item) => {
    const itemIndex = get().cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.season === item.season &&
        cartItem.category === item.category,
    )

    set((state) => {
      if (itemIndex === -1) return
      state.cart[itemIndex]!.quantity += 1
    })
  },

  decrementCartItem: (item) => {
    const itemIndex = get().cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.season === item.season &&
        cartItem.category === item.category,
    )

    set((state) => {
      if (itemIndex === -1) return
      if (state.cart[itemIndex]!.quantity > 1) state.cart[itemIndex]!.quantity -= 1
      else state.cart.splice(itemIndex, 1)
    })
  },

  deleteCartItem: (item) =>
    set((state) => {
      state.cart = state.cart.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.season === item.season &&
            cartItem.category === item.category
          ),
      )
    }),

  getCartTotalPrice: () =>
    get().cart.reduce((acc, { quantity, price }) => acc + price * quantity, 0),

  getCartTotalQuantity: () =>
    get().cart.reduce((acc, { quantity }) => acc + quantity, 0),
})
