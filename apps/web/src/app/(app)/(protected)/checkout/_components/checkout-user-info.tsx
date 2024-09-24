import { auth } from '@repo/auth'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RouterOutputs } from '@/trpc/react'
import { HydrateClient } from '@/trpc/server'

import CheckoutAddressSelection from './checkout-address-selection'

type CheckoutUserInfoProps = {
  addresses: RouterOutputs['user']['addresses']['all']
}

export default async function CheckoutUserInfo({
  addresses,
}: CheckoutUserInfoProps) {
  const session = await auth()

  return (
    <HydrateClient>
      <section className='mb-6'>
        <h3 className='mb-3 text-xl font-bold'>معلومات التواصل</h3>
        <div className='flex flex-col gap-x-5 sm:flex-row'>
          <div className='flex-1'>
            <Label htmlFor='name'>الإسم</Label>
            <Input
              id='name'
              type='text'
              value={session?.user.name ?? ''}
              readOnly
              className='border-black'
            />
          </div>
          <div>
            <Label htmlFor='phone'>رقم التليفون</Label>
            <Input
              id='phone'
              type='text'
              value={session?.user.phone ?? ''}
              readOnly
              className='min-w-16 border-black'
            />
          </div>
        </div>
      </section>

      <CheckoutAddressSelection addresses={addresses}>
        <h3 className='mb-3 text-xl font-bold'>اختر عنوان التوصيل</h3>
      </CheckoutAddressSelection>
    </HydrateClient>
  )
}
