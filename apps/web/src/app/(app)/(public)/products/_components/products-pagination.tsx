import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getSectionRange, getTotalPages } from '@/utils/pagination'

type ProductsPaginationProps = {
  currPage: number
  totalItems: number
}

export default function ProductsPagination({
  currPage,
  totalItems,
}: ProductsPaginationProps) {
  const totalPages = getTotalPages(totalItems)
  const sectionRange = getSectionRange({ currPage, totalItems })

  if (totalPages < 2) return null

  return (
    <Pagination className='mt-9'>
      <PaginationContent>
        {currPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={{ query: { page: currPage - 1 } }} />
          </PaginationItem>
        )}

        {(sectionRange[0] ?? 1) > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {sectionRange.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={{ query: { page: pageNumber } }}
              isActive={pageNumber === currPage}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {(sectionRange.at(-1) ?? 1) < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={{ query: { page: currPage + 1 } }} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
