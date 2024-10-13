'use client'

import type { PropsWithChildren } from 'react'

import { useAppStore } from '@/providers/app-store-provider'
import { cn } from '@/utils/cn'

export default function PageWrapper({ children }: PropsWithChildren) {
  const isSidebarOpen = useAppStore(({ isSidebarOpen }) => isSidebarOpen)

  return (
    <div
      className={cn('flex flex-col duration-300 md:ms-[13.75rem] lg:ms-[17.5rem]', {
        'ms-16': isSidebarOpen,
      })}
    >
      {children}
    </div>
  )
}
