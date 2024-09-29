'use client'

import type { Product } from '@repo/db/types'

import { api } from '@/trpc/react'

import StarRating from '../../../_components/star-rating'

type ReviewsInfoProps = {
  productId: Product['id']
}

export function ReviewsCount({ productId }: ReviewsInfoProps) {
  const [reviewsDetails] = api.product.review.some.useSuspenseQuery(
    {
      productId,
      page: 1,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  return <>{reviewsDetails?._count.reviews}</>
}

export function ReviewsRating({ productId }: ReviewsInfoProps) {
  const [reviewsDetails] = api.product.review.some.useSuspenseQuery(
    {
      productId,
      page: 1,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  return <StarRating rating={reviewsDetails?.rating ?? 5} scale='lg' />
}
