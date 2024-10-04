import type { Product } from '@repo/db/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useState } from 'react'
import { Text, View } from 'react-native'

import StarRating from '@/components/product/star-rating'
import { api } from '@/utils/api'
import { readableNumber } from '@/utils/readable-number'

import AddReviewForm from './add-review-form'
import ReviewButton from './review-button'
import ReviewsPagination from './reviews-pagination'
import ReviewsSectionSkeleton from './reviews-section-skeleton'

type ReviewsSectionProps = {
  productId: Product['id']
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviewPage, setReviewPage] = useState(1)

  const { data: reviewsDetails, isLoading } = api.product.review.some.useQuery(
    { productId, page: reviewPage },
    { staleTime: 15 * 60 * 1000 },
  )

  if (isLoading) return <ReviewsSectionSkeleton />

  return (
    <>
      <Text className='mb-4 text-center text-4xl font-bold text-primary'>
        المراجعات
      </Text>

      {reviewsDetails && reviewsDetails.reviewsCount !== 0 ? (
        <>
          <View className='gap-y-3'>
            <View>
              <View className='mb-1 flex-row items-center gap-x-6'>
                <Text className='text-2xl font-bold'>
                  {reviewsDetails.rating} من 5
                </Text>
                <StarRating rating={reviewsDetails.rating} scale='lg' />
              </View>

              <Text className='mb-4 self-start text-xl font-semibold text-gray-500'>
                {readableNumber(reviewsDetails.reviewsCount)} مراجعة
              </Text>
            </View>

            <ReviewButton productId={productId} reviewPage={reviewPage} />
          </View>

          <View className='gap-y-4'>
            <AddReviewForm productId={productId} setReviewPage={setReviewPage} />

            {reviewsDetails.reviews.map((review) => (
              <View key={review.id} className='rounded-md bg-white p-4 shadow-sm'>
                <View className='mb-1.5 flex-row items-center gap-x-4'>
                  <Text className='text-xl font-semibold'>{review.user.name}</Text>
                  <StarRating rating={review.rating} />

                  <Text className='ms-3 inline-block text-lg text-black/80'>
                    {formatDistanceToNow(review.updatedAt, {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </Text>
                </View>

                <Text className='self-start text-lg'>{review.message}</Text>
              </View>
            ))}
          </View>

          <ReviewsPagination
            reviewPage={reviewPage}
            setReviewPage={setReviewPage}
            totalReviews={reviewsDetails._count.reviews}
          />
        </>
      ) : (
        <View className=''>
          <Text className='text-center text-2xl font-bold'>لا يوجد مراجعات</Text>
          <ReviewButton productId={productId} reviewPage={reviewPage} />
          <AddReviewForm productId={productId} setReviewPage={setReviewPage} />
        </View>
      )}
    </>
  )
}
