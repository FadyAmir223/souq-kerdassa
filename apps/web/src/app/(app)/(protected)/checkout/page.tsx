import { redirect } from 'next/navigation'

import { api } from '@/trpc/server'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

import CheckoutItemsSection from './_components/checkout-items-section'
import CheckoutUserInfo from './_components/checkout-user-info'

export default async function CheckoutPage() {
  const addresses = await api.user.addresses.all()

  if (addresses.length === 0)
    redirect(
      `${PAGES.protected.user.address}?${SEARCH_PARAMS.redirectTo}=${PAGES.protected.buy.checkout}`,
    )

  return (
    <main className='-mb-16 -mt-7 min-h-[80vh] bg-gradient-to-l from-white from-60% to-secondary to-60%'>
      <div className='container flex'>
        <section className='my-7 flex-1 pe-10'>
          <CheckoutUserInfo />
        </section>

        <section className='my-7 w-2/5 ps-10'>
          <CheckoutItemsSection />
        </section>
      </div>
    </main>
  )
}
