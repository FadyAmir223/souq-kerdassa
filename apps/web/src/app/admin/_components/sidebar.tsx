import { Home, Package, ShoppingCart, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import { PAGES } from '../_utils/constants'
import NavLink from './nav-link'

const navs = [
  { href: PAGES.dashboard, label: 'الرئيسية', icon: Home },
  { href: PAGES.products, label: 'المنتجات', icon: Package },
  { href: PAGES.orders, label: 'الطلبات', icon: ShoppingCart },
  { href: PAGES.customers, label: 'العملاء', icon: Users },
]

export default function Sidebar() {
  return (
    <div className='flex-1'>
      <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
        {navs.map((nav) => (
          <NavLink key={nav.href} href={nav.href}>
            <nav.icon className='size-4' />
            {nav.label}

            {nav.href === PAGES.orders && (
              <Badge className='me-auto flex size-6 shrink-0 items-center justify-center rounded-full'>
                6
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
