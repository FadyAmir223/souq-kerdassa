export default function ProductDetailsSkeleton() {
  return (
    <>
      <div className='order-2 flex flex-1 animate-pulse flex-col md:order-none'>
        <div className='mb-5 h-[1.875rem] w-36 rounded-md bg-neutral-500/50' />
        <div className='mb-[1.375rem] h-5 w-[9.5rem] rounded-md bg-neutral-500/50' />
        <div className='mb-7 h-6 w-[7.5rem] rounded-md bg-neutral-500/50' />

        <div className=''>
          {[1, 2].map((i) => (
            <div key={i} className='flex gap-x-6 first:mb-5'>
              <div className='mb-3.5 h-[1.375rem] w-14 rounded-md bg-neutral-500/50' />
              <div className='flex gap-x-2'>
                <div className='h-8 w-[4.3rem] rounded-md bg-neutral-500/50' />
                <div className='h-8 w-[4.3rem] rounded-md bg-neutral-500/50' />
              </div>
            </div>
          ))}

          <div className='mt-5 h-10 w-[9.5rem] rounded-md bg-neutral-500/50' />
        </div>

        <div className='mt-auto max-w-lg'>
          <div className='mx-auto mb-4 h-7 w-[4.5rem] rounded-md bg-neutral-500/50' />

          <div className='mb-1.5 h-4 w-full rounded-md bg-neutral-500/50' />
          <div className='mb-1.5 h-4 w-full rounded-md bg-neutral-500/50' />
          <div className='mb-1 h-4 w-1/3 rounded-md bg-neutral-500/50' />
        </div>
      </div>

      <div className='order-1 mr-auto animate-pulse md:order-none md:w-1/3 lg:max-w-80'>
        <div className='mb-5 aspect-[83/100] w-full rounded-md bg-neutral-500/50' />

        <div className='grid grid-cols-4 gap-3.5'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='aspect-[83/100] flex-1 rounded-md bg-neutral-500/50'
            />
          ))}
        </div>
      </div>
    </>
  )
}
