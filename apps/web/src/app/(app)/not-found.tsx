import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className='mb-5 mt-20'>
      <main className='container text-center'>
        <Image src={notFound} alt='page not found' className='mx-auto max-w-52' />
        <p className='mb-3 mt-10 text-xl font-bold'>الصفحة غير موجودة</p>
        <Button asChild variant='outline'>
          <Link href={PAGES.public.main}>عودة للصفحة الرئيسية</Link>
        </Button>
      </main>
    </div>
  )
}
