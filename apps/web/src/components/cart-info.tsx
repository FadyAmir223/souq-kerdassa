'use client'

import { useEffect } from 'react'

import { useAppStore, useMainStore } from '@/providers/app-store-provider'

/**
 * createStoes doesn't have .persist attached to it
 * workaround: call it yourself once every page
 * header exists in every page so...
 * https://github.com/pmndrs/zustand/discussions/2350#discussioncomment-10249137
 */
export function CartTotalQuantity() {
  const [quantity, mainStoreApi] = useMainStore((s) => s.getCartTotalQuantity())

  useEffect(() => {
    // @ts-expect-error un-existing type
    mainStoreApi.persist.rehydrate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return quantity
}

export function CartTotalPrice({ additionalCost = 0 }: { additionalCost?: number }) {
  const price = useAppStore((s) => s.getCartTotalPrice())
  return price + additionalCost
}
