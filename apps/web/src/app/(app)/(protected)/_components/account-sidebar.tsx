import SidebarNav from './sidebar-nav'

const navs = [
  { label: 'معلومات الحساب', url: 'profile' },
  { label: 'عناوينى', url: 'address' },
  { label: 'طلباتى', url: 'orders' },
]

export default function AccountSidebar() {
  return (
    <aside className='h-fit rounded-md bg-white p-4 shadow-md md:min-w-72 lg:min-w-80'>
      <ul className='space-y-2 text-lg'>
        {navs.map(({ label, url }) => (
          <li
            key={url}
            className='border-b border-b-black/30 pb-2 last:border-b-0 last:pb-0'
          >
            <SidebarNav label={label} url={url} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
