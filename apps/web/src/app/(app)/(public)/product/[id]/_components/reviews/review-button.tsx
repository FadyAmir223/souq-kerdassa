'use client'

import type { Product } from '@repo/db/types'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useAppStore } from '@/providers/app-store-provider'
import { api } from '@/trpc/react'

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
  const { isReviewing, setReviewing } = useAppStore(
    useShallow(({ isReviewing, setReviewing }) => ({ isReviewing, setReviewing })),
  )

  return (
    <Button
      variant='outline'
      onClick={() => setReviewing(true)}
      disabled={isReviewing}
      className='rounded-full'
    >
      اضف مراجعة
    </Button>
  )
}

function DeleteReviewButton({ productId, reviewPage }: ReviewButtonProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const user = useCurrentUser()
  const { toast } = useToast()

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

      toast({
        description: 'تم مسح مراجعتك',
        variant: 'success',
      })
    },
    onError: ({ message }) => {
      toast({
        description: message,
        variant: 'destructive',
      })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='rounded-full'>
          امسح مراجعتك
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>هل انت متأكد من مسح المراجعة</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogFooter className='flex gap-4'>
          <Button
            className='min-w-16'
            variant='destructive'
            onClick={() => deleteReview.mutate(productId)}
            disabled={deleteReview.isPending}
          >
            نعم
          </Button>
          <Button
            variant='outline'
            className='min-w-16'
            onClick={() => setOpen(false)}
          >
            لا
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
