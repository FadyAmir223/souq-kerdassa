import type { PropsWithChildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header/header'

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <div className='mt-32' />
      {children}
      <Footer />
    </>
  )
}
