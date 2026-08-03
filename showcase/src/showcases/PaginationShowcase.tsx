import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@registry/ui/pagination"
import type { MouseEvent } from "react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const totalPages = 12

export function PaginationOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  void locale
  const [page, setPage] = useState(3)

  function goTo(pageNumber: number) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setPage(Math.min(totalPages, Math.max(1, pageNumber)))
    }
  }

  return (
    <div className="grid gap-4">
      <h4
        className="text-center font-mono text-xs tracking-widest text-muted-foreground uppercase"
        data-demo="pagination-status"
      >
        Page {page} of {totalPages}
      </h4>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              data-demo="pagination-previous"
              href="#previous"
              onClick={goTo(page - 1)}
            />
          </PaginationItem>
          {page > 2 ? (
            <PaginationItem>
              <PaginationLink href="#page-1" onClick={goTo(1)}>
                1
              </PaginationLink>
            </PaginationItem>
          ) : null}
          {page > 3 ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : null}
          {page > 1 ? (
            <PaginationItem>
              <PaginationLink href={`#page-${page - 1}`} onClick={goTo(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          ) : null}
          <PaginationItem>
            <PaginationLink data-demo="pagination-current" href={`#page-${page}`} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < totalPages ? (
            <PaginationItem>
              <PaginationLink href={`#page-${page + 1}`} onClick={goTo(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ) : null}
          {page < totalPages - 2 ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : null}
          {page < totalPages - 1 ? (
            <PaginationItem>
              <PaginationLink href={`#page-${totalPages}`} onClick={goTo(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          ) : null}
          <PaginationItem>
            <PaginationNext data-demo="pagination-next" href="#next" onClick={goTo(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
