import type { PaginationType } from '~/types'
import { Link } from './Link'

export function Pagination({ totalPages, currentPage, basePath = '/blog' }: PaginationType) {
  let hasPrevPage = currentPage - 1 > 0
  let hasNextPage = currentPage + 1 <= totalPages
  let prevHref = currentPage - 1 === 1 ? basePath : `${basePath}/page/${currentPage - 1}`
  let nextHref = `${basePath}/page/${currentPage + 1}`
  let getPageHref = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`)
  let PAGE_WINDOW_SIZE = 4
  let windowStart = Math.floor((currentPage - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1
  let windowEnd = Math.min(windowStart + PAGE_WINDOW_SIZE - 1, totalPages)
  let pageNumbers =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i)
  let showLeadingEllipsis = totalPages > 5 && windowStart > 1
  let showTrailingEllipsis = totalPages > 5 && windowEnd < totalPages
  let leadingEllipsisTarget = Math.max(windowStart - 1, 1)
  let trailingEllipsisTarget = Math.min(windowEnd + 1, totalPages)
  let controlClassName = 'vscode-action-link'
  let disabledControlClassName = `${controlClassName} cursor-not-allowed opacity-50`

  return (
    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
      <nav className="flex flex-wrap items-center justify-start gap-2">
        {!hasPrevPage && <span className={disabledControlClassName}>Previous</span>}
        {hasPrevPage && (
          <Link href={prevHref} className={controlClassName}>
            Previous
          </Link>
        )}
        {showLeadingEllipsis && (
          <Link href={getPageHref(leadingEllipsisTarget)} className={controlClassName}>
            more
          </Link>
        )}
        {pageNumbers.map((pageNumber) =>
          pageNumber === currentPage ? (
            <span
              key={pageNumber}
              className={`${controlClassName} cursor-default font-semibold`}
              aria-current="page"
            >
              {pageNumber}
            </span>
          ) : (
            <Link key={pageNumber} href={getPageHref(pageNumber)} className={controlClassName}>
              {pageNumber}
            </Link>
          )
        )}
        {showTrailingEllipsis && (
          <Link href={getPageHref(trailingEllipsisTarget)} className={controlClassName}>
            more
          </Link>
        )}
        {!hasNextPage && <span className={disabledControlClassName}>Next</span>}
        {hasNextPage && (
          <Link href={nextHref} className={controlClassName}>
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}
