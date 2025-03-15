'use client'

import type { RouterOutputs } from '@repo/api'
import type { Category, Season } from '@repo/db/types'
import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppStore } from '@/providers/app-store-provider'
import { AR, SIZES } from '@/utils/constants'
import { invertColor } from '@/utils/invert-color'

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

  const { selectedVariant, setSelectedVariant, addCartItem } = useAppStore(
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

  const { toast } = useToast()

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

    toast({ description: 'تم الإضافة للعربة', variant: 'success' })
  }

  return (
    <>
      <div className='mb-4 flex gap-x-4'>
        <span className='mb-3 min-w-16 text-lg font-semibold'>الموسم</span>
        {product.seasons.map((season) => (
          <Button
            key={season}
            variant='outline'
            onClick={() => setSelectedSeason(season)}
            className='select-none disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
            disabled={season === selectedSeason}
          >
            {AR.season[season]}
          </Button>
        ))}
      </div>

      <div className='mb-4 flex gap-x-4'>
        <span className='mb-3 min-w-16 text-lg font-semibold'>النوع</span>
        {variants.map(({ category }) => (
          <Button
            key={category}
            variant='outline'
            onClick={() => {
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
            className='select-none disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
            disabled={category === selectedCategory}
          >
            {AR.category[category as Category]}
          </Button>
        ))}
      </div>

      <div className='mb-4 space-y-2'>
        <span className='mb-3 min-w-16 text-lg font-semibold'>الحجم</span>
        {product.sizes.map((size) => (
          <div key={size}>
            <Button
              key={size}
              variant='outline'
              onClick={() => setSelectedSize(size)}
              className='me-4 select-none text-[0.8125rem] disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
              disabled={size === selectedSize}
            >
              {size}
            </Button>
            <span className=''>{SIZES[size as keyof typeof SIZES]}</span>
          </div>
        ))}
      </div>

      <div className='mb-4 flex gap-x-4'>
        <span className='mb-3 min-w-16 text-lg font-semibold'>اللون</span>
        {product.colors.map((color) => (
          <Button
            key={color}
            variant='outline'
            onClick={() => setSelectedColor(color)}
            className='relative text-[0.8125rem] disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
            style={{ backgroundColor: color }}
            disabled={color === selectedColor}
          >
            <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              {color === selectedColor && (
                <FaCheck style={{ color: invertColor(selectedColor) }} />
              )}
            </span>
          </Button>
        ))}
      </div>

      <Button
        onClick={handleAddCartItem}
        disabled={!(selectedCategory && selectedSeason)}
        className='px-6 py-2 md:mb-10'
        size='none'
      >
        اضف إلى العربة
      </Button>
    </>
  )
}
