'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { AddressSchema } from '@repo/validators'
import { addressSchema } from '@repo/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
import { api } from '@/trpc/react'

import { addressInputFields } from '../_constants/address-input-fields'

export default function AddAddressForm() {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: '',
      region: '',
      street: '',
      building: '',
      mark: '',
    },
  })

  const addAddress = api.user.addresses.add.useMutation({
    onMutate: async () => {
      setOpen(false)

      const newAddress = { id: 'tz4a98xxat96iws9zmbrgj3a', ...getValues() }
      reset()

      await utils.user.addresses.all.cancel()
      const oldAddresses = utils.user.addresses.all.getData() ?? []
      const newAddresses = [newAddress, ...oldAddresses]
      utils.user.addresses.all.setData(undefined, newAddresses)

      return { oldAddresses }
    },
    onSuccess: (newAddress) => {
      utils.user.addresses.all.setData(undefined, (newAddresses) => [
        newAddress,
        ...(newAddresses ?? []).slice(1),
      ])
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>اضافة عنوان جديد</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>اضافة عنوان جديد</DialogTitle>
          <DialogDescription>
            سجل عنوانك حتى يصل إليك طلبك بكل سهولة
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((formData) => addAddress.mutate(formData))}
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
                  <Input className='border-black' {...register(name)} {...props} />
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
