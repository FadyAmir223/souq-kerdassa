'use client'

import { FaLocationDot } from 'react-icons/fa6'

import { api } from '@/trpc/react'

import DeleteAddressForm from './delete-address-form'
import EditAddressForm from './edit-address-form'

export default function Addresses() {
  const [addresses] = api.user.addresses.all.useSuspenseQuery()

  if (addresses.length === 0)
    return <p className='mt-6 text-center text-xl font-bold'>لا يوجد عنوان</p>

  return addresses.map((address) => (
    <li key={address.id} className='rounded-md bg-white px-4 py-5 shadow-md'>
      <div className='mb-3 flex justify-between'>
        <FaLocationDot size={20} />

        <div className='flex gap-x-3'>
          <EditAddressForm address={address} />
          <div className='relative mx-1 before:absolute before:h-full before:w-[2.5px] before:bg-black' />
          <DeleteAddressForm addressId={address.id} />
        </div>
      </div>

      <div className=''>
        <p className=''>
          <span className='ml-1 font-semibold'>المدينة: </span>
          {address.city}
        </p>
        <p className=''>
          <span className='ml-1 font-semibold'>المنطقة: </span>
          {address.region}
        </p>
        <p className=''>
          <span className='ml-1 font-semibold'>الشارع: </span>
          {address.street}
        </p>
        <p className=''>
          <span className='ml-1 font-semibold'>المبنى: </span>
          {address.building}
        </p>
        <p className=''>
          <span className='ml-1 font-semibold'>علامة مميزة: </span>
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          {address.mark || 'لا يوجد'}
        </p>
      </div>
    </li>
  ))
}
