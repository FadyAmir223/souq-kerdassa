import type { ProductsByFiltersSchema } from '@repo/validators'
import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'

import { api } from '@/utils/api'

import ProductCard from './product-card'
import ProductCardSkeleton from './product-card-skeleton'

type ProductMiniListProps = {
  filter: ProductsByFiltersSchema
}

export default function ProductMiniList({ filter }: ProductMiniListProps) {
  const { data: products, isLoading } = api.product.byFilter.useQuery({
    ...filter,
    limit: 6,
  })

  if (isLoading)
    return (
      <FlashList
        data={Array(3).fill(null)}
        keyExtractor={(_, i) => i.toString()}
        estimatedItemSize={3}
        renderItem={({ index }) => <ProductCardSkeleton key={index} />}
        ItemSeparatorComponent={() => <View className='h-6' />}
        showsVerticalScrollIndicator={false}
      />
    )

  return (
    <FlashList
      data={products?.products}
      keyExtractor={({ id }) => id}
      estimatedItemSize={6}
      renderItem={({ item }) => <ProductCard product={item} />}
      ItemSeparatorComponent={() => <View className='h-6' />}
      showsVerticalScrollIndicator={false}
    />
  )
}
