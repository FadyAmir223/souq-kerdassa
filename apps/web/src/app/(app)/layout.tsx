import { auth } from '@repo/auth'
import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header'

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <>
      <Header />
      <div className='mb-16 mt-32 min-h-[65vh]'>
        <SessionProvider session={session}>{children}</SessionProvider>
      </div>
      <Footer />
    </>
  )
}
