import type { Metadata } from 'next'
import { Suspense } from 'react'

import H1 from '@/app/(app)/_components/h1'
import { api, HydrateClient } from '@/trpc/server'

import OrderSkeleton from './_components/order-skeleton'
import Orders from './_components/orders'
import ResetCheckout from './_components/reset-checkout'

export const metadata: Metadata = {
  title: 'طلباتى',
  description: 'استعرضي تفاصيل طلباتك و راجعي حالة الطلبات بسهولة',
}

export const dynamic = 'force-dynamic'

// TODO: another approach is to separate each category in its tab

export default function OrdersPage() {
  void api.order.all.prefetch()

  return (
    <HydrateClient>
      <main className='flex-1'>
        <H1>طلباتى</H1>

        <section>
          <ul className='relative space-y-6'>
            <Suspense fallback={<OrderSkeleton />}>
              <Orders />
            </Suspense>
          </ul>
        </section>

        <ResetCheckout />
      </main>
    </HydrateClient>
  )
}
