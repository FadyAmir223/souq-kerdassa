import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { api } from '@/trpc/server'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

import CheckoutItemsSection from './_components/checkout-items-section'
import CheckoutUserInfo from './_components/checkout-user-info'

export const metadata: Metadata = {
  title: 'إتمام الشراء',
  description:
    'أكملى عملية شراء العبايات الخاصة بك. قومى بمراجعة تفاصيل طلبك ثم اختارى معلومات الشحن.',
}

export default async function CheckoutPage() {
  const addresses = await api.user.addresses.all()

  if (addresses.length === 0)
    redirect(
      `${PAGES.protected.user.address}?${SEARCH_PARAMS.redirectTo}=${PAGES.protected.buy.checkout}`,
    )

  void api.city.all.prefetch()

  return (
    <main className='min-h-[80dvh] md:-mb-16 md:-mt-7 md:bg-gradient-to-l md:from-white md:from-60% md:to-secondary md:to-60%'>
      <div className='container flex flex-col gap-y-6 md:my-0 md:flex-row md:gap-y-0'>
        <section className='order-1 md:order-none md:my-7 md:flex-1 md:pe-10'>
          <CheckoutUserInfo addresses={addresses} />
        </section>

        <section className='md:my-7 md:w-2/5 md:ps-10'>
          <CheckoutItemsSection />
        </section>
      </div>
    </main>
  )
}
