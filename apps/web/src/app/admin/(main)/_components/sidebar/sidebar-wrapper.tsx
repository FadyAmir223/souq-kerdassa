'use client'

import type { PropsWithChildren } from 'react'

import { useAppStore } from '@/providers/app-store-provider'
import { cn } from '@/utils/cn'

export default function SidebarWrapper({ children }: PropsWithChildren) {
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen)

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 z-50 h-dvh w-16 border-r bg-zinc-300/70 transition-transform duration-300 md:w-[13.75rem] md:translate-x-0 lg:w-[17.5rem]',
        { 'translate-x-full': !isSidebarOpen },
      )}
    >
      {children}
    </div>
  )
}
