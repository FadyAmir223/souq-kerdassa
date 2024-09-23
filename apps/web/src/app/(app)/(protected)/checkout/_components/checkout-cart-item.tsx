import type { CartItem } from '@repo/store/types'

import ImageApi from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { AR } from '@/utils/constants'

type CheckoutCartItemProps = {
  item: CartItem
}

export default function CheckoutCartItem({ item }: CheckoutCartItemProps) {
  return (
    <li
      className={cn('relative flex gap-x-3 rounded-md bg-white p-2.5 shadow-sm', {
        'select-none opacity-50': item.quantity === 0,
      })}
    >
      <div className='absolute right-0 top-0 z-10 grid size-[1.1875rem] place-items-center rounded-full bg-black text-[0.8125rem] font-semibold text-white'>
        {item.quantity}
      </div>

      {item.overQuantity && (
        <div className='before: absolute right-5 top-0 z-10 grid size-[1.1875rem] place-items-center rounded-full bg-destructive text-[0.8125rem] font-semibold text-white before:absolute before:h-full before:w-0.5 before:rotate-45 before:bg-black'>
          {item.overQuantity}
        </div>
      )}

      <div className='relative aspect-[83/100] w-20 overflow-hidden rounded-md'>
        <ImageApi
          src={item.image}
          alt={item.name}
          fill
          sizes='5rem'
          className='object-cover'
          priority // TODO: may depend on screen & not all of them
        />
      </div>

      <div className='flex flex-1 items-center justify-between'>
        <div>
          <p>{item.name}</p>
          <div className='mb-1'>
            <Badge>{AR.season[item.season]}</Badge>
          </div>
          <div>
            <Badge className='bg-sky-500 hover:bg-sky-500/80'>
              {AR.category[item.category]}
            </Badge>
          </div>
        </div>
        <p className='text-lg font-bold'>{item.price} جنية</p>
      </div>
    </li>
  )
}
