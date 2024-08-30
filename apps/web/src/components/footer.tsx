import Image from 'next/image'
import Link from 'next/link'

import logo from '@/public/assets/images/logo.png'

import { Button } from './ui/button'

const cols = [
  {
    title: 'مميز',
    rows: [
      {
        label: 'اخر العبايات المضافة',
        url: '/products?type=latest',
      },
      {
        label: 'العبايات الافضل تقييماً',
        url: '/products?type=top-rated',
      },
      {
        label: 'عبايات صيفى',
        url: '/products?type=featured',
      },
      {
        label: 'عبايات شتوى',
        url: '/products?type=featured',
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

            <ul>
              {row.rows.map(({ label, url }) => (
                <li key={url}>
                  <Button asChild variant='link' className='p-0 text-zinc-400'>
                    <Link href={url}>{label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='border-t border-zinc-600' />

      <div className='container flex flex-col items-center justify-between gap-y-2 py-4 md:flex-row'>
        <p className='font-bold text-white'>جميع الحقوق محفوظة</p>
        <ul className='flex gap-x-5 text-sm text-zinc-400'>
          {[
            { label: 'الشروط و الاحكام', url: '/terms' },
            { label: 'سياسة الخصوصية', url: '/privacy' },
          ].map(({ label, url }) => (
            <li key={url}>
              <Button asChild variant='link' className='p-0 text-zinc-400'>
                <Link href={url}>{label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
