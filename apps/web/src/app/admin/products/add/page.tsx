import type { Metadata } from 'next'

import ActionProductForm from '../_components/product-form/action-product-form'

export const metadata: Metadata = {
  title: {
    absolute: 'إضافة منتج',
  },
  description: 'اضف منتج جديد',
}

export default function AddProductPage() {
  return <ActionProductForm />
}
