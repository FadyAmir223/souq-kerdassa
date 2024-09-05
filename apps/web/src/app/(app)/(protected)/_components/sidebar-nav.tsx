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
  const segment = pathname.split('/').at(-1)

  return (
    <Link
      href={url}
      className={cn('block rounded-md px-3 py-1', {
        'pointer-events-none bg-primary/70 font-semibold': url === segment,
        'transition-colors hover:bg-primary/15': url !== segment,
      })}
    >
      {label}
    </Link>
  )
}
