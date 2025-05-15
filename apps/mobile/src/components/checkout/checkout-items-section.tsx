import { useCombinedStore } from '@repo/store/mobile'
import { Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import CheckoutCartItem from './checkout-cart-item'

export default function CheckoutItemsSection() {
  const { cart, getCartTotalPrice, shippingCost } = useCombinedStore(
    useShallow(({ cart, getCartTotalPrice, selectedAddress }) => ({
      cart,
      getCartTotalPrice,
      shippingCost: selectedAddress?.price ?? 0,
    })),
  )

  return (
    <View>
      <View className='gap-y-2'>
        {cart.map((item) => (
          <CheckoutCartItem
            key={item.id + item.season + item.category + item.size + item.color}
            item={item}
          />
        ))}
      </View>

      <View className='mt-5'>
        <View className='flex-row justify-between'>
          <Text className='text-xl font-bold'>الإجمالى</Text>
          <Text className='text-xl font-bold'>{getCartTotalPrice()} جنية</Text>
        </View>

        <View className='flex-row justify-between'>
          <Text className='text-xl font-bold'>الشحن</Text>
          <Text className='text-xl font-bold'>{shippingCost} جنية</Text>
        </View>

        <View className='mt-2 flex-row justify-between border-t border-t-black pt-2'>
          <Text className='text-xl font-bold'>الإجمالى</Text>
          <Text className='text-xl font-bold'>
            {getCartTotalPrice() + shippingCost} جنية
          </Text>
        </View>
      </View>
    </View>
  )
}
