'use client'

import type { RouterOutputs } from '@repo/api'

import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

type Address = RouterOutputs['user']['addresses']['all'][number] | null | undefined

type CheckoutAddressesProps = {
  selectedAddress: Address
  setSelectedAddress: (address: Address) => void
}

export default function CheckoutAddresses({
  selectedAddress,
  setSelectedAddress,
}: CheckoutAddressesProps) {
  const [addresses] = api.user.addresses.all.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  })

  return addresses.map((address) => (
    <li
      key={address.id}
      onClick={() => setSelectedAddress(address)}
      className={cn(
        'cursor-pointer select-none rounded-md border-2 border-transparent bg-white px-4 py-5 shadow-md md:bg-secondary',
        {
          'border-green-500': selectedAddress?.id === address.id,
          'border-destructive': selectedAddress === undefined,
        },
      )}
    >
      <p>
        <span className='ml-1 font-semibold'>المدينة: </span>
        {address.city}
      </p>
      <p>
        <span className='ml-1 font-semibold'>المنطقة: </span>
        {address.region}
      </p>
      <p>
        <span className='ml-1 font-semibold'>الشارع: </span>
        {address.street}
      </p>
      <p>
        <span className='ml-1 font-semibold'>المبنى: </span>
        {address.building}
      </p>
      <p>
        <span className='ml-1 font-semibold'>علامة مميزة: </span>
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {address.mark || 'لا يوجد'}
      </p>
    </li>
  ))
}
