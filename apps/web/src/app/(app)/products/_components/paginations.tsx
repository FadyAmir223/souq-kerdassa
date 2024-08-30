import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { getSectionRange, getTotalPages } from '../_utils/pagination'

type PaginationsProps = {
  currPage: number
  totalItems: number
}

export default function Paginations({ currPage, totalItems }: PaginationsProps) {
  const totalPages = getTotalPages(totalItems)
  const sectionRange = getSectionRange(currPage, totalItems)

  return (
    <Pagination>
      <PaginationContent>
        {currPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={{ href: '.', query: { page: currPage - 1 } }}
            />
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
              href={{ href: '.', query: { page: pageNumber } }}
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
            <PaginationNext href={{ href: '.', query: { page: currPage + 1 } }} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
