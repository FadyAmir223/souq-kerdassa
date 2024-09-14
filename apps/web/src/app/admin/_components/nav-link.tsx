'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/cn'

type NavLinkProps = ComponentPropsWithoutRef<typeof Link>

export default function NavLink({
  children,
  href,
  className,
  ...props
}: NavLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        { 'bg-muted text-primary': pathname.startsWith(href as string) },
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
