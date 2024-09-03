import { auth } from '@repo/auth'
import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return <SessionProvider session={session}>{children}</SessionProvider>
}
