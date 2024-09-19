import type { AdminOrdersSchema } from '@repo/validators'
import type { Metadata } from 'next'

import { api, HydrateClient } from '@/trpc/server'

import OrdersList from './_components/orders-list'

export const metadata: Metadata = {
  title: {
    absolute: 'الطلبات',
  },
}

const defaultQueryParams = {
  limit: 10,
  page: 1,
  status: 'all',
} satisfies AdminOrdersSchema

export default function OrdersPage() {
  void Promise.all([
    api.order.admin.all.prefetch(defaultQueryParams),
    api.order.admin.count.prefetch(defaultQueryParams.status),
    api.order.admin.statistics.prefetch(),
  ])

  return (
    <HydrateClient>
      <OrdersList defaultStatus={defaultQueryParams.status} />
    </HydrateClient>
  )
}
