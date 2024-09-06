'use client'

import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/providers/app-store-provider'
import { shippingCost } from '@/utils/constants'

import CheckoutCartItem from './checkout-cart-item'
import CheckoutCartItemsSkeleton from './checkout-cart-items-skeleton'

export default function CheckoutItemsSection() {
  const { cart, getCartTotalPrice } = useAppStore(
    useShallow(({ cart, getCartTotalPrice }) => ({ cart, getCartTotalPrice })),
  )

  const [isHydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <>
      <ul className='space-y-2'>
        {isHydrated ? (
          cart.map((item) => (
            <CheckoutCartItem
              key={item.id + item.season + item.category}
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
          <span className=''>الإجمالى</span>
          <span className=''>{getCartTotalPrice()} جنية</span>
        </div>

        <div className='flex justify-between'>
          <span className=''>الشحن</span>
          <span className=''>{shippingCost} جنية</span>
        </div>

        <div className='mt-2 flex justify-between border-t border-t-black pt-2'>
          <span className=''>الإجمالى</span>
          <span className=''>{getCartTotalPrice() + shippingCost} جنية</span>
        </div>
      </div>
    </>
  )
}
