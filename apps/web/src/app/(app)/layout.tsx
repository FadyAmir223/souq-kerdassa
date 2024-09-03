import type { PropsWithChildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header'

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <div className='mb-16 mt-32 min-h-[65vh]'>{children}</div>
      <Footer />
    </>
  )
}
