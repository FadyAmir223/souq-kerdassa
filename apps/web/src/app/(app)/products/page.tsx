import { productTypeSchema } from '@repo/validators'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { z } from 'zod'

import { api, HydrateClient } from '@/trpc/server'

import ProductCardSkeleton from '../_components/product/product-skeleton'
import FilterOptions from './_components/filter-options'
import ProductList from './_components/product-list'

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export const dynamic = 'force-dynamic'

const productParamsSchema = z.object({
  type: productTypeSchema,
  page: z.coerce.number().optional().default(1),
})

export default function ProductsPage({
  searchParams: _searchParams,
}: ProductsPageProps) {
  const searchParams = productParamsSchema.safeParse(_searchParams)
  if (!searchParams.success) notFound()

  const { type, page } = searchParams.data

  const productByTypeInput = { type, limit: 10, page }
  void api.product.byType(productByTypeInput)

  return (
    <HydrateClient>
      <main className='container'>
        <div className='flex gap-4'>
          <section className='grid flex-1 grid-cols-2 gap-4 md:grid-cols-4'>
            <Suspense
              fallback={Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            >
              <ProductList productByTypeInput={productByTypeInput} />
            </Suspense>
          </section>

          <FilterOptions />
        </div>
      </main>
    </HydrateClient>
  )
}
