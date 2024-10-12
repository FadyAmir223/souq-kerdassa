import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'

import ProductCard from '@/components/product/product-card'
import ProductCardSkeleton from '@/components/product/product-card-skeleton'
import FilterDrawer from '@/components/products/filter-drawer'
import type { ProductFilterParams } from '@/types/product'
import type { RouterOutputs } from '@/utils/api'
import { api } from '@/utils/api'

/**
 * if searchParams are sent initially from another page
 * (which shouldn't since there is no footer)
 * TODO: replace useLocalSearchParams with useState
 */

export default function ProductsScreen() {
  const searchParams = useLocalSearchParams<ProductFilterParams>()

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    api.product.byFilter.useInfiniteQuery(
      {
        page: -1,
        limit: +(searchParams.limit ?? 10),
        type: searchParams.type,
        season: searchParams.season,
        category: searchParams.category,
      },
      {
        select: ({ pages }) => ({
          products: pages.flatMap((page) => page.products),
          total: 0,
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: Infinity,
      },
    )

  const products = data as RouterOutputs['product']['byFilter'] | undefined

  return (
    <View className='size-full px-6 pb-2 pt-4'>
      <FlashList
        data={products?.products}
        keyExtractor={({ id }) => id}
        estimatedItemSize={6}
        renderItem={({ item }) => <ProductCard product={item} />}
        ItemSeparatorComponent={() => <View className='h-6' />}
        ListHeaderComponent={<FilterDrawer />}
        ListEmptyComponent={
          isFetching ? (
            <>
              <ProductCardSkeleton />
              <View className='h-6' />
              <ProductCardSkeleton />
            </>
          ) : (
            <View className='flex-row'>
              <Text className='text-center text-xl font-semibold'>
                لا يوجد منتجات
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          <View className='h-24 flex-row items-center justify-center'>
            {isFetchingNextPage && <ActivityIndicator />}
          </View>
        }
        onEndReached={() => {
          if (hasNextPage) void fetchNextPage()
        }}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
