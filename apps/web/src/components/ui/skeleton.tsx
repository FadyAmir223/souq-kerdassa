import { cn } from '@/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-500/50', className)}
      {...props}
    />
  )
}

export { Skeleton }
