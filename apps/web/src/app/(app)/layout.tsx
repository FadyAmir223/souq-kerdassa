import type { PropsWithchildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header/header'

export default function AppLayout({ children }: PropsWithchildren) {
  return (
    <>
      <Header />
      <div className='mb-16 mt-32 min-h-[65vh]'>{children}</div>
      <Footer />
    </>
  )
}
