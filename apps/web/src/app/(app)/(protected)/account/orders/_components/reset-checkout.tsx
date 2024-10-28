'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/providers/app-store-provider'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

export default function ResetCheckout() {
  const redirectedFrom = useSearchParams().get(SEARCH_PARAMS.redirectedFrom)
  const router = useRouter()

  const { resetCart, setSelectedAddress } = useAppStore(
    useShallow(({ resetCart, setSelectedAddress }) => ({
      resetCart,
      setSelectedAddress,
    })),
  )

  useEffect(() => {
    if (redirectedFrom !== PAGES.protected.buy.checkout) return

    router.replace(PAGES.protected.user.orders)
    resetCart()
    setSelectedAddress(null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
