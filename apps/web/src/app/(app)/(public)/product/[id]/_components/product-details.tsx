import type { Product } from '@repo/db/types'
import { notFound } from 'next/navigation'

import H1 from '@/app/(app)/_components/h1'
import { api } from '@/trpc/server'

import StarRating from '../../../_components/star-rating'
import AddToCart from './add-to-cart'
import ImageViewer from './image-viewer'

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
        <div className='mb-3 flex items-center gap-x-9'>
          <span className='text-lg text-primary'>{product.reviewsCount}</span>
          <StarRating rating={product.rating} scale='lg' />
        </div>
        <p className='mb-5 text-3xl font-bold text-primary'>{product.price} جنية</p>

        <div>
          <AddToCart product={product} />
        </div>

        <div className='mt-auto max-w-lg'>
          <h3 className='mb-3 mt-10 text-2xl font-bold text-primary md:mt-0'>
            الوصف
          </h3>
          <p>{product.description}</p>
        </div>
      </section>

      <section className='order-1 mr-auto w-full md:order-none md:w-1/3 lg:max-w-80'>
        <ImageViewer name={product.name} images={product.images} />
      </section>
    </>
  )
}
