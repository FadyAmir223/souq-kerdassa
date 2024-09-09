import { cuidSchema } from '@repo/validators'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { api, HydrateClient } from '@/trpc/server'

import ProductDetails from './_components/product-details'
import ProductDetailsSkeleton from './_components/product-details-skeleton'
import ProductSidebar from './_components/product-sidebar'
import ReviewsSection from './_components/reviews/reviews-section'
import ReviewsSectionSkeleton from './_components/reviews/reviews-section-skeleton'
import SimilarProducts from './_components/similar-products'

type ProductPageProps = {
  params: {
    id: string
  }
}

export default function ProductPage({ params: { id: _id } }: ProductPageProps) {
  const id = cuidSchema.safeParse(_id)
  if (!id.success) notFound()
  const productId = id.data

  void Promise.all([
    api.product.review.some.prefetch({ productId, page: 1 }),
    api.user.getReviewStatus.prefetch(productId),
  ])

  return (
    <main className='container mb-6'>
      <div className='flex flex-col gap-y-10 md:flex-row md:gap-x-6'>
        <ProductSidebar />

        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetails productId={productId} />
        </Suspense>
      </div>

      <section className='mt-24'>
        <h3 className='mb-4 text-center text-2xl font-bold text-primary'>
          المراجعات
        </h3>

        <HydrateClient>
          <Suspense fallback={<ReviewsSectionSkeleton />}>
            <ReviewsSection productId={productId} />
          </Suspense>
        </HydrateClient>
      </section>

      <SimilarProducts />
    </main>
  )
}
