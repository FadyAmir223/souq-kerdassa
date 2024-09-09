import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'

type ReviewsPaginationProps = {
  reviewPage: number
  setReviewPage: (newPage: number) => void
  totalReviews: number
}

const REVIEWS_PER_PAGE = 3

export default function ReviewsPagination({
  reviewPage,
  setReviewPage,
  totalReviews,
}: ReviewsPaginationProps) {
  const totalPages = totalReviews / REVIEWS_PER_PAGE
  if (totalPages < 2) return null

  return (
    <Pagination className='mt-6'>
      <PaginationContent>
        {reviewPage > 0 && (
          <PaginationItem>
            <Button variant='ghost' onClick={() => setReviewPage(reviewPage - 1)}>
              <ChevronRightIcon className='size-4' />
              <span>السابق</span>
            </Button>
          </PaginationItem>
        )}

        {reviewPage < totalPages && (
          <PaginationItem>
            <Button variant='ghost' onClick={() => setReviewPage(reviewPage + 1)}>
              <span>التالى</span>
              <ChevronLeftIcon className='size-4' />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
