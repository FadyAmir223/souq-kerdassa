export default function ReviewsSectionSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='mb-7'>
        <div className='mb-2.5 h-7 w-[13.5rem] rounded-md bg-neutral-500/50' />
        <div className='h-5 w-16 rounded-md bg-neutral-500/50' />
      </div>

      <ul className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className='rounded-md bg-white px-4 py-5 shadow-sm'>
            <div className='mb-3 h-5 w-64 rounded-md bg-neutral-500/50' />
            <div className='h-4 w-4/5 rounded-md bg-neutral-500/50' />
          </li>
        ))}
      </ul>

      <div className='mx-auto mt-8 flex w-fit gap-x-4'>
        <div className='h-6 w-16 rounded-md bg-neutral-500/50' />
        <div className='h-6 w-16 rounded-md bg-neutral-500/50' />
      </div>
    </div>
  )
}
