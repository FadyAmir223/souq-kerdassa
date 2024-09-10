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
        <main className='container mt-32 min-h-screen'>
          <Image src={notFound} alt='حدث خطأ' className='mx-auto max-w-52' />
          <H1>حدث خطأ</H1>

          <Button variant='outline' onClick={() => reset()}>
            حاول مجدداً
          </Button>

          <Footer />
        </main>
      </body>
    </html>
  )
}
