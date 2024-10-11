import { useCombinedStore } from '@repo/store/mobile'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function ResetCheckout() {
  const searchParams = useLocalSearchParams<{ redirectedFrom?: string }>()
  const router = useRouter()

  const { cart, deleteCartItem, resetCart, setSelectedAddress } = useCombinedStore(
    useShallow(({ cart, deleteCartItem, resetCart, setSelectedAddress }) => ({
      cart,
      deleteCartItem,
      resetCart,
      setSelectedAddress,
    })),
  )

  useEffect(() => {
    for (const item of cart) if (item.quantity === 0) deleteCartItem(item.variantId)

    if (searchParams.redirectedFrom !== '/checkout') return

    // TODO: check if clearing the navigation stack happens here or /checkout
    // https://github.com/expo/router/discussions/495

    router.replace('/orders')
    resetCart()
    setSelectedAddress(null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
