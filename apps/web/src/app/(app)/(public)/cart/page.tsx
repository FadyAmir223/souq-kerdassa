import type { Metadata } from 'next'
import Image from 'next/image'

import { CartTotalPrice } from '@/components/cart-info'
import H1 from '@/components/h1'
import deliveryIcon from '@/public/assets/images/icons/delivery.png'
import paymentIcon from '@/public/assets/images/icons/payment.png'
import qualityIcon from '@/public/assets/images/icons/quality.png'
import returnIcon from '@/public/assets/images/icons/return.png'
import { shippingCost } from '@/utils/constants'

import CartItems from './_components/cart-items'

export const metadata: Metadata = {
  title: 'عربة التسوق',
  description:
    'استعرضى العبايات التي اخترتِها في عربة التسوق. تأكدي من المنتجات و الكميات قبل إتمام عملية الشراء. تسوقي الآن و أكملي طلبك بسهولة.',
}

const iconsSection = [
  { image: deliveryIcon, label: '3 ايام التوصيل مجانى' },
  { image: returnIcon, label: 'ضمان استعادة الاموال' },
  { image: qualityIcon, label: 'منتجات مضمونة 100%' },
  { image: paymentIcon, label: 'دفع آمن' },
]

// TODO: responsive for _ screens

export default function CartPage() {
  return (
    <main className='container mb-10 mt-6'>
      <H1>عربة التسوق</H1>

      <section className='flex flex-col gap-4 lg:flex-row'>
        <div className='flex-1'>
          <CartItems />
        </div>

        <div className='w-full lg:w-1/3'>
          <div className='h-fit rounded-md bg-white p-3'>
            <div className='flex justify-between'>
              <span className=''>الإجمالى</span>
              <span className=''>
                <CartTotalPrice /> جنية
              </span>
            </div>

            <div className='flex justify-between'>
              <span className=''>الشحن</span>
              <span className=''>{shippingCost} جنية</span>
            </div>

            <div className='mt-2 flex justify-between border-t border-t-black pt-2'>
              <span className=''>الإجمالى</span>
              <span className=''>
                <CartTotalPrice additionalCost={shippingCost} /> جنية
              </span>
            </div>
          </div>

          <div className='mt-3 flex h-fit justify-between rounded-md bg-white p-3'>
            {iconsSection.map(({ image, label }, index) => (
              <div key={label} className='flex-1'>
                <Image
                  src={image}
                  alt={label}
                  className='mx-auto w-14'
                  sizes='3.5 rem'
                  priority={index < 2}
                />
                <p className='text-center text-[0.8125rem]'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
