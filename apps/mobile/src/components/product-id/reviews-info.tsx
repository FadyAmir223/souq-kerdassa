import type { Product } from '@repo/db/types'

import { api } from '@/utils/api'

import StarRating from '../product/star-rating'

type ReviewsInfoProps = {
  productId: Product['id']
}

export function ReviewsCount({ productId }: ReviewsInfoProps) {
  const { data: reviewsDetails } = api.product.review.some.useQuery(
    {
      productId,
      page: 1,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  return <>{reviewsDetails?._count.reviews}</>
}

export function ReviewsRating({ productId }: ReviewsInfoProps) {
  const { data: reviewsDetails } = api.product.review.some.useQuery(
    {
      productId,
      page: 1,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  return <StarRating rating={reviewsDetails?.rating ?? 5} scale='lg' />
}
