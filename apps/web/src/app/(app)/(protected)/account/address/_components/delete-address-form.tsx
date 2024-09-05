import type { Address } from '@repo/db/types'
import { FaTrashCan } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/trpc/react'

type DeleteAddressFormProps = {
  addressId: Address['id']
}

export default function DeleteAddressForm({ addressId }: DeleteAddressFormProps) {
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
    <Button
      variant='none'
      size='none'
      onClick={() => deleteAddress.mutate(addressId)}
    >
      <FaTrashCan className='size-[1.375rem] text-destructive' />
    </Button>
  )
}
