import type { PropsWithChildren } from 'react'

import AccountSidebar from '../_components/account-sidebar'

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className='container flex flex-col gap-5 md:flex-row'>
      <AccountSidebar />
      {children}
    </div>
  )
}
