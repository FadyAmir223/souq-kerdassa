export default function ProductCardSkeleton() {
  return (
    <div className='animate-pulse overflow-hidden rounded-lg bg-white text-center shadow-lg'>
      <div className='relative aspect-[83/100] bg-neutral-500' />

      <div className='p-2.5'>
        <div className='mx-auto h-4 w-2/3 rounded-sm bg-neutral-500' />
        <div className='my-3 flex justify-center gap-x-1'>
          <div className='h-3.5 w-24 rounded-sm bg-neutral-500' />
          <span className='h-3.5 w-5 rounded-sm bg-neutral-500' />
        </div>
        <div className='mx-auto h-4 w-1/2 rounded-sm bg-neutral-500 font-bold text-primary' />
      </div>
    </div>
  )
}
