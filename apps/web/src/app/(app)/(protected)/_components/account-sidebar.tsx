import { PAGES } from '@/utils/constants'

import SidebarNav from './sidebar-nav'
import SignOutButton from './sign-out-button'

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
          <li key={url} className='border-b border-b-black/30 pb-2'>
            <SidebarNav label={label} url={url} />
          </li>
        ))}

        <form>
          <SignOutButton />
        </form>
      </ul>
    </aside>
  )
}
