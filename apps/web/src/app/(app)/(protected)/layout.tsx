import { auth } from '@repo/auth'
import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

import AccountSidebar from './_components/account-sidebar'

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className='container flex flex-col gap-5 md:flex-row'>
        <AccountSidebar />
        {children}
      </div>
    </SessionProvider>
  )
}
