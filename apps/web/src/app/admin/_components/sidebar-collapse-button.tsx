'use client'

import { ListCollapse } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/providers/app-store-provider'

export default function SidebarCollapseButton() {
  const toggleSidebar = useAppStore(({ toggleSidebar }) => toggleSidebar)

  return (
    <Button
      size='sm'
      className='h-7 active:scale-[0.97] md:hidden'
      onClick={toggleSidebar}
    >
      <ListCollapse className='size-3.5' />
      <span className='sr-only'>اظهر القائمة</span>
    </Button>
  )
}
