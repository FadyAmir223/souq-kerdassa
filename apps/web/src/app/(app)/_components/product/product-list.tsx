import type { Season } from '@repo/db/types'
import Link from 'next/link'
import { Suspense } from 'react'

import { api } from '@/trpc/server'
import { cn } from '@/utils/cn'

import ProductCard from './product-card'
import ProductCardSkeleton from './product-skeleton'

type ProductListProps = {
  type: Season | 'LATEST'
}

export default function ProductList({ type }: ProductListProps) {
  const isLatest = type === 'LATEST'

  return (
    <ul
      className={cn(
        'col-span-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
        isLatest && 'lg:col-span-4 lg:grid-cols-4',
      )}
    >
      <Suspense
        fallback={Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      >
        <Products type={type} />
      </Suspense>
    </ul>
  )
}

// TODO: may use trpc client api
// TODO: refactor to be used with search page as well
async function Products({ type }: ProductListProps) {
  const products = await api.product.byCategory(type)

  return products.map((product) => (
    <Link
      key={product.id}
      href={`/product/${product.id}`}
      className='transition-transform hover:scale-[1.03]'
    >
      <ProductCard product={product} />
    </Link>
  ))
}
