'use client'

import type { RouterOutputs } from '@repo/api'
import { keepPreviousData } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { useIsMedium, useIsSmall } from '@/hooks/use-responsive'
import { api } from '@/trpc/react'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

import ProductCard from '../../_components/product/product-card'
import ProductCardSkeleton from '../../_components/product/product-card-skeleton'

const rows = 4

export default function SearchResults() {
  const isSmall = useIsSmall()
  const isMedium = useIsMedium()

  let limit = 6 * rows
  if (isSmall) limit = 2 * rows
  else if (isMedium) limit = 4 * rows

  const searchParams = useSearchParams()
  const query = searchParams.get(SEARCH_PARAMS.query)?.trim() ?? ''

  // bug in typing when using "select" & trpc don't accept types
  const { data, isFetching, hasNextPage, fetchNextPage } =
    api.product.byQuery.useInfiniteQuery(
      { query, limit },
      {
        select: ({ pages }) => ({
          products: pages.flatMap((page) => page.products),
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        enabled: !!query,
      },
    )

  const { ref, inView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (inView && hasNextPage) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, inView])

  const products = data as RouterOutputs['product']['byQuery'] | undefined

  if (products?.products.length === 0 && !isFetching)
    return (
      <p className='mt-8 text-center text-lg font-semibold'>لا يوجد نتائج بحث</p>
    )

  return (
    <ul className='col-span-6 grid gap-y-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 lg:grid-cols-6'>
      {products?.products.map((product, idx) => (
        <li
          key={product.id}
          ref={idx === products.products.length - 1 ? ref : null}
          className='transition-transform hover:scale-[1.03]'
        >
          <Link href={PAGES.public.product(product.id)}>
            <ProductCard product={product} />
          </Link>
        </li>
      ))}

      {query &&
        isFetching &&
        Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </ul>
  )
}
