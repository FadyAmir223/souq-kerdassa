import type { RouterInputs } from '@repo/api'
import Link from 'next/link'

import ProductCard from '@/app/(app)/(public)/_components/product/product-card'
import { api } from '@/trpc/server'

import Paginations from './paginations'

type ProductListProps = {
  searchParams: RouterInputs['product']['byType']
}

export default async function ProductList({ searchParams }: ProductListProps) {
  const { products, total } = await api.product.byType(searchParams)

  if (!products.length)
    return (
      <h2 className='flex-1 text-center text-xl font-semibold'>لا يوجد منتجات</h2>
    )

  return (
    <section className='flex-1'>
      <ul className='mb-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className='transition-transform hover:scale-[1.03]'
          >
            <ProductCard key={product.id} product={product} />
          </Link>
        ))}
      </ul>

      <Paginations currPage={searchParams.page!} totalItems={total} />
    </section>
  )
}
