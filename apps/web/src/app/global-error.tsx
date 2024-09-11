'use client'

import Image from 'next/image'

import Footer from '@/components/footer'
import H1 from '@/components/h1'
import { Button } from '@/components/ui/button'
import notFound from '@/public/assets/not-found_shopping_re_owap.svg'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <main className='mt-20 flex min-h-screen flex-col'>
          <div className='container text-center'>
            <Image src={notFound} alt='حدث خطأ' className='mx-auto mb-6 max-w-52' />
            <H1>حدث خطأ</H1>

            <Button variant='outline' onClick={() => reset()}>
              حاول مجدداً
            </Button>
          </div>

          <Footer />
        </main>
      </body>
    </html>
  )
}
