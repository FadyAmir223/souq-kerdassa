import { zodResolver } from '@hookform/resolvers/zod'
import type { AddressSchema } from '@repo/validators'
import { addressSchema } from '@repo/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEdit } from 'react-icons/fa'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import type { RouterOutputs } from '@/trpc/react'
import { api } from '@/trpc/react'

import { addressInputFields } from '../_constants/address-input-fields'
import { areEqualShallow } from '../_utils/object-equal-shallow'

type EditAddressFormProps = {
  address: RouterOutputs['user']['addresses']['all'][number]
}

export default function EditAddressForm({ address }: EditAddressFormProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const { toast } = useToast()

  const { id: addressId, ...addressData } = address

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressData,
  })

  const editAddress = api.user.addresses.edit.useMutation({
    onMutate: async () => {
      setOpen(false)

      await utils.user.addresses.all.cancel()
      const oldAddresses = utils.user.addresses.all.getData() ?? []
      const newAddress = { ...getValues(), id: addressId }
      const newAddresses = [
        newAddress,
        ...oldAddresses.filter(({ id }) => id !== addressId),
      ]
      utils.user.addresses.all.setData(undefined, newAddresses)

      return { oldAddresses }
    },
    onError: (error, _, ctx) => {
      utils.user.addresses.all.setData(undefined, ctx?.oldAddresses)

      // if form would still be visible we would check for edge cases validations
      // error.data?.zodError?.fieldErrors

      toast({
        variant: 'destructive',
        description: error.message,
      })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='none' size='none'>
          <FaEdit className='size-[1.375rem]' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>اضافة عنوان جديد</DialogTitle>
          <DialogDescription>
            سجل عنوانك حتى يصل إليك طلبك بكل سهولة
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((formData) => {
            if (areEqualShallow(formData, addressData)) return setOpen(false)
            editAddress.mutate({ ...formData, id: addressId })
          })}
          className='space-y-2'
        >
          {addressInputFields.map(({ name, label, ...props }) => (
            <div key={name} className='grid'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>{label}</Label>
                <div className='col-span-3'>
                  <p className='h-[1.21875rem] text-[0.8rem] font-medium text-destructive'>
                    {errors[name]?.message}
                  </p>
                  <Input {...register(name)} {...props} />
                </div>
              </div>
            </div>
          ))}

          <DialogFooter>
            <Button>اضف العنوان</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
