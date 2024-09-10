import type { Metadata } from 'next'
import { Suspense } from 'react'

import H1 from '@/components/h1'
import { api, HydrateClient } from '@/trpc/server'

import OrderSkeleton from './_components/order-skeleton'
import Orders from './_components/orders'

export const metadata: Metadata = {
  title: 'طلباتى',
  description: 'استعرضي تفاصيل طلباتك و راجعي حالة الطلبات بسهولة',
}

// another approach is to separate each category in its tab

export default function OrdersPage() {
  void api.order.all.prefetch()

  return (
    <HydrateClient>
      <main className='flex-1'>
        <H1>طلباتى</H1>

        <section className=''>
          <ul className='relative space-y-6'>
            <Suspense fallback={<OrderSkeleton />}>
              <Orders />
            </Suspense>
          </ul>
        </section>
      </main>
    </HydrateClient>
  )
}
