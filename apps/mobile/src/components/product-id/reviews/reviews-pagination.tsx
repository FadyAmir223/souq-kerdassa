import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

type ReviewsPaginationProps = {
  reviewPage: number
  setReviewPage: (newPage: number) => void
  totalReviews: number
}

const REVIEWS_PER_PAGE = 3

export default function ReviewsPagination({
  reviewPage,
  setReviewPage,
  totalReviews,
}: ReviewsPaginationProps) {
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE)
  if (totalPages < 2) return null

  return (
    <View className='mt-6 flex-row justify-center gap-x-6'>
      {reviewPage > 1 && (
        <Pressable
          className='flex-row items-center rounded-lg bg-primary px-4 py-2 active:scale-[0.98]'
          onPress={() => setReviewPage(reviewPage - 1)}
        >
          <MaterialIcons name='chevron-right' size={24} color='white' />
          <Text className='ml-2 text-white'>السابق</Text>
        </Pressable>
      )}

      {reviewPage < totalPages && (
        <Pressable
          className='flex-row items-center rounded-lg bg-primary px-4 py-2 active:scale-[0.98]'
          onPress={() => setReviewPage(reviewPage + 1)}
        >
          <Text className='mr-2 text-white'>التالى</Text>
          <MaterialIcons name='chevron-left' size={24} color='white' />
        </Pressable>
      )}
    </View>
  )
}
