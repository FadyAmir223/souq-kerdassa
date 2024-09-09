import type { RouterInputs } from '@repo/api'
import Link from 'next/link'

import ProductCard from '@/app/(app)/(public)/_components/product/product-card'
import { api } from '@/trpc/server'
import { PAGES } from '@/utils/constants'

import ProductsPagination from './products-pagination'

type ProductListProps = {
  searchParams: RouterInputs['product']['byFilter']
}

export default async function ProductList({ searchParams }: ProductListProps) {
  const { products, total } = await api.product.byFilter(searchParams)

  if (!products.length)
    return (
      <h2 className='flex-1 text-center text-xl font-semibold'>لا يوجد منتجات</h2>
    )

  return (
    <section className='flex-1'>
      <ul className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <Link
            key={product.id}
            href={PAGES.public.product(product.id)}
            className='transition-transform hover:scale-[1.03]'
          >
            <ProductCard key={product.id} product={product} />
          </Link>
        ))}
      </ul>

      <ProductsPagination currPage={searchParams.page!} totalItems={total} />
    </section>
  )
}
