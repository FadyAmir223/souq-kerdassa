import type { Product } from '@repo/db/types'

export const PAGES = {
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  products: {
    root: '/admin/products',
    add: '/admin/products/add',
    edit: (id: Product['id']) => `/admin/products/edit/${id}`,
  },
  orders: '/admin/orders',
  customers: '/admin/users',
} as const
