'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ComponentPropsWithoutRef } from 'react'

type LinkWithParamsProps = ComponentPropsWithoutRef<typeof Link>

export default function LinkWithParams({ href, ...props }: LinkWithParamsProps) {
  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())

  return (
    <Link
      href={{
        // @ts-expect-error bad next.js types
        pathname: href.pathname,
        // @ts-expect-error bad next.js types
        query: { ...params, ...href.query },
      }}
      {...props}
    />
  )
}
