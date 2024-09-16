import type { Product } from '@repo/db/types'
import type { AdminProductStatusSchema } from '@repo/validators'
import { useState } from 'react'

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

type DeleteProductAdminProps = {
  productId: Product['id']
  currPage: number
  setCurrPage: (newCurrPage: number) => void
  activeTab: AdminProductStatusSchema
  totalProducts: number
}

export default function DeleteProductAdmin({
  productId,
  currPage,
  setCurrPage,
  activeTab,
  totalProducts,
}: DeleteProductAdminProps) {
  const [isOpen, setOpen] = useState(false)
  const { toast } = useToast()
  const utils = api.useUtils()

  const deleteProduct = api.product.admin.delete.useMutation({
    onSuccess: () => {
      const newTotalProducts = totalProducts - 1
      const newCurrPage = Math.min(currPage, Math.ceil(newTotalProducts / 10))
      void utils.product.admin.all.invalidate({
        page: newCurrPage,
        limit: 10,
        visibility: activeTab,
      })
      utils.product.admin.count.setData(activeTab, newTotalProducts)

      if (newCurrPage !== currPage) setCurrPage(newCurrPage)
      setOpen(false)
    },
    onError: ({ message }) => {
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger onClick={(e) => e.stopPropagation()} className='flex-1'>
        <span className='block px-2 py-1.5'>حذف</span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>هل انت متأكد من حذف المنتج</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogFooter>
          <Button
            className='me-4 min-w-16'
            variant='destructive'
            onClick={() => deleteProduct.mutate(productId)}
            disabled={deleteProduct.isPending}
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
