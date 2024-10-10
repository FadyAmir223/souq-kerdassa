'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { AddressSchema } from '@repo/validators'
import { addressSchema } from '@repo/validators'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import type { RouterOutputs } from '@/trpc/react'
import { api } from '@/trpc/react'
import { PAGES, PLACEHOLDER, SEARCH_PARAMS } from '@/utils/constants'

import { areEqualShallow } from '../_utils/object-equal-shallow'

const labels = {
  add: {
    title: 'اضافة عنوان',
    description: 'سجل عنوانك حتى يصل إليك طلبك بكل سهولة',
    submit: 'اضف العنوان',
  },
  edit: {
    title: 'تعديل العنوان',
    description: 'حدث عنوانك حتى يصل إليك طلبك بكل سهولة',
    submit: 'تحديث العنوان',
  },
} as const

export const addressInputFields = [
  {
    type: 'text',
    label: 'المنطقة',
    name: 'region',
    placeholder: PLACEHOLDER.address.region,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'الشارع',
    name: 'street',
    placeholder: PLACEHOLDER.address.street,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'المبنى',
    name: 'building',
    placeholder: PLACEHOLDER.address.building,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'علامة مميزة',
    name: 'mark',
    placeholder: PLACEHOLDER.address.mark,
    autoComplete: 'off',
  },
] as const

type ActionAddressFormProps = {
  action: 'add' | 'edit'
  address?: RouterOutputs['user']['addresses']['all'][number]
}

export default function ActionAddressForm(props: { action: 'add' }): JSX.Element
export default function ActionAddressForm(props: {
  action: 'edit'
  address: RouterOutputs['user']['addresses']['all'][number]
}): JSX.Element

export default function ActionAddressForm({
  action,
  address,
}: ActionAddressFormProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: cities } = api.city.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          cityId: address.city.id,
          region: address.region,
          street: address.street,
          building: address.building,
          mark: address.mark,
        }
      : {
          cityId: -1,
          region: '',
          street: '',
          building: '',
          mark: '',
        },
  })

  const addAddress = api.user.addresses.add.useMutation({
    onMutate: async () => {
      setOpen(false)

      const formValues = form.getValues()
      const { id, name } = (cities ?? []).find(({ id }) => id === formValues.cityId)!

      const newAddress = {
        id: 'tz4a98xxat96iws9zmbrgj3a',
        city: { id, name },
        region: formValues.region,
        street: formValues.street,
        building: formValues.building,
        mark: formValues.mark,
      }
      form.reset()

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

      const redirectTo = searchParams.get(SEARCH_PARAMS.redirectTo)
      if (redirectTo === PAGES.protected.buy.checkout) router.refresh()
    },
    onError: ({ message }, _, ctx) => {
      utils.user.addresses.all.setData(undefined, ctx?.oldAddresses)

      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  const editAddress = api.user.addresses.edit.useMutation({
    onMutate: async () => {
      setOpen(false)

      await utils.user.addresses.all.cancel()
      const oldAddresses = utils.user.addresses.all.getData() ?? []

      const f = form.getValues()
      const newAddress = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        id: address?.id!,
        city: (cities ?? []).find(({ id }) => id === f.cityId)!,
        region: f.region,
        street: f.street,
        building: f.building,
        mark: f.mark,
      }

      const newAddresses = [
        newAddress,
        ...oldAddresses.filter(({ id }) => id !== address?.id),
      ]
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

  const onSubmit = (formData: AddressSchema) => {
    if (action === 'add') return addAddress.mutate(formData)

    if (!address) return
    if (
      areEqualShallow(formData, {
        cityId: address.city.id,
        region: address.region,
        street: address.street,
        building: address.building,
        mark: address.mark,
      })
    )
      return setOpen(false)
    editAddress.mutate({ ...formData, id: address.id })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {action === 'add' ? (
          <Button>{labels[action].title}</Button>
        ) : (
          <Button variant='none' size='none'>
            <div className='flex items-center gap-x-1'>
              <span className='select-none text-sm font-semibold'>تعديل</span>
              <FaEdit size={20} />
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{labels[action].title}</DialogTitle>
          <DialogDescription className='text-start'>
            {labels[action].description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-2'>
            <FormField
              control={form.control}
              name='cityId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المحافظة</FormLabel>
                  <Select
                    onValueChange={(n) => field.onChange(+n)}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='اختر محافظة' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities?.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {addressInputFields.map(({ name, label, ...props }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className='mb-1'>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      {/* @ts-expect-error TODO */}
                      <Input {...props} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter>
              <Button>{labels[action].submit}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
