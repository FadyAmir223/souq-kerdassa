import ImageApi from '@/components/image'
import type { RouterOutputs } from '@/trpc/react'
import { cn } from '@/utils/cn'

import StarRating from '../star-rating'

type ProductCardProps = {
  product: RouterOutputs['product']['byFilter']['products'][number]
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { name, price, rating, image, reviewsCount } = product

  return (
    <div
      className={cn('overflow-hidden rounded-lg text-center shadow-lg', className)}
    >
      <div className='relative aspect-[83/100]'>
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
        <p className='font-bold text-primary'>{price} جنية</p>
      </div>
    </div>
  )
}
