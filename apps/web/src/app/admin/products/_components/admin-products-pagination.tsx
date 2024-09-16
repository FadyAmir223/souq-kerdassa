import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { getSectionRange, getTotalPages } from '@/utils/pagination'

type ProductsPaginationProps = {
  currPage: number
  setCurrPage: (newPage: number) => void
  totalProducts: number
}

export default function AdminProductsPagination({
  currPage,
  setCurrPage,
  totalProducts,
}: ProductsPaginationProps) {
  const totalPages = getTotalPages(totalProducts)
  const sectionRange = getSectionRange({ currPage, totalItems: totalProducts })

  if (totalPages < 2) return null

  return (
    <Pagination className='mt-6'>
      <PaginationContent>
        {currPage > 1 && (
          <PaginationItem>
            <Button variant='ghost' onClick={() => setCurrPage(currPage - 1)}>
              <ChevronRightIcon className='size-4' />
              <span>السابق</span>
            </Button>
          </PaginationItem>
        )}

        {sectionRange.map((pageNumber) => {
          const isActive = pageNumber === currPage

          return (
            <PaginationItem key={pageNumber}>
              <Button
                onClick={() => setCurrPage(pageNumber)}
                variant={isActive ? 'secondary' : 'ghost'}
                size='icon'
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </Button>
            </PaginationItem>
          )
        })}

        {(sectionRange.at(-1) ?? 1) < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currPage < totalPages && (
          <PaginationItem>
            <Button variant='ghost' onClick={() => setCurrPage(currPage + 1)}>
              <span>التالى</span>
              <ChevronLeftIcon className='size-4' />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
