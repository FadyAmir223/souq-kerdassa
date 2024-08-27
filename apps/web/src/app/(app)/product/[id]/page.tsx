import { cuidSchema } from '@repo/validators'
import { notFound } from 'next/navigation'

import { api } from '@/trpc/server'

import StarRating from '../../_components/star-rating'
import AddToCart from './_components/add-to-cart'
import ImageViewer from './_components/image-viewer'
import ProductSideBar from './_components/product-side-bar'
import SimilarProducts from './_components/similar-products'

type ProductPageProps = {
  params: {
    id: string
  }
}

export default async function ProductPage({
  params: { id: _id },
}: ProductPageProps) {
  const id = cuidSchema.safeParse(_id)
  if (!id.success) notFound()

  const [product, recommendedProducts] = await Promise.all([
    api.product.byId(id.data),
    api.product.similar(2),
  ])

  if (!product) notFound()

  return (
    <main className='container mb-6'>
      <div className='flex flex-col gap-y-10 md:flex-row md:gap-x-6'>
        <ProductSideBar recommendedProducts={recommendedProducts} />

        <section className='order-2 md:order-none'>
          <h1 className='mb-3 text-3xl font-bold'>{product.name}</h1>
          <div className='mb-3 flex items-center gap-x-9'>
            <span className='text-lg text-primary'>{product.reviewsCount}</span>
            <StarRating rating={product.rating} scale='lg' />
          </div>
          <p className='mb-5 text-3xl font-bold text-primary'>{product.price} EGP</p>

          <div className=''>
            <AddToCart product={product} />
          </div>
        </section>

        <section className='order-1 mr-auto w-full md:order-none md:w-1/3 lg:max-w-80'>
          <ImageViewer name={product.name} images={product.images} />
        </section>
      </div>

      <div className='mx-auto mb-16 mt-10 max-w-xl'>
        <h3 className='mb-3 text-center text-2xl font-bold text-primary'>الوصف</h3>
        <p className=''>{product.description}</p>
      </div>

      <SimilarProducts />

      {/* TODO: reviews section */}
    </main>
  )
}
