'use client'

import { useAppStore } from '@/providers/app-store-provider'
import { cn } from '@/utils/cn'

export default function ProductPrice() {
  const selectedVariant = useAppStore((s) => s.selectedVariant)

  return (
    <>
      <span
        className={cn({ 'text-primary/60 line-through': selectedVariant?.discount })}
      >
        {selectedVariant?.price}
      </span>
      {!!selectedVariant?.discount && <span>{selectedVariant.discount}</span>}
    </>
  )
}
