import { cuidSchema } from '@repo/validators'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ActionProductForm from '../../_components/product-form/action-product-form'

export const metadata: Metadata = {
  title: {
    absolute: 'تعديل منتج',
  },
}

type AddProductPageProps = {
  params: Record<string, string | string[] | undefined>
}

export default function AddProductPage({ params }: AddProductPageProps) {
  const result = cuidSchema.safeParse(params.id)
  if (!result.success) notFound()

  return <ActionProductForm productId={result.data} />
}
