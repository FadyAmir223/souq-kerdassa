import { signOut } from '@repo/auth'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/utils/constants'

import SidebarNav from './sidebar-nav'

const navs = [
  { label: 'معلومات الحساب', url: PAGES.protected.user.profile },
  { label: 'عناوينى', url: PAGES.protected.user.address },
  { label: 'طلباتى', url: PAGES.protected.user.orders },
]

export default function AccountSidebar() {
  return (
    <aside className='h-fit rounded-md bg-white p-4 shadow-md md:min-w-60 lg:min-w-80'>
      <ul className='space-y-2 text-lg'>
        {navs.map(({ label, url }) => (
          <li
            key={url}
            className='[&:not(:last-child)]::pb-0 border-b border-b-black/30 pb-2'
          >
            <SidebarNav label={label} url={url} />
          </li>
        ))}

        <form>
          {/* TODO: may convert into client component to disable */}
          <Button
            variant='none'
            size='none'
            className='block w-full rounded-md bg-destructive px-3 py-1 text-start text-lg transition-colors hover:bg-destructive/90'
            formAction={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            تسجيل الخروج
          </Button>
        </form>
      </ul>
    </aside>
  )
}
