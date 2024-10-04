import type { Product } from '@repo/db/types'
import { useCombinedStore } from '@repo/store/mobile'
import { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useShallow } from 'zustand/react/shallow'

import { api } from '@/utils/api'
import { useUser } from '@/utils/auth'

type ReviewButtonProps = {
  productId: Product['id']
  reviewPage: number
}

export default function ReviewButton({ productId, reviewPage }: ReviewButtonProps) {
  const { data } = api.user.getReviewStatus.useQuery(productId, {
    staleTime: Infinity,
  })

  if (!data?.hasPurchased) return null

  return !data.hasReviewed ? (
    <AddReviewButton />
  ) : (
    <DeleteReviewButton productId={productId} reviewPage={reviewPage} />
  )
}

function AddReviewButton() {
  const { isReviewing, setReviewing } = useCombinedStore(
    useShallow(({ isReviewing, setReviewing }) => ({ isReviewing, setReviewing })),
  )

  return (
    <Pressable
      onPress={() => setReviewing(true)}
      disabled={isReviewing}
      className='mb-4 self-center rounded-full bg-white px-4 py-2 shadow'
    >
      <Text className='text-2xl font-semibold'>اضف مراجعة</Text>
    </Pressable>
  )
}

function DeleteReviewButton({ productId, reviewPage }: ReviewButtonProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const user = useUser()

  const deleteReview = api.product.review.delete.useMutation({
    onSuccess: async () => {
      setOpen(false)

      const reviewsDetails = utils.product.review.some.getData({
        productId,
        page: reviewPage,
      })

      const deletedReviewIndex = reviewsDetails?.reviews.findIndex(
        ({ user: { id: userId } }) => userId === user?.id,
      )

      if (deletedReviewIndex !== -1)
        await utils.product.review.some.invalidate({ productId, page: reviewPage })

      utils.user.getReviewStatus.setData(productId, {
        hasPurchased: true,
        hasReviewed: false,
      })

      Toast.show({
        type: 'success',
        text1: 'تم مسح مراجعتك',
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
    onError: ({ message }) => {
      Toast.show({
        type: 'error',
        text1: message,
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
  })

  return (
    <>
      <Pressable className='mb-4 self-center rounded-full bg-white px-4 py-2 shadow'>
        <Text className='text-2xl font-semibold'>امسح مراجعتك</Text>
      </Pressable>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isOpen}
        onRequestClose={() => setOpen(false)}
      >
        <Text>هل انت متأكد من إلغاء الطلب؟</Text>

        <View className='flex-row gap-x-5'>
          <Pressable
            className='me-4 min-w-16'
            onPress={() => deleteReview.mutate(productId)}
            disabled={deleteReview.isPending}
          >
            <Text>نعم</Text>
          </Pressable>
          <Pressable className='min-w-16' onPress={() => setOpen(false)}>
            <Text>لا</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  )
}
