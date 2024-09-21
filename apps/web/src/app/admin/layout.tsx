import Image from 'next/image'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import logo from '@/public/assets/images/logo.png'

import PageWrapper from './_components/page-wrapper'
import Sidebar from './_components/sidebar/sidebar'
import SidebarWrapper from './_components/sidebar/sidebar-wrapper'

// TODO: breadcrumb may be used

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-dvh w-full'>
      <SidebarWrapper>
        <div className='flex h-full max-h-screen flex-col gap-2'>
          <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <Link href='/' className='flex items-center gap-2 font-semibold'>
              <Image
                src={logo}
                alt='logo'
                className='size-8 object-cover'
                sizes='5rem'
              />

              <span className='hidden md:block'>سوق كرداسة</span>
            </Link>
          </div>
          <Sidebar />
        </div>
      </SidebarWrapper>

      <PageWrapper>
        {/* <Header /> */}
        {children}
      </PageWrapper>
    </div>
  )
}
