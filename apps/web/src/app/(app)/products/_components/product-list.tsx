'use client'

import type { RouterInputs } from '@repo/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { api } from '@/trpc/react'

import ProductCard from '../../_components/product/product-card'

type ProductListProps = {
  productByTypeInput: RouterInputs['product']['byType']
}

export default function ProductList({ productByTypeInput }: ProductListProps) {
  const [products] = api.product.byType.useSuspenseQuery(productByTypeInput)

  if (!products.length) notFound()

  return products.map((product) => (
    <Link
      key={product.id}
      href={`/product/${product.id}`}
      className='transition-transform hover:scale-[1.03]'
    >
      <ProductCard key={product.id} product={product} />
    </Link>
  ))
}
