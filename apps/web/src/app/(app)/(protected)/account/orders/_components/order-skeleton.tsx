export default function OrderSkeleton() {
  return (
    <div className='animate-pulse rounded-md bg-white p-4 shadow-md'>
      <div className='mb-4 flex justify-between border-b border-b-gray-400 pb-4'>
        <div className='h-6 w-24 rounded-md bg-neutral-500/50 sm:w-[10.5rem]' />

        <div className='flex items-center gap-x-1'>
          <div className='h-5 w-[4.75rem] rounded-md bg-neutral-500/50' />
          <div className='grid size-6 place-items-center before:size-2 before:rounded-full before:bg-neutral-500/50' />
        </div>
      </div>

      <ul>
        {[1, 2].map((i) => (
          <li
            key={i}
            className='flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center sm:gap-y-0 sm:px-4 [&:not(:last-child)]:mb-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-gray-400 [&:not(:last-child)]:pb-4'
          >
            <div className='flex items-center gap-x-4'>
              <div className='aspect-[83/100] w-20 rounded-md bg-neutral-500/50' />

              <div>
                <div className='mb-[0.3125rem] h-[1.1875rem] w-20 rounded-md bg-neutral-500/50' />
                <div className='mb-1 h-[1.1875rem] w-12 rounded-md bg-neutral-500/50' />
                <div className='mb-1 h-[1.1875rem] w-12 rounded-md bg-neutral-500/50' />
                <div className='mb-1 h-[1.1875rem] w-[1.625rem] rounded-md bg-neutral-500/50' />
              </div>
            </div>

            <div className='h-[4.75rem] w-[6.25rem] rounded-md bg-neutral-500/50' />
          </li>
        ))}
      </ul>

      <div className='mt-4 flex justify-between border-t border-t-gray-400 pt-[1.125rem]'>
        <div className='h-7 w-28 rounded-md bg-neutral-500/50' />

        <div className='h-7 w-[4.25rem] rounded-md bg-neutral-500/50' />
      </div>
    </div>
  )
}
