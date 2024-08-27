'use client'

import type { RouterOutputs } from '@repo/api'
import type { Category, Season } from '@repo/db/types'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppStore } from '@/providers/app-store-provider'
import { ar } from '@/utils/constants'

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

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    variants[0]?.category,
  )

  const addCartItem = useAppStore((s) => s.addCartItem)
  const { toast } = useToast()

  const handleAddCartItem = () => {
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]!,
      category: selectedCategory!,
      season: selectedSeason!,
    })

    toast({ description: 'تم الإضافة للعربة', variant: 'success', duration: 2000 })
  }

  return (
    <>
      <div className='mb-4 flex gap-x-4'>
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
            {ar.season[season]}
          </Button>
        ))}
      </div>

      <div className='mb-4 flex gap-x-4'>
        {variants.map(({ category }) => (
          <Button
            key={category}
            variant='outline'
            onClick={() => setSelectedCategory(category)}
            className='disabled:bg-accent disabled:text-accent-foreground disabled:opacity-90'
            disabled={category === selectedCategory}
          >
            {ar.category[category as Category]}
          </Button>
        ))}
      </div>

      <Button
        onClick={handleAddCartItem}
        disabled={!(selectedCategory && selectedSeason)}
        className='px-6 py-2 text-[1.0625rem]'
        size='none'
      >
        اضف إلى العربة
      </Button>
    </>
  )
}
