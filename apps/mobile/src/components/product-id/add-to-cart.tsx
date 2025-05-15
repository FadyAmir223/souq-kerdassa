import { MaterialIcons } from '@expo/vector-icons'
import type { RouterOutputs } from '@repo/api'
import type { Category, Season } from '@repo/db/types'
import { useCombinedStore } from '@repo/store/mobile'
import { useEffect, useState } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/utils/cn'
import { AR, SIZES } from '@/utils/constants'
import { invertColor } from '@/utils/helpers/invert-number'

type AddToCartProps = {
  product: NonNullable<RouterOutputs['product']['byId']>
}

export default function AddToCart({ product }: AddToCartProps) {
  const variants = product.variants.sort((a, b) =>
    a.category.localeCompare(b.category),
  )

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    variants[0]?.category,
  )

  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    product.seasons[0]!,
  )

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes[0],
  )

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors[0],
  )

  const { selectedVariant, setSelectedVariant, addCartItem } = useCombinedStore(
    useShallow(({ selectedVariant, setSelectedVariant, addCartItem }) => ({
      selectedVariant,
      setSelectedVariant,
      addCartItem,
    })),
  )

  useEffect(() => {
    const variant = variants[0]
    if (!variant) return
    setSelectedVariant({ price: variant.price, discount: variant.discount })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      price: selectedVariant?.price ?? 0,
      discount: selectedVariant?.discount,
      image: product.images[0]!,
      variantId:
        variants.find(({ category }) => category === selectedCategory)?.id ?? '',
      category: selectedCategory!,
      season: selectedSeason!,
      size: selectedSize!,
      color: selectedColor!,
    })

    Toast.show({
      type: 'success',
      text1: 'تم الإضافة للعربة',
      text1Style: {
        fontSize: 18,
        textAlign: Platform.OS === 'ios' ? 'left' : undefined,
      },
      position: 'bottom',
    })
  }

  return (
    <View>
      <View className='flex-row gap-x-2'>
        <Text
          className={cn('ios:self-start mb-5 text-4xl font-bold text-primary', {
            'text-primary/60 line-through': selectedVariant?.discount,
          })}
        >
          {selectedVariant?.price}
        </Text>
        {selectedVariant?.discount && (
          <Text className='ios:self-start mb-5 text-4xl font-bold text-primary'>
            {selectedVariant.discount}
          </Text>
        )}
        <Text className='ios:self-start mb-5 text-4xl font-bold text-primary'>
          جنية
        </Text>
      </View>

      <View className='mb-4 flex-row items-center gap-x-4'>
        <Text className='min-w-16 text-2xl font-semibold'>الموسم</Text>
        {product.seasons.map((season) => (
          <Pressable
            key={season}
            className='rounded-md border border-black bg-white px-4 py-2 disabled:opacity-60'
            onPress={() => setSelectedSeason(season)}
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
            onPress={() => {
              const selectedCategory = variants.find(
                ({ category: c }) => c === category,
              )
              if (!selectedCategory) return

              setSelectedCategory(category)
              setSelectedVariant({
                price: selectedCategory.price,
                discount: selectedCategory.discount,
              })
            }}
            className='rounded-md border border-black bg-white px-4 py-2 disabled:opacity-60'
            disabled={category === selectedCategory}
          >
            <Text className='text-2xl font-semibold'>
              {AR.category[category as Category]}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className='mb-4 flex-row gap-x-4'>
        <Text className='mt-2 min-w-16 text-2xl font-semibold'>الحجم</Text>
        <View className='gap-y-2'>
          {product.sizes.map((size) => (
            <Pressable
              key={size}
              onPress={() => setSelectedSize(size)}
              className='rounded-md border border-black bg-white px-4 py-2 disabled:opacity-60'
              disabled={size === selectedSize}
            >
              <Text className='text-2xl font-semibold'>
                {SIZES[size as keyof typeof SIZES]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className='mb-4 flex-row gap-x-4'>
        <Text className='mt-2 min-w-16 text-2xl font-semibold'>اللون</Text>
        {product.colors.map((color) => (
          <Pressable
            key={color}
            onPress={() => setSelectedColor(color)}
            className='flex aspect-square items-center justify-between rounded-md border border-black bg-white disabled:opacity-60'
            disabled={color === selectedSize}
            style={{ backgroundColor: color }}
          >
            <Text className='text-2xl font-semibold'>
              {color === selectedColor && (
                <MaterialIcons
                  name='check'
                  size={20}
                  style={{ color: invertColor(selectedColor) }}
                />
              )}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleAddCartItem}
        disabled={!(selectedCategory && selectedSeason)}
        className='self-start rounded-md bg-primary px-6 py-3 active:scale-[0.98]'
      >
        <Text className='text-2xl text-white'>اضف إلى العربة</Text>
      </Pressable>
    </View>
  )
}
