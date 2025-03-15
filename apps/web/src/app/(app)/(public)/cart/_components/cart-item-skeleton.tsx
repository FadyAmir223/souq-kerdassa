export default function CartItemSkeleton() {
  return (
    <div className='flex animate-pulse flex-col gap-y-2 rounded-md bg-white p-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex gap-x-5'>
        <div className='aspect-[83/100] w-24'>
          <div className='size-full rounded-md bg-neutral-500/50' />
        </div>

        <div className='self-center'>
          <div className='mb-3 h-5 w-[5.75rem] rounded-sm bg-neutral-500/50' />
          <div className='space-y-1.5'>
            <div className='h-[1.125rem] w-14 rounded-md bg-neutral-500/50' />
            <div className='h-[1.125rem] w-12 rounded-md bg-neutral-500/50' />
            <div className='flex gap-x-2'>
              <div className='h-[1.125rem] w-[4.2rem] rounded-md bg-neutral-500/50' />
              <div className='h-[1.125rem] w-8 rounded-md bg-neutral-500/50' />
            </div>
          </div>
        </div>
      </div>

      <div className='h-6 w-[5.25rem] rounded-sm bg-neutral-500/50 sm:self-center' />

      <div className='h-7 w-[5.75rem] rounded-sm bg-neutral-500/50 sm:self-center' />

      <div className='size-8 rounded-md bg-neutral-500/50' />
    </div>
  )
}
