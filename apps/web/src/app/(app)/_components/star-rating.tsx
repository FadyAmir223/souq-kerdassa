import { Fragment } from 'react'
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md'

import { cn } from '@/utils/cn'

const scales = {
  sm: 'scale-[1.17]',
  lg: 'scale-[1.5]',
}

type StarRatingProps = {
  rating: number
  scale?: keyof typeof scales
}

export default function StarRating({ rating, scale = 'sm' }: StarRatingProps) {
  return (
    <div className={cn('flex items-center', scales[scale])}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Fragment key={idx}>
          {idx + 1 <= rating ? (
            <span className='text-yellow-500'>
              <MdStar />
            </span>
          ) : idx + 1 > rating && idx < rating ? (
            <span className='-scale-x-100 text-yellow-500'>
              <MdStarHalf />
            </span>
          ) : (
            <span className='text-yellow-500'>
              <MdStarBorder />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
