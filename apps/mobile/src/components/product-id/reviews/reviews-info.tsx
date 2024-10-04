import type { Product } from '@repo/db/types'

import StarRating from '@/components/product/star-rating'
import { api } from '@/utils/api'

type ReviewsInfoProps = {
  productId: Product['id']
}

export function ReviewsCount({ productId }: ReviewsInfoProps) {
  const { data: reviewsDetails, isLoading } = api.product.review.some.useQuery(
    {
      productId,
      page: 1,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  if (isLoading) return null

  return <>{reviewsDetails?._count.reviews}</>
}

export function ReviewsRating({ productId }: ReviewsInfoProps) {
  const { data: reviewsDetails, isLoading } = api.product.review.some.useQuery(
    {
      productId,
      page: 1,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  if (isLoading) return null

  return <StarRating rating={reviewsDetails?.rating ?? 5} scale='lg' />
}
