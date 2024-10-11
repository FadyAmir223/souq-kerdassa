import { Ionicons } from '@expo/vector-icons'
import type { Order } from '@repo/db/types'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import Toast from 'react-native-toast-message'

import { api } from '@/utils/api'

type CancelOrderButtonProps = {
  orderId: Order['id']
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [isOpen, setOpen] = useState(false)
  const utils = api.useUtils()

  const cancelOrder = api.order.cancel.useMutation({
    onMutate: async () => {
      setOpen(false)

      await utils.order.all.cancel()
      const oldOrder = utils.order.all.getData() ?? []
      const newOrder = oldOrder.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order,
      )
      utils.order.all.setData(undefined, newOrder)

      return { oldOrder }
    },
    onError: ({ message }, _, ctx) => {
      utils.order.all.setData(undefined, ctx?.oldOrder)

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
          <Ionicons name='close' size={20} color='#c82d2d' />
          <Text className='text-xl font-bold'>إلغاء الطلب</Text>
        </View>
      </Pressable>

      <Modal isVisible={isOpen} onBackdropPress={() => setOpen(false)}>
        <View className='m-8 rounded-md bg-white p-4 shadow-md'>
          <Text className='mb-6 text-2xl font-bold'>
            هل انت متأكد من إلغاء الطلب؟
          </Text>

          <View className='flex-row gap-x-3 self-end'>
            <Pressable
              className='me-4 w-20 rounded-md bg-primary px-4 py-2 shadow-sm'
              onPress={() => cancelOrder.mutate(orderId)}
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
