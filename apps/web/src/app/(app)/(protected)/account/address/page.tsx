import { auth } from '@repo/auth'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import H1 from '@/components/h1'
import { api, HydrateClient } from '@/trpc/server'

import AddAddressForm from './_components/add-address-form'
import AddressSkeleton from './_components/address-skeleton'
import Addresses from './_components/addresses'

const RedirectToCheckoutButton = dynamic(
  () => import('./_components/redirect-to-checkout-button'),
  { ssr: false },
)

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user) notFound()

  void api.user.addresses.all.prefetch()

  return (
    <HydrateClient>
      <main className='w-full'>
        <div className='flex justify-between'>
          <H1>عناوينى</H1>
          <AddAddressForm />
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
