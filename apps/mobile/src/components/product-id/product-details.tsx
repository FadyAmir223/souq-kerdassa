import type { Product } from '@repo/db/types'
import { Fragment } from 'react'
import { Text, View } from 'react-native'

import { api } from '@/utils/api'

import AddToCart from './add-to-cart'
import { ReviewsCount, ReviewsRating } from './reviews-info'

type ProductDetailsProps = {
  productId: Product['id']
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { data: product } = api.product.byId.useQuery(productId)

  if (!product) return null

  return (
    <Fragment>
      <Text className='mb-3 mt-7 self-start text-4xl font-bold'>{product.name}</Text>
      <View className='mb-3 flex-row items-center gap-x-4'>
        <Text className='text-2xl text-primary'>
          <ReviewsCount productId={productId} />
        </Text>
        <ReviewsRating productId={productId} />
      </View>

      <AddToCart product={product} />

      <View className='mt-8'>
        <Text className='ios:self-start mb-3 mt-10 text-3xl font-bold text-primary'>
          الوصف
        </Text>
        <Text className='text-xl font-semibold'>{product.description}</Text>
      </View>
    </Fragment>
  )
}
