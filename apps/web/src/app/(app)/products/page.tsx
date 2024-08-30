import { productsByFiltersSchema } from '@repo/validators'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { api, HydrateClient } from '@/trpc/server'

import ProductCardSkeleton from '../_components/product/product-skeleton'
import FilterOptions from './_components/filter-options'
import ProductList from './_components/product-list'

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export const dynamic = 'force-dynamic'

export default function ProductsPage({
  searchParams: _searchParams,
}: ProductsPageProps) {
  const searchParams = productsByFiltersSchema.safeParse(_searchParams)
  if (!searchParams.success) notFound()

  void api.product.byType(searchParams.data)

  return (
    <HydrateClient>
      <main className='container'>
        <div className='flex gap-4'>
          <Suspense
            fallback={
              <section className='grid flex-1 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </section>
            }
          >
            <ProductList productByTypeInput={searchParams.data} />
          </Suspense>

          <FilterOptions />
        </div>
      </main>
    </HydrateClient>
  )
}
