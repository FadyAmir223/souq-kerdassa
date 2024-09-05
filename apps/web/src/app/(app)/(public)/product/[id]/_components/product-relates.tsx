import Link from 'next/link'

import StarRating from '@/app/(app)/(public)/_components/star-rating'
import ImageApi from '@/components/image'
import { api } from '@/trpc/server'
import { PAGES } from '@/utils/constants'

export default async function ProductRelates() {
  const recommendedProducts = await api.product.similar(2)

  return recommendedProducts.map((product) => (
    <Link
      key={product.id}
      href={PAGES.public.product(product.id)}
      className='flex h-36 justify-between gap-x-2 rounded-md bg-white p-2 shadow-md'
    >
      <div className='relative aspect-[83/100] overflow-hidden rounded-md'>
        <ImageApi
          src={product.image!}
          alt={product.name}
          fill
          sizes='9rem'
          className='object-cover'
        />
      </div>

      <div className='flex-1 px-2 py-3.5'>
        <h5 className='mb-1'>{product.name}</h5>

        <div className='my-1 flex gap-x-2'>
          <StarRating rating={product.rating} />
          <span className='text-sm'>({product.reviewsCount})</span>
        </div>

        <p className='text-[1.0625rem] text-primary/90'>{product.price} EGP</p>
      </div>
    </Link>
  ))
}
