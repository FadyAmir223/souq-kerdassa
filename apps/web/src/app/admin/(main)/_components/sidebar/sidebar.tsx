import { Home, Package, ShoppingCart, Users } from 'lucide-react'

import { PAGES } from '../../../_utils/constants'
import ActiveOrdersCount from '../active-orders-count'
import NavLink from './nav-link'

const navs = [
  { href: PAGES.dashboard, label: 'الرئيسية', icon: Home },
  { href: PAGES.products.root, label: 'المنتجات', icon: Package },
  { href: PAGES.orders, label: 'الطلبات', icon: ShoppingCart },
  { href: PAGES.customers, label: 'العملاء', icon: Users },
]

export default function Sidebar() {
  return (
    <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
      {navs.map(({ href, label, icon: Icon }) => (
        <NavLink key={href} href={href} className='relative'>
          <Icon className='size-6 md:size-4' />

          <span className='hidden md:block'>{label}</span>
          {href === PAGES.orders && <ActiveOrdersCount />}
        </NavLink>
      ))}
    </nav>
  )
}
