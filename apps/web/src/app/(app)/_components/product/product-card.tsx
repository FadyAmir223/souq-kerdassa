import ImageApi from '@/components/image'
import type { RouterOutputs } from '@/trpc/react'
import { cn } from '@/utils/cn'

import StarRating from '../star-rating'

type ProductCardProps = {
  product: RouterOutputs['product']['byType'][number]
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
            (max-width: 480px) 100vw,
            (max-width: 768px) 50vw,
            (max-width: 967px) 25vw,
            16.67vw
          '
          className='object-cover'
        />
      </div>

      <div className='bg-white p-2'>
        <h4 className=''>{name}</h4>
        <div className='my-1 flex justify-center gap-x-2'>
          <StarRating rating={rating} />
          <span className=''>({reviewsCount})</span>
        </div>
        <p className='font-bold text-primary'>{price} EGP</p>
      </div>
    </div>
  )
}
