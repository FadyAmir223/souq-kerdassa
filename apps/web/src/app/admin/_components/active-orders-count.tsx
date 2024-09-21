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
        'absolute bottom-0 left-0 me-auto hidden size-4 shrink-0 -translate-y-1/4 translate-x-1/2 items-center justify-center rounded-full p-0 md:static md:size-5 md:translate-x-0 md:translate-y-0 md:px-2.5 md:py-0.5 md:text-[0.8125rem]',
        { flex: count },
      )}
    >
      {count}
    </Badge>
  )
}
