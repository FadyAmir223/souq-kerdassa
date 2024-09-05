import Image from 'next/image'
import Link from 'next/link'
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md'

import { CartTotalPrice } from '@/components/cart-info'
import H1 from '@/components/h1'
import { Button } from '@/components/ui/button'
import deliveryIcon from '@/public/assets/images/icons/delivery.png'
import paymentIcon from '@/public/assets/images/icons/payment.png'
import qualityIcon from '@/public/assets/images/icons/quality.png'
import returnIcon from '@/public/assets/images/icons/return.png'
import { cn } from '@/utils/cn'
import { PAGES } from '@/utils/constants'

import CartItems from './_components/cart-items'

const iconsSection = [
  { image: deliveryIcon, label: '3 ايام التوصيل مجانى' },
  { image: returnIcon, label: 'ضمان استعادة الاموال' },
  { image: qualityIcon, label: 'منتجات مضمونة 100%' },
  { image: paymentIcon, label: 'دفع آمن' },
]

export default function CartPage() {
  // TODO: real costs
  const shippingCost = 0

  return (
    <main className='container mb-10 mt-6'>
      <H1>سلة المشتريات</H1>

      <section className='flex flex-col gap-4 lg:flex-row'>
        <div className='flex-1'>
          <CartItems />

          <div className='mt-7 flex justify-between'>
            {[
              {
                label: 'مواصلة التسوق',
                url: PAGES.public.main,
                icon: MdOutlineKeyboardDoubleArrowRight,
              },
              {
                label: 'الدفع',
                url: PAGES.protected.buy.checkout,
                icon: MdOutlineKeyboardDoubleArrowLeft,
              },
            ].map(({ label, url, icon: Icon }, idx) => (
              <Button
                key={label}
                asChild
                className='flex min-w-44 items-center justify-between py-5 text-lg'
              >
                <Link href={url}>
                  <span className={cn(idx === 0 && 'order-1')}>{label}</span>
                  <Icon size={22} />
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className='w-full lg:w-1/3'>
          <div className='h-fit rounded-md bg-white p-3'>
            <div className='flex justify-between'>
              <span className=''>الإجمالى</span>
              <span className=''>
                <CartTotalPrice /> EGP
              </span>
            </div>

            <div className='flex justify-between'>
              <span className=''>الشحن</span>
              <span className=''>{shippingCost} EGP</span>
            </div>

            <div className='mt-2 flex justify-between border-t border-t-black pt-2'>
              <span className=''>الإجمالى</span>
              <span className=''>
                <CartTotalPrice additionalCost={shippingCost} /> EGP
              </span>
            </div>
          </div>

          <div className='mt-3 flex h-fit justify-between rounded-md bg-white p-3'>
            {iconsSection.map(({ image, label }) => (
              <div key={label} className='flex-1'>
                <Image src={image} alt={label} className='mx-auto w-14' />
                <p className='text-center text-[0.8125rem]'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
