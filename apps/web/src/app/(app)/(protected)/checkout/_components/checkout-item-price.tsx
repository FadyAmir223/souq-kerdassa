import type { CartItem } from '@repo/store/types'

import { cn } from '@/utils/cn'

type checkoutItemPrice = {
  price: CartItem['price']
  discount: CartItem['discount']
  isMedium?: boolean
}

export default function CheckoutItemPrice({
  price,
  discount,
  isMedium = false,
}: checkoutItemPrice) {
  return (
    <div
      className={cn('gap-2', {
        'hidden sm:flex sm:min-w-32 md:hidden xl:flex xl:min-w-32': !isMedium,
        'flex sm:hidden md:flex xl:hidden': isMedium,
      })}
    >
      <span
        className={cn('text-lg font-bold', {
          'line-through opacity-60': discount,
        })}
      >
        {price}
      </span>
      {!!discount && <span className='text-lg font-bold'>{discount}</span>}
      <span className='text-lg font-bold'>جنية</span>
    </div>
  )
}
