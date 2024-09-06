'use client'

import type { RouterOutputs } from '@repo/api'
import type { PropsWithChildren } from 'react'
import { Suspense, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/providers/app-store-provider'
import { api } from '@/trpc/react'

import AddressSkeleton from '../../account/address/_components/address-skeleton'
import CheckoutAddresses from './checkout-addresses'

type Address = RouterOutputs['user']['addresses']['all'][number] | null | undefined

export default function CheckoutAddressSelection({ children }: PropsWithChildren) {
  const [selectedAddress, setSelectedAddress] = useState<Address>(null)

  const cart = useAppStore((s) => s.cart)

  const createOrder = api.order.create.useMutation()

  const handleCreateOrder = () => {
    if (selectedAddress === null) return setSelectedAddress(undefined)
    if (selectedAddress === undefined) return

    createOrder.mutate({
      address: selectedAddress,
      cart,
    })
  }

  return (
    <>
      <section className='mb-16'>
        {children}

        <ul className='grid gap-4 md:grid-cols-2'>
          <Suspense fallback={<AddressSkeleton />}>
            <CheckoutAddresses
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </Suspense>
        </ul>
      </section>

      <div className='text-center'>
        <Button
          className='min-w-32 text-lg'
          onClick={handleCreateOrder}
          disabled={createOrder.isPending}
        >
          شراء
        </Button>
      </div>
    </>
  )
}
