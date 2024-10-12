import { FontAwesome } from '@expo/vector-icons'
import { useCombinedStore } from '@repo/store/mobile'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import Toast from 'react-native-toast-message'
import { useShallow } from 'zustand/react/shallow'

import { api } from '@/utils/api'
import { SEARCH_PARAMS } from '@/utils/constants'

import CheckoutAddresses from './checkout-addresses'

export default function CheckoutAddressSelection() {
  const [isOpen, setOpen] = useState(true)
  const router = useRouter()
  const utils = api.useUtils()

  const {
    cart,
    getCartTotalQuantity,
    updateOverQuantities,
    selectedAddress,
    setSelectedAddress,
  } = useCombinedStore(
    useShallow(
      ({
        cart,
        getCartTotalQuantity,
        updateOverQuantities,
        selectedAddress,
        setSelectedAddress,
      }) => ({
        cart,
        getCartTotalQuantity,
        updateOverQuantities,
        selectedAddress,
        setSelectedAddress,
      }),
    ),
  )

  const createOrder = api.order.create.useMutation({
    onSuccess: () => {
      setOpen(true)
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: error.message,
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })

      // @ts-expect-error impossible typing
      const soldOutVariants = error.data?.cause?.soldOutVariants
      if (soldOutVariants) updateOverQuantities(soldOutVariants)
    },
  })

  const handleCreateOrder = () => {
    if (selectedAddress === null) return setSelectedAddress(undefined)
    if (selectedAddress === undefined) return

    createOrder.mutate({
      address: selectedAddress,
      cart,
    })
  }

  const handlePurchaseSuccess = () => {
    void utils.order.all.invalidate()
    router.replace(`/orders?${SEARCH_PARAMS.redirectedFrom}=/checkout`)
  }

  return (
    <>
      <View className='mb-16'>
        <Text className='mb-2 text-2xl font-bold'>اختر عنوان التوصيل</Text>

        <CheckoutAddresses />
      </View>

      <View className='mb-10'>
        {getCartTotalQuantity() > 0 ? (
          <Pressable
            className='min-w-32 self-center rounded-md bg-primary px-4 py-2 shadow-md'
            onPress={handleCreateOrder}
            disabled={createOrder.isPending}
          >
            <Text className='text-center text-2xl text-white'>شراء</Text>
          </Pressable>
        ) : (
          <Text className='text-center text-2xl font-bold'>
            عذراً لقد نفذت الكمية من كل المنتجات المطلوبة
          </Text>
        )}
      </View>

      <Modal isVisible={isOpen} onBackdropPress={() => setOpen(false)}>
        <View className='rounded-md bg-white p-4 shadow-md'>
          <View className='items-center'>
            <FontAwesome name='check-circle' size={80} color='#15803d' />
            <Text className='mt-8 text-center text-2xl font-bold'>
              تم تأكيد الطلب بنجاح
            </Text>
            <Text className='text-center text-xl text-muted-foreground'>
              شكراً للتسوق معنا
            </Text>
          </View>

          <Pressable
            className='mt-6 self-center rounded-md bg-primary px-4 py-2 shadow-sm'
            onPress={handlePurchaseSuccess}
          >
            <Text className='text-xl font-bold text-white'>تتبع الطلب</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  )
}
