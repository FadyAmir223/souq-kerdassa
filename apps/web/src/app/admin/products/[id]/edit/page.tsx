import { cuidSchema } from '@repo/validators'
import { notFound } from 'next/navigation'

import ActionProductForm from '../../_components/action-product-form'

type AddProductPageProps = {
  params: Record<string, string | string[] | undefined>
}

export default function AddProductPage({ params }: AddProductPageProps) {
  const id = cuidSchema.safeParse(params.id)
  if (!id.success) notFound()

  return <ActionProductForm />
}
