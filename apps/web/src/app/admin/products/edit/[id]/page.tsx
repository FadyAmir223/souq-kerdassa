import { cuidSchema } from '@repo/validators'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { api } from '@/trpc/server'

import ActionProductForm from '../../_components/product-form/action-product-form'

export const metadata: Metadata = {
  title: {
    absolute: 'تعديل منتج',
  },
}

type AddProductPageProps = {
  params: Record<string, string | string[] | undefined>
}

export default async function AddProductPage({ params }: AddProductPageProps) {
  const result = cuidSchema.safeParse(params.id)
  if (!result.success) notFound()

  const productDetails = await api.product.admin.detailsById(result.data)

  return <ActionProductForm productDetails={productDetails} />
}
