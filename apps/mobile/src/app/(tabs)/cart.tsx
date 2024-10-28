import { ScrollView, Text, View } from 'react-native'

import deliveryIcon from '@/assets/images/icons/delivery.png'
import paymentIcon from '@/assets/images/icons/payment.png'
import qualityIcon from '@/assets/images/icons/quality.png'
import returnIcon from '@/assets/images/icons/return.png'
import { CartTotalPrice } from '@/components/cart/cart-info'
import CartItems from '@/components/cart/cart-items'
import { Image } from '@/components/image'

const iconsSection = [
  { image: deliveryIcon, label: '3 ايام التوصيل مجانى' },
  { image: returnIcon, label: 'ضمان استعادة الاموال' },
  { image: qualityIcon, label: 'منتجات مضمونة 100%' },
  { image: paymentIcon, label: 'دفع آمن' },
]

export default function CartPage() {
  return (
    <ScrollView>
      <View className='px-6 pb-2 pt-4'>
        <CartItems />

        <View className='mt-10'>
          <View className='flex-row justify-between rounded-md bg-white p-3'>
            <Text className='text-xl font-semibold'>الإجمالى</Text>
            <Text className='text-xl font-semibold'>
              <CartTotalPrice /> جنية + الشحن
            </Text>
          </View>

          <View className='ios:border ios:border-black mb-14 mt-4 flex-row flex-wrap justify-between rounded-md bg-white'>
            {iconsSection.map(({ image, label }) => (
              <View key={label} className='w-1/2 p-2'>
                <Image source={image} className='mx-auto w-14' />
                <Text className='text-center text-xl'>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
