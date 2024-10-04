import { Image, Text, View } from 'react-native'

import qualityImage from '@/assets/images/icons/quality.png'
import returnImage from '@/assets/images/icons/return.png'

import ProductRelates from './product-relates'

export default function ProductSidebar() {
  return (
    <View className='mb-10'>
      <View className='mt-10 gap-y-2 rounded-lg bg-white p-4'>
        <View className='flex-row items-center gap-x-2'>
          <Image source={qualityImage} />
          <Text className='text-2xl font-semibold'>سياسة الإرجاع لمدة 7 ايام</Text>
        </View>
        <View className='flex-row items-center gap-x-2'>
          <Image source={returnImage} />
          <Text className='text-2xl font-semibold'>منتجات اصلية 100%</Text>
        </View>
      </View>

      <View className='mt-8'>
        <Text className='mb-3 text-center text-3xl font-bold'>مقترحة لك</Text>

        <View className='gap-y-4'>
          <ProductRelates />
        </View>
      </View>
    </View>
  )
}
