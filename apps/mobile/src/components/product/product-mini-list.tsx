import type { ProductsByFiltersSchema } from '@repo/validators'
import { FlatList, View } from 'react-native'

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
      <FlatList
        data={Array(5).fill(null)}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ index }) => <ProductCardSkeleton key={index} />}
        ItemSeparatorComponent={() => <View className='h-6' />}
        showsVerticalScrollIndicator={false}
      />
    )

  return (
    <FlatList
      data={products?.products}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => <ProductCard product={item} />}
      ItemSeparatorComponent={() => <View className='h-6' />}
      showsVerticalScrollIndicator={false}
    />
  )
}
