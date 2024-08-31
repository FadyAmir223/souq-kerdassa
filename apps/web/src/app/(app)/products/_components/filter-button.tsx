'use client'

import { useSearchParams } from 'next/navigation'

import LinkWithParams from '@/components/link-with-params'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type FilterButtonProps = {
  filterKey: string
  label: string
  value: string
}

export default function FilterButton({
  filterKey,
  label,
  value,
}: FilterButtonProps) {
  const searchParams = useSearchParams()

  return (
    <Button
      key={label}
      className={cn(
        value === searchParams.get(filterKey) &&
          'pointer-events-none text-accent-foreground/80',
      )}
      asChild
      variant='outline'
      size='sm'
    >
      <LinkWithParams href={{ query: { [filterKey]: value, page: 1 } }} replace>
        {label}
      </LinkWithParams>
    </Button>
  )
}
