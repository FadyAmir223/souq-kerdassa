import { cuidSchema } from '@repo/validators'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { api, HydrateClient } from '@/trpc/server'
import { ASSETS, SEARCH_PARAMS } from '@/utils/constants'

import ProductDetails from './_components/product-details'
import ProductDetailsSkeleton from './_components/product-details-skeleton'
import ProductSidebar from './_components/product-sidebar'
import ReviewsSection from './_components/reviews/reviews-section'
import ReviewsSectionSkeleton from './_components/reviews/reviews-section-skeleton'
import SimilarProducts from './_components/similar-products'

type generateMetadataArgs = {
  params: Record<string, string | string[] | undefined>
}

export async function generateMetadata({
  params: { id: _id },
}: generateMetadataArgs): Promise<Metadata> {
  const id = cuidSchema.safeParse(_id)
  if (!id.success) notFound()

  const product = await api.product.byId(id.data)

  return {
    title: product?.name,
    description: product?.description,

    openGraph: {
      title: product?.name,
      description: product?.description,
      images: product?.images.map((image) => ({
        url: `${ASSETS.images}?${SEARCH_PARAMS.path}=${image}&${SEARCH_PARAMS.width}=256`,
        alt: `${product.name} preview`,
      })),
    },

    twitter: {
      title: product?.name,
      description: product?.description,
      images: product?.images.map(
        (image) =>
          `${ASSETS.images}?${SEARCH_PARAMS.path}=${image}&${SEARCH_PARAMS.width}=256`,
      ),
      card: 'summary_large_image',
    },
  }
}

type ProductPageProps = {
  params: {
    id: string
  }
}

export default function ProductPage({
  params: { id: productId },
}: ProductPageProps) {
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
