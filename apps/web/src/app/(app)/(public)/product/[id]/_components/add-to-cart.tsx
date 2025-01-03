'use client'

import type { RouterOutputs } from '@repo/api'
import type { Category, Season, Size } from '@repo/db/types'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppStore } from '@/providers/app-store-provider'
import { AR, SIZES } from '@/utils/constants'

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

  const [selectedSize, setSelectedSize] = useState<Size | undefined>(
    product.sizes[0],
  )

  const addCartItem = useAppStore((s) => s.addCartItem)
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
      price: product.price,
      image: product.images[0]!,
      variantId:
        variants.find(
          ({ season, category }) =>
            season === selectedSeason && category === selectedCategory,
        )?.id ?? '',
      category: selectedCategory!,
      season: selectedSeason!,
      size: selectedSize!,
    })

    toast({ description: 'تم الإضافة للعربة', variant: 'success' })
  }

  return (
    <>
      <div className='mb-4 flex gap-x-4'>
        <span className='mb-3 min-w-16 text-lg font-semibold'>الموسم</span>
        {seasons.map((season) => (
          <Button
            key={season}
            variant='outline'
            onClick={() => {
              setSelectedSeason(season)

              const firstVariant = product.variants
                .filter((variant) => variant.season === season)
                .sort((a, b) =>
                  (a.category as string).localeCompare(b.category),
                )[0]?.category

              setSelectedCategory(firstVariant)
            }}
            className='disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
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
            onClick={() => setSelectedCategory(category)}
            className='disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
            disabled={category === selectedCategory}
          >
            {AR.category[category as Category]}
          </Button>
        ))}
      </div>

      <div className='mb-4 flex gap-x-4'>
        <span className='mb-3 min-w-16 text-lg font-semibold'>الحجم</span>
        {product.sizes.map((size) => (
          <Button
            key={size}
            variant='outline'
            onClick={() => setSelectedSize(size)}
            className='text-[0.8125rem] disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
            disabled={size === selectedSize}
          >
            {SIZES[size]}
          </Button>
        ))}
      </div>

      <Button
        onClick={handleAddCartItem}
        disabled={!(selectedCategory && selectedSeason)}
        className='px-6 py-2'
        size='none'
      >
        اضف إلى العربة
      </Button>
    </>
  )
}
