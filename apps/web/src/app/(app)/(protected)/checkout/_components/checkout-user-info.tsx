import { auth } from '@repo/auth'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api, HydrateClient } from '@/trpc/server'

import CheckoutAddressSelection from './checkout-address-selection'

export default async function CheckoutUserInfo() {
  void api.user.addresses.all.prefetch()
  const session = await auth()

  return (
    <HydrateClient>
      <section className='mb-6'>
        <h3 className='mb-3 text-xl font-bold'>معلومات التواصل</h3>
        <div className='flex flex-col gap-x-5 sm:flex-row'>
          <div className='flex-1'>
            <Label>الإسم</Label>
            <Input
              type='text'
              value={session?.user.name ?? ''}
              readOnly
              className='border-black'
            />
          </div>
          <div className=''>
            <Label>رقم التليفون</Label>
            <Input
              type='text'
              value={session?.user.phone ?? ''}
              readOnly
              className='min-w-16 border-black'
            />
          </div>
        </div>
      </section>

      <CheckoutAddressSelection>
        <h3 className='mb-3 text-xl font-bold'>اختر عنوان التوصيل</h3>
      </CheckoutAddressSelection>
    </HydrateClient>
  )
}
