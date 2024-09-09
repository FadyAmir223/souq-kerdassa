'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/utils/cn'

type SidebarNavProps = {
  label: string
  url: string
}

export default function SidebarNav({ label, url }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <Link
      href={url}
      className={cn('block rounded-md px-3 py-1', {
        'pointer-events-none bg-gray-400/50 font-semibold': url === pathname,
        'transition-colors hover:bg-gray-400/25': url !== pathname,
      })}
    >
      {label}
    </Link>
  )
}
