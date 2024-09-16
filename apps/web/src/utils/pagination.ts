export function getTotalPages(totalItems: number, PER_PAGE = 10) {
  return Math.ceil(totalItems / PER_PAGE)
}

export function getSectionRange({
  currPage,
  totalItems,
  NEIGHBORS = 3,
}: {
  currPage: number
  totalItems: number
  NEIGHBORS?: number
}) {
  const totalPages = getTotalPages(totalItems)
  const perSection = Math.min(NEIGHBORS * 2 - 1, totalPages)

  let start = currPage - NEIGHBORS

  if (start < 1) start = 1
  else if (start + perSection - 1 > totalPages)
    start -= start + perSection - 1 - totalPages

  return Array.from({ length: perSection }, (_, i) => start + i)
}
