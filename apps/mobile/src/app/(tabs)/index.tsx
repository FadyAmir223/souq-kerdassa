import type { ProductsByFiltersSchema } from '@repo/validators'
import { Link } from 'expo-router'
import { FlatList, Text, View } from 'react-native'

import ProductMiniList from '@/components/product/product-mini-list'

const seasonProducts = [
  // @ts-expect-error page & limit has default
  { label: 'احدث المنتجات', filter: { type: 'latest', limit: 8 } },
  // @ts-expect-error page & limit has default
  { label: 'منتجات الصيف', filter: { season: 'summer' } },
  // @ts-expect-error page & limit has default
  { label: 'منتجات الشتاء', filter: { season: 'winter' } },
] satisfies {
  label: string
  filter: ProductsByFiltersSchema
}[]

export default function HomeScreen() {
  return (
    <View className='px-6 py-4'>
      <FlatList
        data={seasonProducts}
        keyExtractor={({ label }) => label}
        renderItem={({ item: { label, filter } }) => (
          <View className='gap-4'>
            <View className='flex-1'>
              <View className='mb-4 flex-row items-center justify-between'>
                <Text className='text-2xl font-bold'>{label}</Text>

                <Link
                  href={`/products?${Object.keys(filter)[0]}=${Object.values(filter)[0]}`}
                  className='text-xl font-semibold text-primary'
                >
                  عرض الكل
                </Link>
              </View>

              {/* @ts-expect-error ... */}
              <ProductMiniList filter={filter} />
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className='h-10' />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
