import { cuidSchema } from '@repo/validators'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import ProductDetails from './_components/product-details'
import ProductDetailsSkeleton from './_components/product-details-skeleton'
import ProductSidebar from './_components/product-sidebar'
import SimilarProducts from './_components/similar-products'

type ProductPageProps = {
  params: {
    id: string
  }
}

export default function ProductPage({ params: { id: _id } }: ProductPageProps) {
  const id = cuidSchema.safeParse(_id)
  if (!id.success) notFound()

  return (
    <main className='container mb-6'>
      <div className='flex flex-col gap-y-10 md:flex-row md:gap-x-6'>
        <ProductSidebar />

        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetails productId={id.data} />
        </Suspense>
      </div>

      <SimilarProducts />

      {/* TODO: reviews section */}
    </main>
  )
}
