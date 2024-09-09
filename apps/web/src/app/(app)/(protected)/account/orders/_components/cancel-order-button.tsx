'use client'

import type { Order } from '@repo/db/types'
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

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
import { api } from '@/trpc/react'

type CancelOrderButtonProps = {
  orderId: Order['id']
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const { toast } = useToast()

  const cancelOrder = api.order.cancel.useMutation({
    onMutate: async () => {
      setOpen(false)

      await utils.order.all.cancel()
      const oldOrder = utils.order.all.getData() ?? []
      const newOrder = oldOrder.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order,
      )
      utils.order.all.setData(undefined, newOrder)

      return { oldOrder }
    },
    onError: ({ message }, _, ctx) => {
      utils.order.all.setData(undefined, ctx?.oldOrder)

      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <div className='flex items-center gap-x-1'>
            <IoClose className='text-destructive' size={20} />
            <span className='select-none text-sm font-semibold'>إلغاء الطلب</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>هل انت متأكد من إلغاء الطلب؟</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogFooter>
          <Button
            className='me-4 min-w-16'
            variant='destructive'
            onClick={() => cancelOrder.mutate(orderId)}
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
