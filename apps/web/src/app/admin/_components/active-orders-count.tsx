'use client'

import { Badge } from '@/components/ui/badge'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

export default function ActiveOrdersCount() {
  const { data: count } = api.order.admin.count.useQuery('pending', {
    staleTime: 3 * 60 * 1000,
  })

  return (
    <Badge
      className={cn(
        'me-auto hidden size-6 shrink-0 items-center justify-center rounded-full',
        { flex: count },
      )}
    >
      {count}
    </Badge>
  )
}
