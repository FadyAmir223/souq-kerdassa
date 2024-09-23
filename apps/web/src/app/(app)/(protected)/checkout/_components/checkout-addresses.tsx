import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/providers/app-store-provider'
import type { RouterOutputs } from '@/trpc/react'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

type CheckoutAddressesProps = {
  addresses: RouterOutputs['user']['addresses']['all']
}

export default function CheckoutAddresses({ addresses }: CheckoutAddressesProps) {
  const { data: cities } = api.city.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const { selectedAddress, setSelectedAddress } = useAppStore(
    useShallow(({ selectedAddress, setSelectedAddress }) => ({
      selectedAddress,
      setSelectedAddress,
    })),
  )

  return (
    <ul className='grid gap-4 md:grid-cols-2'>
      {addresses.map((address) => (
        <li
          key={address.id}
          onClick={() => {
            setSelectedAddress({
              id: address.id,
              cityId: address.city.id,
              region: address.region,
              street: address.street,
              building: address.building,
              mark: address.mark,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              price: (cities ?? []).find(({ id }) => id === address.city.id)?.price!,
            })
          }}
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
            {address.city.name}
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
      ))}
    </ul>
  )
}
