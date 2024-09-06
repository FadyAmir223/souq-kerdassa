import type { ProductsByFiltersSchema } from '@repo/validators'
import Link from 'next/link'
import { Suspense } from 'react'

import { api } from '@/trpc/server'
import { cn } from '@/utils/cn'
import { PAGES } from '@/utils/constants'

import ProductCard from './product-card'
import ProductCardSkeleton from './product-card-skeleton'

type ProductMiniListProps = {
  filter: ProductsByFiltersSchema
}

export default function ProductMiniList({ filter }: ProductMiniListProps) {
  const isLatest = filter.type === 'latest'

  return (
    <ul
      className={cn(
        'col-span-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
        isLatest && 'lg:col-span-4 lg:grid-cols-4',
      )}
    >
      <Suspense
        fallback={Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      >
        <Products filter={filter} />
      </Suspense>
    </ul>
  )
}

async function Products({ filter }: ProductMiniListProps) {
  const { products } = await api.product.byFilter({ limit: 6, ...filter })

  return products.map((product) => (
    <Link
      key={product.id}
      href={PAGES.public.product(product.id)}
      className='transition-transform hover:scale-[1.03]'
    >
      <ProductCard product={product} />
    </Link>
  ))
}
