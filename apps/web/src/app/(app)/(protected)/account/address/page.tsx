import { auth } from '@repo/auth'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import H1 from '@/app/(app)/_components/h1'
import { api, HydrateClient } from '@/trpc/server'

import ActionAddressForm from './_components/action-address-form'
import AddressSkeleton from './_components/address-skeleton'
import Addresses from './_components/addresses'

const RedirectToCheckoutButton = dynamic(
  () => import('./_components/redirect-to-checkout-button'),
  { ssr: false },
)

export const metadata: Metadata = {
  title: 'عناوينى',
  description:
    'قومى بإضافة و تحديث عناوين الشحن الخاصة بك. سهّلى عملية الشراء بإدارة عناوينك بشكل مريح وفعال.',
}

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user) notFound()

  void Promise.all([api.user.addresses.all.prefetch(), api.city.all.prefetch()])

  return (
    <HydrateClient>
      <main className='flex-1'>
        <div className='flex justify-between'>
          <H1>عناوينى</H1>
          <ActionAddressForm action='add' />
        </div>

        <ul className='grid gap-4 md:grid-cols-2'>
          <Suspense fallback={<AddressSkeleton />}>
            <Addresses />
          </Suspense>
        </ul>

        <RedirectToCheckoutButton />
      </main>
    </HydrateClient>
  )
}
