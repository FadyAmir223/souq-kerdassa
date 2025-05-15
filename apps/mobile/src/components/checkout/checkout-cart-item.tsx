import { MaterialIcons } from '@expo/vector-icons'
import type { CartItem } from '@repo/store/types'
import { Text, View } from 'react-native'

import { cn } from '@/utils/cn'
import { AR } from '@/utils/constants'
import { invertColor } from '@/utils/helpers/invert-number'

import { Image } from '../image'

type CheckoutCartItemProps = {
  item: CartItem
}

export default function CheckoutCartItem({ item }: CheckoutCartItemProps) {
  return (
    <View
      key={item.id + item.season + item.category + item.size + item.color}
      className='ios:border ios:border-black gap-y-2 rounded-md bg-white p-3'
    >
      <View className='flex-row gap-x-5'>
        <View className='w-32'>
          <Image
            source={{ uri: item.image }}
            className='aspect-[83/100] w-full'
            resizeMode='cover'
          />
        </View>

        <View className='self-center'>
          <Text className='mb-2.5 text-3xl font-semibold'>{item.name}</Text>
          <View className='w-20 gap-y-2'>
            <Text className='rounded-md bg-primary px-2.5 py-0.5 text-center text-lg font-bold text-white'>
              {AR.season[item.season]}
            </Text>
            <Text className='mb-1.5 rounded-md bg-sky-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
              {AR.category[item.category]}
            </Text>
            <View className='flex-row gap-x-2'>
              <Text className='w-24 rounded-md bg-indigo-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                الحجم {item.size}
              </Text>
              <Text
                className='w-14 rounded-md px-2.5 py-0.5 text-center text-lg font-bold text-white'
                style={{ backgroundColor: item.color }}
              >
                <MaterialIcons
                  name='colorize'
                  size={20}
                  style={{ color: invertColor(item.color) }}
                />
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className='flex-row gap-x-2'>
        <Text
          className={cn('ios:self-start text-2xl font-semibold text-primary', {
            'text-primary/60 line-through': item.discount,
          })}
        >
          {item.price}
        </Text>

        {!!item.discount && (
          <Text className='ios:self-start text-2xl font-semibold text-primary'>
            {item.discount}
          </Text>
        )}

        <Text className='ios:self-start text-2xl font-semibold text-primary'>
          جنية
        </Text>
      </View>
    </View>
  )
}
