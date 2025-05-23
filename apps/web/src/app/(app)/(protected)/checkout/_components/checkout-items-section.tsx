'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/providers/app-store-provider'
import { PAGES } from '@/utils/constants'

import CheckoutCartItem from './checkout-cart-item'
import CheckoutCartItemsSkeleton from './checkout-cart-items-skeleton'

export default function CheckoutItemsSection() {
  const router = useRouter()

  const { cart, getCartTotalPrice, shippingCost } = useAppStore(
    useShallow(({ cart, getCartTotalPrice, selectedAddress }) => ({
      cart,
      getCartTotalPrice,
      shippingCost: selectedAddress?.price ?? 0,
    })),
  )

  const [isHydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  useEffect(() => {
    if (isHydrated && cart.length === 0) router.replace(PAGES.public.main)
  }, [cart]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ul className='space-y-2'>
        {isHydrated ? (
          cart.map((item) => (
            <CheckoutCartItem
              key={item.id + item.season + item.category + item.size + item.color}
              item={item}
            />
          ))
        ) : (
          <>
            <CheckoutCartItemsSkeleton />
            <CheckoutCartItemsSkeleton />
          </>
        )}
      </ul>

      <div className='mt-5'>
        <div className='flex justify-between'>
          <span>الثمن</span>
          <span>{getCartTotalPrice()} جنية</span>
        </div>

        <div className='flex justify-between'>
          <span>الشحن</span>
          <span>{shippingCost} جنية</span>
        </div>

        <div className='mt-2 flex justify-between border-t border-t-black pt-2'>
          <span>الإجمالى</span>
          <span>{getCartTotalPrice() + shippingCost} جنية</span>
        </div>
      </div>
    </>
  )
}
