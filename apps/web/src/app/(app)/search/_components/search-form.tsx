'use client'

import type { RouterOutputs } from '@repo/api'
import { keepPreviousData } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import SearchField from '@/components/search-field'
import { api } from '@/trpc/react'
import { SEARCH_PARAMS } from '@/utils/constants'

import ProductCard from '../../_components/product/product-card'
import ProductCardSkeleton from '../../_components/product/product-skeleton'

export default function SearchForm() {
  const searchParams = useSearchParams()
  const query = searchParams.get(SEARCH_PARAMS.query) ?? ''

  const { data, isFetching, hasNextPage, fetchNextPage } =
    api.product.byQuery.useInfiniteQuery(
      { query },
      {
        select: ({ pages }) => ({
          products: pages.flatMap((page) => page.products),
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
      },
    )

  const { ref, inView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (inView && hasNextPage) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className='space-y-8'>
      <SearchField />

      <ul className='col-span-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
        {/* there is no need to consume memory to define typed variable */}
        {(data as unknown as RouterOutputs['product']['byQuery']).products.map(
          (product, idx) => (
            <Link
              ref={
                idx ===
                (data as unknown as RouterOutputs['product']['byQuery']).products
                  .length -
                  1
                  ? ref
                  : null
              }
              key={product.id}
              href={`/product/${product.id}`}
              className='transition-transform hover:scale-[1.03]'
            >
              <ProductCard product={product} />
            </Link>
          ),
        )}

        {query &&
          isFetching &&
          Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </ul>
    </div>
  )
}
