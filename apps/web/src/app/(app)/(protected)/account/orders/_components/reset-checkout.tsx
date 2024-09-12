'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAppStore } from '@/providers/app-store-provider'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

export default function ResetCheckout() {
  const resetCart = useAppStore((s) => s.resetCart)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { setSelectedAddress } = useAppStore(({ setSelectedAddress }) => ({
    setSelectedAddress,
  }))

  useEffect(() => {
    if (
      searchParams.get(SEARCH_PARAMS.redirectFrom) !== PAGES.protected.buy.checkout
    )
      return

    router.replace(pathname)
    resetCart()
    setSelectedAddress(null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
