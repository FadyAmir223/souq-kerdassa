import { zodResolver } from '@hookform/resolvers/zod'
import type { Product } from '@repo/db/types'
import type { ReviewSchema } from '@repo/validators'
import { reviewSchema } from '@repo/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdStar, MdStarBorder } from 'react-icons/md'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useAppStore } from '@/providers/app-store-provider'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

type AddReviewFormProps = {
  productId: Product['id']
  setReviewPage: (newPage: number) => void
}

const initRating = { value: -1, fixed: false }

export default function AddReviewForm({
  productId,
  setReviewPage,
}: AddReviewFormProps) {
  const [rating, setRating] = useState(initRating)
  const user = useCurrentUser()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { isReviewing, setReviewing } = useAppStore(
    useShallow(({ isReviewing, setReviewing }) => ({ isReviewing, setReviewing })),
  )

  const { register, handleSubmit, getValues, setValue, reset } =
    useForm<ReviewSchema>({
      resolver: zodResolver(reviewSchema),
      defaultValues: {
        message: '',
        rating: initRating.value,
      },
    })

  const handleCloseForm = () => {
    setReviewing(false)
    setRating(initRating)
    reset()
  }

  const addReview = api.product.review.add.useMutation({
    onSuccess: async () => {
      if (getValues('message')) {
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

      toast({
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  if (!user) return null

  const handleRating = (newRating: number, fixed = false) => {
    if (rating.fixed && (newRating <= initRating.value || !fixed)) return

    setRating({ value: newRating, fixed })
    setValue('rating', newRating + 1)
  }

  return (
    <div
      className={cn('rounded-md bg-white p-4 shadow-sm', {
        hidden: !isReviewing,
      })}
    >
      <div className='mb-1 text-start'>
        <span className='block font-semibold'>{user.name}</span>
        <span className='text-sm text-gray-500'>مراجعة</span>
      </div>

      <form
        onSubmit={handleSubmit((formData) =>
          addReview.mutate({
            productId,
            review: formData,
          }),
        )}
        className='mx-4 rounded-md border-2 bg-secondary p-4 focus-within:border-primary'
      >
        <div className='mb-2 flex cursor-pointer'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className='[&:not(:last-child)]:pe-0.5'
              onMouseEnter={() => handleRating(idx)}
              onMouseLeave={() => handleRating(initRating.value)}
              onClick={() => handleRating(idx, true)}
            >
              {idx <= rating.value ? (
                <MdStar className='size-7 text-yellow-500' />
              ) : (
                <MdStarBorder className='size-7 text-yellow-500' />
              )}
            </div>
          ))}
        </div>

        <Textarea
          placeholder='اختر تقييم النجوم و اكتب مراجعة'
          className='min-h-full border-0 p-0 shadow-none focus-visible:ring-0'
          {...register('message')}
        />

        <div className='flex justify-end gap-x-3'>
          <Button disabled={!rating.fixed || addReview.isPending}>انشر</Button>
          <Button
            variant='outline'
            onClick={handleCloseForm}
            disabled={addReview.isPending}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
