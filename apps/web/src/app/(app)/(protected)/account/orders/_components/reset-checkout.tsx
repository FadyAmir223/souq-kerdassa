'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/providers/app-store-provider'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

export default function ResetCheckout() {
  const redirectedFrom = useSearchParams().get(SEARCH_PARAMS.redirectedFrom)
  const router = useRouter()
  const pathname = usePathname()

  const { cart, deleteCartItem, resetCart, setSelectedAddress } = useAppStore(
    useShallow(({ cart, deleteCartItem, resetCart, setSelectedAddress }) => ({
      cart,
      deleteCartItem,
      resetCart,
      setSelectedAddress,
    })),
  )

  useEffect(() => {
    for (const item of cart) if (item.quantity === 0) deleteCartItem(item.variantId)

    if (redirectedFrom !== PAGES.protected.buy.checkout) return

    router.replace(pathname)
    resetCart()
    setSelectedAddress(null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
