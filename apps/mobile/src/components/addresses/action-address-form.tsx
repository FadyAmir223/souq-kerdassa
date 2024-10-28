import { Entypo, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import type { RouterOutputs } from '@repo/api'
import type { AddressSchema } from '@repo/validators'
import { addressSchema } from '@repo/validators'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Modal, Platform, Pressable, Text, TextInput, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import Toast from 'react-native-toast-message'

import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { PLACEHOLDER } from '@/utils/constants'
import { areEqualShallow } from '@/utils/helpers/object-equal-shallow'

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

export const inputs = [
  {
    label: 'المنطقة',
    name: 'region',
    placeholder: PLACEHOLDER.address.region,
  },
  {
    label: 'الشارع',
    name: 'street',
    placeholder: PLACEHOLDER.address.street,
  },
  {
    label: 'المبنى',
    name: 'building',
    placeholder: PLACEHOLDER.address.building,
  },
  {
    label: 'علامة مميزة',
    name: 'mark',
    placeholder: PLACEHOLDER.address.mark,
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

  const { data: cities } = api.city.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const {
    getValues,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<AddressSchema>({
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

      const formValues = getValues()
      const { id, name } = (cities ?? []).find(({ id }) => id === formValues.cityId)!

      const newAddress = {
        id: 'tz4a98xxat96iws9zmbrgj3a',
        city: { id, name },
        region: formValues.region,
        street: formValues.street,
        building: formValues.building,
        mark: formValues.mark,
      }
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

      Toast.show({
        type: 'error',
        text1: message,
        text1Style: { fontSize: 18, textAlign: 'left' },
        position: 'bottom',
      })
    },
  })

  const editAddress = api.user.addresses.edit.useMutation({
    onMutate: async () => {
      setOpen(false)

      await utils.user.addresses.all.cancel()
      const oldAddresses = utils.user.addresses.all.getData() ?? []

      const f = getValues()
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

      Toast.show({
        type: 'error',
        text1: message,
        text1Style: { fontSize: 18, textAlign: 'left' },
        position: 'bottom',
      })
    },
  })

  const handleSubmit = async () => {
    const result = await trigger()
    if (!result) return

    const formData = getValues()

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
    <>
      {action === 'add' ? (
        <Pressable
          className='mb-4 self-end rounded-md bg-primary px-4 py-2 shadow active:scale-[0.98]'
          onPress={() => setOpen(true)}
        >
          <Text className='text-xl font-bold text-white'>
            {labels[action].title}
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => setOpen(true)}>
          <View className='flex-row items-center gap-x-1'>
            <Text className='text-xl font-bold'>تعديل</Text>
            <FontAwesome name='edit' size={20} />
          </View>
        </Pressable>
      )}

      <Modal
        animationType='slide'
        visible={isOpen}
        onRequestClose={() => setOpen(false)}
      >
        <View className='m-5 rounded-md bg-white p-4 shadow-md'>
          <Pressable className='ios:mt-6' onPress={() => setOpen(false)}>
            <Ionicons name='close' size={Platform.OS === 'android' ? 24 : 30} />
          </Pressable>

          <Text className='self-start text-2xl font-bold'>
            {labels[action].title}
          </Text>
          <Text className='mb-4 self-start text-xl font-bold text-muted-foreground'>
            {labels[action].description}
          </Text>

          <View className='gap-y-2.5'>
            <Controller
              control={control}
              name='cityId'
              render={({ field: { value, onChange } }) => (
                <View>
                  <Text className='mb-2 self-start text-2xl font-semibold'>
                    المحافظة
                  </Text>

                  <SelectDropdown
                    data={cities ?? []}
                    defaultValue={cities?.find(({ id }) => id === value)}
                    onSelect={(selectedItem) => onChange(selectedItem.id)}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <View className='mb-1 h-12 w-full flex-row items-center justify-between rounded-md border border-black px-4 py-1.5'>
                          <FontAwesome6
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            size={18}
                          />
                          <Text className='text-xl font-bold'>
                            {selectedItem?.name}
                          </Text>
                        </View>
                      )
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <View
                          className={cn(
                            'mx-2 flex-row items-center justify-between rounded-md px-3 py-2',
                            { 'bg-primary/5': isSelected },
                          )}
                        >
                          {isSelected && (
                            <Entypo name='check' size={18} color='#c82d2d' />
                          )}
                          <Text
                            className={cn('ms-auto text-xl font-semibold', {
                              'text-primary': isSelected,
                            })}
                          >
                            {item.name}
                          </Text>
                        </View>
                      )
                    }}
                    showsVerticalScrollIndicator={false}
                  />

                  <Text className='h-6 self-start text-xl font-semibold text-destructive'>
                    {errors.cityId?.message}
                  </Text>
                </View>
              )}
            />

            {inputs.map(({ name, label, ...props }) => (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field: { value, onChange, onBlur } }) => (
                  <View>
                    <Text className='mb-2 self-start text-2xl font-semibold'>
                      {label}
                    </Text>
                    <TextInput
                      className='mb-1 w-full rounded-md border border-black px-4 py-1.5 text-right text-2xl'
                      value={value ?? undefined}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCorrect={false}
                      autoCapitalize='none'
                      {...props}
                    />
                    <Text className='h-6 self-start text-xl font-semibold text-destructive'>
                      {errors[name]?.message}
                    </Text>
                  </View>
                )}
              />
            ))}

            <Pressable
              className='self-start rounded-md bg-primary px-4 py-2 shadow-md disabled:opacity-60'
              onPress={handleSubmit}
            >
              <Text className='text-2xl text-white'>{labels[action].submit}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}
