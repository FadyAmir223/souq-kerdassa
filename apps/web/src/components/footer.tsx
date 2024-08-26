import Image from 'next/image'
import Link from 'next/link'

import logo from '@/public/assets/images/logo.png'

const cols = [
  {
    title: 'مميز',
    rows: [
      {
        label: 'منتجات مميزة',
        url: '/products?type=featured',
      },
      {
        label: 'اخر المنتجات المضافة',
        url: '/products?type=latest',
      },
      {
        label: 'افضل المنتجات مبيعاً',
        url: '/products?type=best-selling',
      },
      {
        label: 'المنتجات الافضل تقييماً',
        url: '/products?type=top-rated',
      },
    ],
  },
  {
    title: 'معلومات الحساب و الشحن',
    rows: [
      {
        label: 'معلومات الحساب',
        url: '/account/profile',
      },
      {
        label: 'تتبع الطلبات',
        url: '/account/orders',
      },
      {
        label: 'عنوان',
        url: '/account/address',
      },
    ],
  },
]

export default function Footer() {
  return (
    <footer className='mt-auto bg-[#121D2C]'>
      <div className='container grid-cols-4 py-8 text-center md:grid md:text-start'>
        <div className='flex justify-center'>
          <Link href='/'>
            <Image src={logo} alt='logo' className='w-14' priority />
          </Link>
        </div>

        {cols.map((row) => (
          <div key={row.title}>
            <h6 className='mb-2.5 mt-6 text-lg font-bold text-white md:mb-4 md:mt-0'>
              {row.title}
            </h6>

            <ul className='space-y-1 text-zinc-400'>
              {row.rows.map(({ label, url }) => (
                <li key={url}>{label}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='border-t border-zinc-600' />

      <div className='container flex flex-col items-center justify-between gap-y-2 py-4 md:flex-row'>
        <p className='font-bold text-white'>جميع الحقوق محفوظة</p>
        <div className='flex gap-x-5 text-sm text-zinc-400'>
          <span>الشروط و الاحكام</span>
          <span>سياسة الخصوصية</span>
        </div>
      </div>
    </footer>
  )
}
