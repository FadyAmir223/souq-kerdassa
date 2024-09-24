import StarRating from '@/app/(app)/(public)/_components/star-rating'

// TODO: remove if not used

export default function Reviews() {
  const reviews = [1, 2]

  if (reviews.length === 0) return <p>لا يوجد مراجعات</p>

  return (
    <ul>
      {reviews.map((i) => (
        <li
          key={i}
          className='[&:not(:last-child)]:mb-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-gray-400 [&:not(:last-child)]:pb-4'
        >
          <div className='mb-1 flex items-center justify-between'>
            <div>
              <span className='me-3 font-semibold'>سارة</span>
              <span className='text-sm text-gray-500'>منذ 1 أشهر</span>
            </div>

            <div className='mb-3 flex items-center gap-x-4'>
              <span className='text-lg font-semibold'>4.0</span>
              <StarRating rating={4} scale='sm' />
            </div>
          </div>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt nam
            consequuntur voluptate incidunt quod quisquam ea rerum praesentium
            voluptas, dignissimos eos recusandae facilis labore, quae sit eveniet
            cupiditate modi iste.
          </p>
        </li>
      ))}
    </ul>
  )
}
