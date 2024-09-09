'use client'

import type { Product } from '@repo/db/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import StarRating from '@/app/(app)/(public)/_components/star-rating'
import { api } from '@/trpc/react'

import { readableNumber } from '../../_utils/readable-number'
import AddReviewForm from './add-review-form'
import ReviewsPagination from './reviews-pagination'

const ReviewButton = dynamic(() => import('./review-button'), { ssr: false })

type ReviewsSectionProps = {
  productId: Product['id']
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviewPage, setReviewPage] = useState(1)

  const [reviewsDetails] = api.product.review.some.useSuspenseQuery(
    {
      productId,
      page: reviewPage,
    },
    { staleTime: 15 * 60 * 1000 },
  )

  if (!reviewsDetails || reviewsDetails.reviewsCount === 0)
    return (
      <div className='space-y-3 text-center'>
        <h4 className='text-lg font-bold'>لا يوجد مراجعات</h4>
        <ReviewButton productId={productId} reviewPage={reviewPage} />
        <AddReviewForm productId={productId} setReviewPage={setReviewPage} />
      </div>
    )

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className=''>
          <div className='mb-1 flex items-center gap-x-10'>
            <h4 className='text-2xl font-bold'>{reviewsDetails.rating} من 5</h4>
            <StarRating rating={reviewsDetails.rating} scale='lg' />
          </div>

          <p className='mb-4 text-sm font-semibold text-gray-500'>
            {readableNumber(reviewsDetails.reviewsCount)} مراجعة
          </p>
        </div>

        <ReviewButton productId={productId} reviewPage={reviewPage} />
      </div>

      <ul className='space-y-4'>
        <AddReviewForm productId={productId} setReviewPage={setReviewPage} />

        {reviewsDetails.reviews.map((review) => (
          <li key={review.id} className='rounded-md bg-white p-4 shadow-sm'>
            <div className='mb-1 flex items-center gap-x-4'>
              <span className='text-lg font-semibold'>{review.user.name}</span>
              <StarRating rating={review.rating} />

              <span className='ms-3 inline-block text-sm text-black/80'>
                {formatDistanceToNow(review.updatedAt, {
                  addSuffix: true,
                  locale: ar,
                })}
              </span>
            </div>

            <p className=''>{review.message}</p>
          </li>
        ))}
      </ul>

      <ReviewsPagination
        reviewPage={reviewPage}
        setReviewPage={setReviewPage}
        totalReviews={reviewsDetails._count.reviews}
      />
    </>
  )
}
