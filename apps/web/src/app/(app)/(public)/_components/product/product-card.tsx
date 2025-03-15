import ImageApi from '@/components/image'
import type { RouterOutputs } from '@/trpc/react'
import { cn } from '@/utils/cn'

import StarRating from '../star-rating'

type ProductCardProps = {
  product: RouterOutputs['product']['byFilter']['products'][number]
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { name, rating, image, reviewsCount, price, discount } = product

  return (
    <div
      className={cn('overflow-hidden rounded-lg text-center shadow-lg', className)}
    >
      <div className='relative aspect-[83/100] overflow-hidden rounded-md'>
        <ImageApi
          src={image!}
          alt={name}
          fill
          sizes='
            (max-width: 967px) 100vw,
            20rem
          '
          className='object-cover'
        />
      </div>

      <div className='bg-white p-2'>
        <span className='block'>{name}</span>
        <div className='my-1 flex justify-center gap-x-2'>
          <StarRating rating={rating} />
          <span>({reviewsCount})</span>
        </div>

        <div className='flex justify-center gap-x-2'>
          <span
            className={cn('font-bold text-primary', {
              'text-primary/60 line-through': discount,
            })}
          >
            {price}
          </span>

          {discount && <span className='font-bold text-primary'>{discount}</span>}

          <span className='font-bold text-primary'>جنية</span>
        </div>
      </div>
    </div>
  )
}
