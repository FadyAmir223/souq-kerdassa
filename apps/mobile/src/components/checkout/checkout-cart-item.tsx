import type { CartItem } from '@repo/store/types'
import { Text, View } from 'react-native'

import { cn } from '@/utils/cn'
import { AR } from '@/utils/constants'

import { Image } from '../image'

type CheckoutCartItemProps = {
  item: CartItem
}

export default function CheckoutCartItem({ item }: CheckoutCartItemProps) {
  return (
    <View
      className={cn(
        'relative flex-row gap-x-3 rounded-md bg-white p-2.5 shadow-sm',
        { 'opacity-50': item.quantity === 0 },
      )}
    >
      <View className='absolute left-0 top-0 z-20 size-6 items-center justify-center rounded-full bg-black'>
        <Text className='font-semibold text-white'>{item.quantity}</Text>
      </View>

      {item.overQuantity && (
        <View className='absolute left-7 top-0 z-20 size-6 items-center justify-center rounded-full bg-destructive'>
          <Text className='font-semibold text-white'>{item.overQuantity}</Text>
          <View className='absolute h-full w-0.5 rotate-45 bg-black' />
        </View>
      )}

      <View className='w-32 overflow-hidden rounded-md bg-neutral-500/50'>
        <Image
          source={{ uri: item.image }}
          resizeMode='cover'
          className='aspect-[83/100] w-full'
        />
      </View>

      <View className='flex-1 flex-row items-center justify-between'>
        <View>
          <Text className='mb-2 text-2xl'>{item.name}</Text>
          <View>
            <Text className='mb-1.5 w-20 rounded-md bg-primary px-2.5 py-0.5 text-center text-lg font-bold text-white'>
              {AR.season[item.season]}
            </Text>
          </View>
          <View>
            <Text className='mb-1.5 w-20 rounded-md bg-sky-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
              {AR.category[item.category]}
            </Text>
          </View>
        </View>
        <Text className='text-2xl font-bold'>{item.price} جنية</Text>
      </View>
    </View>
  )
}
