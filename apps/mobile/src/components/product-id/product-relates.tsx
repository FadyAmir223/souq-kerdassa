import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import { api } from '@/utils/api'

import { Image } from '../image'
import StarRating from '../product/star-rating'
import RecommendedProductSkeleton from './recommended-product-skeleton'

export default function ProductRelates() {
  const { data: recommendedProducts, isLoading } = api.product.similar.useQuery(2)

  if (isLoading)
    return (
      <>
        <RecommendedProductSkeleton />
        <RecommendedProductSkeleton />
      </>
    )

  return recommendedProducts?.map((product) => (
    <Link
      key={product.id}
      href={{ pathname: '/product/[id]', params: { id: product.id } }}
      asChild
    >
      <Pressable className='h-36 flex-row justify-between gap-x-2 gap-y-3 rounded-md bg-white p-2 shadow'>
        <View className='aspect-[83/100] overflow-hidden rounded-md bg-neutral-500/50'>
          <Image
            source={{ uri: product.image }}
            resizeMode='cover'
            className='aspect-[83/100] w-full'
          />
        </View>

        <View className='flex-1 px-2 py-3.5'>
          <Text className='self-start text-2xl font-bold'>{product.name}</Text>

          <View className='my-1 flex-row items-center gap-x-2'>
            <StarRating rating={product.rating} />
            <Text className='text-xl'>({product.reviewsCount})</Text>
          </View>

          <Text className='self-start text-xl font-semibold text-primary/90'>
            {product.price} جنية
          </Text>
        </View>
      </Pressable>
    </Link>
  ))
}
