import Image from 'next/image'
import Link from 'next/link'

import logo from '@/public/assets/images/logo.png'
import { PAGES } from '@/utils/constants'

import { Button } from '../../../components/ui/button'

const cols = [
  {
    title: 'مميز',
    rows: [
      {
        label: 'اخر العبايات المضافة',
        url: `${PAGES.public.products}?type=latest`,
      },
      {
        label: 'العبايات الافضل تقييماً',
        url: `${PAGES.public.products}?type=top-rated`,
      },
      {
        label: 'عبايات صيفى',
        url: `${PAGES.public.products}?season=summer`,
      },
      {
        label: 'عبايات شتوى',
        url: `${PAGES.public.products}?season=winter`,
      },
    ],
  },
  {
    title: 'معلومات الحساب و الشحن',
    rows: [
      {
        label: 'معلومات الحساب',
        url: PAGES.protected.user.profile,
      },
      {
        label: 'تتبع الطلبات',
        url: PAGES.protected.user.orders,
      },
      {
        label: 'عنوان',
        url: PAGES.protected.user.address,
      },
    ],
  },
]

export default function Footer() {
  return (
    <footer className='mt-auto bg-[#121D2C]'>
      <div className='container grid-cols-4 py-8 text-center md:grid md:text-start'>
        <div className='flex justify-center'>
          <Link href={PAGES.public.main}>
            <Image src={logo} alt='logo' className='w-14' priority />
          </Link>
        </div>

        {cols.map((row) => (
          <div key={row.title}>
            <span className='mb-2.5 mt-6 block text-lg font-bold text-white md:mb-4 md:mt-0'>
              {row.title}
            </span>

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
            { label: 'الشروط و الاحكام', url: PAGES.public.terms },
            { label: 'سياسة الخصوصية', url: PAGES.public.privacy },
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
