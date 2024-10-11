import type { RouterOutputs } from '@repo/api'
import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import { Image } from '@/components/image'

import StarRating from './star-rating'

type ProductCardProps = {
  product: RouterOutputs['product']['byFilter']['products'][number]
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, rating, image, reviewsCount } = product

  return (
    <Link
      href={{ pathname: '/product/[id]', params: { id: product.id } }}
      asChild
      className='size-full flex-1'
    >
      <Pressable className='overflow-hidden rounded-lg shadow-lg'>
        <View className='bg-neutral-500/50'>
          <Image
            source={{ uri: image }}
            resizeMode='cover'
            className='aspect-[83/100] w-full'
          />
        </View>

        <View className='bg-white p-3'>
          <Text className='text-center text-2xl font-bold'>{name}</Text>
          <View className='my-2 flex-row items-center justify-center space-x-2'>
            <StarRating rating={rating} />
            <Text className='text-lg'>({reviewsCount})</Text>
          </View>

          <Text className='text-center text-2xl font-bold text-primary'>
            {price} جنية
          </Text>
        </View>
      </Pressable>
    </Link>
  )
}
