import { MaterialIcons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Product } from '@repo/db/types'
import { useCombinedStore } from '@repo/store/mobile'
import type { ReviewSchema } from '@repo/validators'
import { reviewSchema } from '@repo/validators'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, Text, TextInput, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useShallow } from 'zustand/react/shallow'

import { api } from '@/utils/api'
import { useUser } from '@/utils/auth'

type AddReviewFormProps = {
  productId: Product['id']
  setReviewPage: (newPage: number) => void
}

const initRating = -1

export default function AddReviewForm({
  productId,
  setReviewPage,
}: AddReviewFormProps) {
  const [rating, setRating] = useState(initRating)
  const user = useUser()
  const utils = api.useUtils()

  const { isReviewing, setReviewing } = useCombinedStore(
    useShallow(({ isReviewing, setReviewing }) => ({ isReviewing, setReviewing })),
  )

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      message: '',
      rating: initRating,
    },
  })

  const handleCloseForm = () => {
    setReviewing(false)
    setRating(0)
    form.reset()
  }

  const addReview = api.product.review.add.useMutation({
    onSuccess: async () => {
      if (form.getValues('message')) {
        await utils.product.review.some.invalidate({
          productId,
          page: 1,
        })

        setReviewPage(1)
      }

      utils.user.getReviewStatus.setData(productId, {
        hasPurchased: true,
        hasReviewed: true,
      })

      handleCloseForm()
    },
    onError: (error) => {
      if (error.data?.code === 'CONFLICT') handleCloseForm()

      Toast.show({
        type: 'error',
        text1: error.message,
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
  })

  if (!user) return null

  const handleRating = (newRating: number) => {
    setRating(newRating)
    form.setValue('rating', newRating)
  }

  const onSubmit = () => {
    const values = form.getValues()
    const result = reviewSchema.safeParse(values)
    if (!result.success) return

    addReview.mutate({
      productId,
      review: result.data,
    })
  }

  return (
    <View
      className={`mt-4 rounded-md bg-white p-4 shadow-sm ${!isReviewing && !isReviewing}`}
    >
      <View className='mb-2'>
        <Text className='mb-1 self-start text-2xl font-semibold'>{user.name}</Text>
        <Text className='text-xl font-semibold text-gray-500'>مراجعة</Text>
      </View>

      <View className='mx-4 rounded-md border-2 bg-secondary p-4'>
        {/* TODO: test whether provider is necessary */}
        {/* <FormProvider {...form}> */}
        <View className='flex-row'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Pressable
              key={idx}
              className='pe-0.5'
              onPress={() => handleRating(idx)}
            >
              {idx <= rating ? (
                <MaterialIcons name='star' size={28} color='#eab308' />
              ) : (
                <MaterialIcons name='star-border' size={28} color='#eab308' />
              )}
            </Pressable>
          ))}
        </View>

        <Controller
          control={form.control}
          name='message'
          render={({ field: { value, onChange, onBlur } }) => {
            return (
              <TextInput
                placeholder='اختر تقييم النجوم و اكتب مراجعة'
                className='text-xl'
                autoCorrect={false}
                autoCapitalize='none'
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )
          }}
        />

        <View className='flex-row justify-end gap-x-3'>
          <Pressable
            className='rounded-md bg-primary px-4 py-2 disabled:opacity-75'
            onPress={onSubmit}
            disabled={rating < 0 || addReview.isPending}
          >
            <Text className='text-xl text-white'>انشر</Text>
          </Pressable>
          <Pressable
            className='rounded-md bg-white px-4 py-2 shadow-sm'
            onPress={handleCloseForm}
            disabled={addReview.isPending}
          >
            <Text className='text-xl'>إلغاء</Text>
          </Pressable>
        </View>
        {/* </FormProvider> */}
      </View>
    </View>
  )
}
