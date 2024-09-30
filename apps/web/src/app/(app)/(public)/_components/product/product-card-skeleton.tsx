export default function ProductCardSkeleton() {
  return (
    <li className='animate-pulse overflow-hidden rounded-lg bg-white shadow-lg'>
      <div className='aspect-[83/100] bg-neutral-500/50' />

      <div className='p-2.5'>
        <div className='mx-auto h-4 w-2/3 rounded-md bg-neutral-500/50' />
        <div className='my-3 flex justify-center gap-x-1'>
          <div className='h-3.5 w-24 rounded-md bg-neutral-500/50' />
          <span className='h-3.5 w-5 rounded-md bg-neutral-500/50' />
        </div>
        <div className='mx-auto h-4 w-1/2 rounded-md bg-neutral-500/50' />
      </div>
    </li>
  )
}
