export default function CheckoutCartItemsSkeleton() {
  return (
    <div className='flex animate-pulse gap-x-3 rounded-md bg-white p-2.5 shadow-sm'>
      <div className='aspect-[83/100] w-20 rounded-md bg-neutral-500/50' />

      <div className='flex flex-1 items-center justify-between'>
        <div>
          <div className='mb-2 h-5 w-20 rounded-md bg-neutral-500/50' />
          <div className='mb-1.5 h-[1.125rem] w-14 rounded-md bg-neutral-500/50' />
          <div className='h-[1.125rem] w-14 rounded-md bg-neutral-500/50' />
        </div>
        <div className='mb-1 h-5 w-[4.25rem] rounded-md bg-neutral-500/50' />
      </div>
    </div>
  )
}
