import type { AdminOrdersSchema } from '@repo/validators'
import type { Metadata } from 'next'

import { api, HydrateClient } from '@/trpc/server'

import SidebarCollapseButton from '../_components/sidebar-collapse-button'
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
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pe-14'>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
          <HydrateClient>
            <OrdersList defaultStatus={defaultQueryParams.status}>
              <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold md:text-2xl'>الطلبات</h1>
                <SidebarCollapseButton />
              </div>
            </OrdersList>
          </HydrateClient>
        </main>
      </div>
    </div>
  )
}
