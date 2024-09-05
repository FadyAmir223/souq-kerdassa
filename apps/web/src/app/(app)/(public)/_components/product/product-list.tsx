import type { Season } from '@repo/db/types'
import Link from 'next/link'
import { Suspense } from 'react'

import { api } from '@/trpc/server'
import { cn } from '@/utils/cn'

import ProductCard from './product-card'
import ProductCardSkeleton from './product-card-skeleton'

type ProductMiniListProps = {
  type: Season | 'latest'
}

export default function ProductMiniList({ type }: ProductMiniListProps) {
  const isLatest = type === 'latest'

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

async function Products({ type }: ProductMiniListProps) {
  const products = await api.product.sample({ type, limit: 6 })

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
