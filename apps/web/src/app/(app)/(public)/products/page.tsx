import { productsByFiltersSchema } from '@repo/validators'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import ProductCardSkeleton from '../_components/product/product-card-skeleton'
import FilterDrawer from './_components/filter-drawer'
import FilterSidebar from './_components/filter-sidebar'
import ProductList from './_components/product-list'

export const metadata: Metadata = {
  title: 'تسوقى العبايات',
  description: 'اكتشفى مجموعة متنوعة من العبايات',
}

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export const dynamic = 'force-dynamic'

export default function ProductsPage({
  searchParams: _searchParams,
}: ProductsPageProps) {
  const result = productsByFiltersSchema.safeParse(_searchParams)
  if (!result.success) notFound()
  const searchParams = result.data

  const hasParams = !!searchParams.type || !!searchParams.category

  return (
    <main className='container'>
      <div className='flex flex-col gap-y-9 md:flex-row md:gap-x-4'>
        <FilterDrawer hasParams={hasParams} />

        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={
            <section className='grid flex-1 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </section>
          }
        >
          <ProductList searchParams={searchParams} />
        </Suspense>

        <FilterSidebar hasParams={hasParams} />
      </div>
    </main>
  )
}
