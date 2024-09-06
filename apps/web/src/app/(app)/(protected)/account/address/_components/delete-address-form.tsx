import type { Address } from '@repo/db/types'
import { useState } from 'react'
import { FaTrashCan } from 'react-icons/fa6'

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

type DeleteAddressFormProps = {
  addressId: Address['id']
}

// TODO: change to
// https://ui.shadcn.com/docs/components/alert-dialog

export default function DeleteAddressForm({ addressId }: DeleteAddressFormProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const { toast } = useToast()

  const deleteAddress = api.user.addresses.delete.useMutation({
    onMutate: async () => {
      await utils.user.addresses.all.cancel()
      const oldAddresses = utils.user.addresses.all.getData() ?? []
      const newAddresses = oldAddresses.filter(({ id }) => id !== addressId)
      utils.user.addresses.all.setData(undefined, newAddresses)

      return { oldAddresses }
    },
    onError: ({ message }, _, ctx) => {
      utils.user.addresses.all.setData(undefined, ctx?.oldAddresses)

      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='none' size='none'>
            <div className='flex items-center gap-x-1'>
              <span className='select-none text-sm font-semibold'>حذف</span>
              <FaTrashCan className='text-destructive' size={20} />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>هل انت متأكد من حذف العنوان؟</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <DialogFooter>
            <Button
              className='me-4 min-w-16'
              variant='destructive'
              onClick={() => deleteAddress.mutate(addressId)}
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
    </>
  )
}
