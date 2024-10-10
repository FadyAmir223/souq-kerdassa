import { FontAwesome6 } from '@expo/vector-icons'
import type { Address } from '@repo/db/types'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import Toast from 'react-native-toast-message'

import { api } from '@/utils/api'

type DeleteAddressFormProps = {
  addressId: Address['id']
}

export default function DeleteAddressForm({ addressId }: DeleteAddressFormProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()

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

      Toast.show({
        type: 'error',
        text1: message,
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
  })

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <View className='flex-row items-center gap-x-1'>
          <Text className='text-xl font-bold'>حذف</Text>
          <FontAwesome6 name='trash-can' size={20} />
        </View>
      </Pressable>

      <Modal isVisible={isOpen} onBackdropPress={() => setOpen(false)}>
        <View className='m-8 rounded-md bg-white p-4 shadow-md'>
          <Text className='mb-6 text-2xl font-bold'>
            هل انت متأكد من حذف العنوان؟
          </Text>

          <View className='flex-row gap-x-3 self-end'>
            <Pressable
              className='me-4 w-20 rounded-md bg-primary px-4 py-2 shadow-sm'
              onPress={() => deleteAddress.mutate(addressId)}
            >
              <Text className='self-center text-xl font-bold text-white'>نعم</Text>
            </Pressable>
            <Pressable
              className='me-4 w-20 rounded-md border border-black bg-white px-4 py-2 shadow-sm'
              onPress={() => setOpen(false)}
            >
              <Text className='self-center text-xl text-black'>لا</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}
