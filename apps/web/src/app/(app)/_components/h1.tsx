import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/cn'

export default function H1({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1 className={cn('mb-3 text-2xl font-bold md:text-3xl', className)} {...props}>
      {children}
    </h1>
  )
}
