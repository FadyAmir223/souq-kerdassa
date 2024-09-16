import { cn } from '@/utils/cn'

type SpinnerProps = {
  className?: string
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div className='grid h-full place-items-center'>
      <div
        className={cn(
          'size-12 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-gray-500 border-r-transparent',
          className,
        )}
      />
    </div>
  )
}
