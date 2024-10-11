import { FlashList } from '@shopify/flash-list'
import { keepPreviousData } from '@tanstack/react-query'
import { ActivityIndicator, Text, View } from 'react-native'

import ProductCard from '@/components/product/product-card'
import ProductCardSkeleton from '@/components/product/product-card-skeleton'
import useNavigationSearch from '@/hooks/use-navigation-search'
import type { RouterOutputs } from '@/utils/api'
import { api } from '@/utils/api'

export default function SearchScreen() {
  const query = useNavigationSearch({ searchBarOptions: { placeholder: 'البحث' } })

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    api.product.byQuery.useInfiniteQuery(
      { query, limit: 8 },
      {
        select: ({ pages }) => ({
          products: pages.flatMap((page) => page.products),
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        enabled: !!query,
      },
    )

  const products = data as RouterOutputs['product']['byQuery'] | undefined

  return (
    <View className='size-full px-6 pb-2 pt-4'>
      <FlashList
        data={products?.products}
        keyExtractor={({ id }) => id}
        estimatedItemSize={20}
        renderItem={({ item }) => <ProductCard product={item} />}
        ItemSeparatorComponent={() => <View className='h-6' />}
        ListEmptyComponent={
          isFetching ? (
            <>
              <ProductCardSkeleton />
              <View className='h-6' />
              <ProductCardSkeleton />
            </>
          ) : (
            <Text className='mt-4 text-center text-2xl font-semibold'>
              لا يوجد نتائج بحث
            </Text>
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
