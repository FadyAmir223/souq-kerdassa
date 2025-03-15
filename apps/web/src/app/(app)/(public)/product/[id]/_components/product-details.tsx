import type { Product } from '@repo/db/types'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import H1 from '@/app/(app)/_components/h1'
import { api } from '@/trpc/server'

import StarRating from '../../../_components/star-rating'
import AddToCart from './add-to-cart'
import ImageViewer from './image-viewer'
import ProductPrice from './product-price'
import { ReviewsCount, ReviewsRating } from './reviews/reviews-info'

type ProductDetailsProps = {
  productId: Product['id']
}

export default async function ProductDetails({ productId }: ProductDetailsProps) {
  const product = await api.product.byId(productId)

  if (!product) notFound()

  return (
    <>
      <section className='order-2 flex flex-col md:order-none'>
        <H1>{product.name}</H1>
        <Suspense
          fallback={
            <div className='mb-3 flex items-center gap-x-9'>
              <span className='text-lg text-primary'>0</span>
              <StarRating rating={5} scale='lg' />
            </div>
          }
        >
          <div className='mb-3 flex items-center gap-x-9'>
            <span className='text-lg text-primary'>
              <ReviewsCount productId={productId} />
            </span>
            <ReviewsRating productId={productId} />
          </div>
        </Suspense>
        <p className='mb-5 space-x-2 text-3xl font-bold text-primary'>
          <ProductPrice />
        </p>

        <div>
          <AddToCart product={product} />
        </div>

        <div className='mt-auto max-w-lg'>
          <span className='mb-3 mt-10 block text-2xl font-bold text-primary md:mt-0'>
            الوصف
          </span>
          <p>{product.description}</p>
        </div>
      </section>

      <section className='order-1 mr-auto w-full md:order-none md:w-1/3 lg:max-w-80'>
        <ImageViewer name={product.name} images={product.images} />
      </section>
    </>
  )
}
