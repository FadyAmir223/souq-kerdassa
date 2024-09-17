import Image from 'next/image'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import logo from '@/public/assets/images/logo.png'

import Sidebar from './_components/sidebar'

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className='grid min-h-dvh w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      {/* TODO: copy spotify layout */}
      <div className='hidden border-r bg-zinc-300/45 md:block'>
        <div className='flex h-full max-h-screen flex-col gap-2'>
          <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <Link href='/' className='flex items-center gap-2 font-semibold'>
              <Image
                src={logo}
                alt='logo'
                className='size-8 object-cover'
                sizes='5rem'
              />

              <span className=''>سوق كرداسة</span>
            </Link>
          </div>
          <Sidebar />
        </div>
      </div>
      <div className='flex flex-col'>
        {/* <Header /> */}
        {children}
      </div>
    </div>
  )
}
