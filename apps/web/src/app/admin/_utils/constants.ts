import type { Product } from '@repo/db/types'

export const PAGES = {
  dashboard: '/admin/dashboard',
  products: {
    root: '/admin/products',
    add: '/admin/products/add',
    edit: (id: Product['id']) => `/admin/products/${id}/edit`,
  },
  orders: '/admin/orders',
  customers: '/admin/customers',
}
