import type { AdminProductsSchema } from '@repo/validators'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { api, HydrateClient } from '@/trpc/server'

import Spinner from '../_components/spinner'
import ProductTabs from './_components/product-tabs'

export const metadata: Metadata = {
  title: {
    absolute: 'المنتجات',
  },
}

const defaultQueryParams = {
  limit: 10,
  page: 1,
  visibility: 'all',
} satisfies AdminProductsSchema

export default function ProductsPage() {
  void Promise.all([
    api.product.admin.count.prefetch(defaultQueryParams.visibility),
    api.product.admin.all.prefetch(defaultQueryParams),
  ])

  return (
    <div className='flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14'>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <h1 className='text-lg font-semibold md:text-2xl'>المنتجات</h1>

        <HydrateClient>
          <Suspense fallback={<Spinner />}>
            <ProductTabs defaultTab={defaultQueryParams.visibility} />
          </Suspense>
        </HydrateClient>
      </main>
    </div>
  )
}
