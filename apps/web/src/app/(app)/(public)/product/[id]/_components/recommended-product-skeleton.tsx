export default function RecommendedProductSkeleton() {
  return (
    <div className='flex h-36 animate-pulse justify-between gap-x-2 rounded-md bg-white p-2 shadow-md'>
      <div className='aspect-[83/100] rounded-md bg-neutral-500/50' />

      <div className='flex-1 px-2 py-3.5'>
        <div className='h-4 w-24 rounded-md bg-neutral-500/50' />
        <div className='my-3.5 h-4 w-28 rounded-md bg-neutral-500/50' />
        <div className='h-4 w-20 rounded-md bg-neutral-500/50' />
      </div>
    </div>
  )
}
