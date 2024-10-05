import type { RouterOutputs } from '@repo/api'
import type { Category, Season } from '@repo/db/types'
import { useCombinedStore } from '@repo/store/mobile'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { AR } from '@/utils/constants'

type AddToCartProps = {
  product: NonNullable<RouterOutputs['product']['byId']>
}

export default function AddToCart({ product }: AddToCartProps) {
  const seasons: Season[] = Array.from(
    new Set(
      product.variants
        .filter((variant) => variant.stock !== 0)
        .map((variant) => variant.season),
    ),
  )

  const [selectedSeason, setSelectedSeason] = useState<Season | null>(seasons[0]!)

  const variants = product.variants
    .filter((variant) => variant.season === selectedSeason && variant.stock !== 0)
    .sort((a, b) => (a.category as string).localeCompare(b.category))

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    variants[0]?.category,
  )

  const addCartItem = useCombinedStore((s) => s.addCartItem)

  if (variants.length === 0)
    return (
      <p className='mt-4 text-lg font-bold md:text-center'>
        هذا المنتج غير متوفر حالياً
      </p>
    )

  const handleAddCartItem = () => {
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]!,
      variantId:
        variants.find(
          ({ season, category }) =>
            season === selectedSeason && category === selectedCategory,
        )?.id ?? '',
      category: selectedCategory!,
      season: selectedSeason!,
    })

    Toast.show({
      type: 'success',
      text1: 'تم الإضافة للعربة',
      text1Style: { fontSize: 18 },
      position: 'bottom',
    })
  }

  return (
    <View>
      <View className='mb-4 flex-row items-center gap-x-4'>
        <Text className='min-w-16 text-2xl font-semibold'>الموسم</Text>
        {seasons.map((season) => (
          <Pressable
            key={season}
            className='rounded-md bg-white px-4 py-2 shadow-md disabled:opacity-60'
            onPress={() => {
              setSelectedSeason(season)

              const firstVariant = product.variants
                .filter((variant) => variant.season === season)
                .sort((a, b) =>
                  (a.category as string).localeCompare(b.category),
                )[0]?.category

              setSelectedCategory(firstVariant)
            }}
            disabled={season === selectedSeason}
          >
            <Text className='text-2xl font-semibold'>{AR.season[season]}</Text>
          </Pressable>
        ))}
      </View>

      <View className='mb-4 flex-row items-center gap-x-4'>
        <Text className='min-w-16 text-2xl font-semibold'>النوع</Text>
        {variants.map(({ category }) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            className='rounded-md bg-white px-4 py-2 shadow-md disabled:opacity-60'
            disabled={category === selectedCategory}
          >
            <Text className='text-2xl font-semibold'>
              {AR.category[category as Category]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleAddCartItem}
        disabled={!(selectedCategory && selectedSeason)}
        className='self-start rounded-md bg-primary px-6 py-3 shadow active:scale-[0.98]'
      >
        <Text className='text-2xl text-white'>اضف إلى عربة التسوق</Text>
      </Pressable>
    </View>
  )
}
