import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Footer from '@/components/footer'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import notFound from '@/public/assets/not-found_shopping_re_owap.svg'
import { PAGES } from '@/utils/constants'

export const metadata: Metadata = {
  title: {
    absolute: 'الصفحة غير موجودة',
  },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <div className='mb-16 mt-32 min-h-[65vh]'>
        <main className='container mt-12 text-center'>
          <Image src={notFound} alt='page not found' className='mx-auto max-w-52' />
          <p className='mb-3 mt-10 text-xl font-bold'>الصفحة غير موجودة</p>
          <Button asChild variant='outline'>
            <Link href={PAGES.public.main}>عودة للصفحة الرئيسية</Link>
          </Button>
        </main>
      </div>
      <Footer />
    </>
  )
}
