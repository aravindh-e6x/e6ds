"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
  showTotalRecords?: boolean;
  showFirstLast?: boolean;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      currentPage,
      totalPages,
      totalRecords,
      pageSize = 10,
      pageSizeOptions = [10, 20, 50, 100],
      onPageChange,
      onPageSizeChange,
      showPageSize = true,
      showTotalRecords = true,
      showFirstLast = true,
      ...props
    },
    ref
  ) => {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between gap-4", className)}
        {...props}
      >
        <div className="flex items-center gap-4">
          {showTotalRecords && totalRecords !== undefined && (
            <span className="text-sm text-muted-foreground">
              Total Records: <span className="font-medium text-foreground">{totalRecords}</span>
            </span>
          )}
          {showPageSize && onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {showFirstLast && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={!canGoPrevious}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </IconButton>
          )}
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </IconButton>

          <span className="text-sm px-2">
            {currentPage} of {totalPages}
          </span>

          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </IconButton>
          {showFirstLast && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoNext}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </IconButton>
          )}
        </div>
      </div>
    );
  }
);
Pagination.displayName = "Pagination";

export { Pagination };
