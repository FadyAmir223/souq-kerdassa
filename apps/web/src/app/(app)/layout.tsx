import { auth } from '@repo/auth'
import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header/header'

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <>
      <SessionProvider session={session}>
        <Header />
        <div className='mb-16 mt-32 min-h-[65vh]'>{children}</div>
        <Footer />
      </SessionProvider>
    </>
  )
}
