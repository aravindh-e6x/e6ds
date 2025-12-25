"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Settings2,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export interface ColumnDef {
  id: string;
  name: string;
  type?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  resizable?: boolean;
  pinned?: "left" | "right" | false;
  hidden?: boolean;
  align?: "left" | "center" | "right";
  formatter?: (value: unknown, row: unknown[]) => React.ReactNode;
}

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface ResultsTableProps {
  /** Column definitions */
  columns: ColumnDef[];
  /** Row data (array of arrays, matching column order) */
  rows: unknown[][];
  /** Total row count (for pagination) */
  totalRows?: number;
  /** Current page (0-indexed) */
  page?: number;
  /** Rows per page */
  pageSize?: number;
  /** Sort state */
  sort?: SortState;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Callback when sort changes */
  onSortChange?: (sort: SortState) => void;
  /** Callback when column is resized */
  onColumnResize?: (columnId: string, width: number) => void;
  /** Callback when columns are reordered */
  onColumnReorder?: (columns: ColumnDef[]) => void;
  /** Callback when column visibility changes */
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  /** Callback when column is pinned */
  onColumnPin?: (columnId: string, pinned: "left" | "right" | false) => void;
  /** Callback when copy is clicked */
  onCopy?: (data: unknown[][]) => void;
  /** Callback when download is clicked */
  onDownload?: () => void;
  /** Selected row indices */
  selectedRows?: number[];
  /** Callback when selection changes */
  onSelectionChange?: (indices: number[]) => void;
  /** Maximum height */
  maxHeight?: number;
  /** Row height */
  rowHeight?: number;
  /** Additional className */
  className?: string;
}

const formatCellValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">null</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span className={value ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
        {String(value)}
      </span>
    );
  }
  if (typeof value === "number") {
    return <span className="font-mono">{value.toLocaleString()}</span>;
  }
  if (typeof value === "object") {
    return (
      <span className="font-mono text-xs truncate">
        {JSON.stringify(value)}
      </span>
    );
  }
  return String(value);
};

const ResultsTable = React.forwardRef<HTMLDivElement, ResultsTableProps>(
  (
    {
      columns,
      rows,
      totalRows,
      page = 0,
      pageSize = 100,
      sort,
      isLoading = false,
      onPageChange,
      onPageSizeChange: _onPageSizeChange,
      onSortChange,
      onColumnResize,
      onColumnVisibilityChange,
      onColumnPin: _onColumnPin,
      onCopy,
      onDownload,
      selectedRows = [],
      onSelectionChange,
      maxHeight = 500,
      rowHeight = 32,
      className,
    },
    ref
  ) => {
    const [resizing, setResizing] = React.useState<{
      columnId: string;
      startX: number;
      startWidth: number;
    } | null>(null);

    const visibleColumns = columns.filter((c) => !c.hidden);
    const totalPages = totalRows ? Math.ceil(totalRows / pageSize) : 1;
    const startRow = page * pageSize + 1;
    const endRow = Math.min((page + 1) * pageSize, totalRows || rows.length);

    const handleSort = (columnId: string) => {
      if (!onSortChange) return;

      if (sort?.columnId === columnId) {
        if (sort.direction === "asc") {
          onSortChange({ columnId, direction: "desc" });
        } else if (sort.direction === "desc") {
          onSortChange({ columnId, direction: null });
        } else {
          onSortChange({ columnId, direction: "asc" });
        }
      } else {
        onSortChange({ columnId, direction: "asc" });
      }
    };

    const handleResizeStart = (
      e: React.MouseEvent,
      columnId: string,
      currentWidth: number
    ) => {
      e.preventDefault();
      setResizing({ columnId, startX: e.clientX, startWidth: currentWidth });
    };

    React.useEffect(() => {
      if (!resizing) return;

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - resizing.startX;
        const newWidth = Math.max(50, resizing.startWidth + diff);
        onColumnResize?.(resizing.columnId, newWidth);
      };

      const handleMouseUp = () => {
        setResizing(null);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [resizing, onColumnResize]);

    const handleRowClick = (index: number, e: React.MouseEvent) => {
      if (!onSelectionChange) return;

      if (e.ctrlKey || e.metaKey) {
        if (selectedRows.includes(index)) {
          onSelectionChange(selectedRows.filter((i) => i !== index));
        } else {
          onSelectionChange([...selectedRows, index]);
        }
      } else if (e.shiftKey && selectedRows.length > 0) {
        const last = selectedRows[selectedRows.length - 1];
        const start = Math.min(last, index);
        const end = Math.max(last, index);
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        onSelectionChange([...new Set([...selectedRows, ...range])]);
      } else {
        onSelectionChange([index]);
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col border bg-card", className)}>
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          <span className="text-sm text-muted-foreground">
            {totalRows?.toLocaleString() || rows.length} rows
          </span>

          <div className="flex-1" />

          {/* Column settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Columns
              </div>
              {columns.map((col) => (
                <DropdownMenuItem
                  key={col.id}
                  onClick={() =>
                    onColumnVisibilityChange?.(col.id, !!col.hidden)
                  }
                >
                  <span className="flex-1">{col.name}</span>
                  {col.hidden && <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(rows)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}

          {onDownload && (
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-auto" style={{ maxHeight }}>
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-muted">
              <tr>
                {/* Row number column */}
                <th className="px-2 py-2 text-left font-medium text-muted-foreground border-b w-12 sticky left-0 bg-muted">
                  #
                </th>
                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className={cn(
                      "relative px-3 py-2 font-medium border-b whitespace-nowrap",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.sortable && "cursor-pointer hover:bg-muted/80"
                    )}
                    style={{ width: col.width, minWidth: col.minWidth }}
                    onClick={() => col.sortable && handleSort(col.id)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.name}</span>
                      {col.type && (
                        <span className="text-xs font-normal text-muted-foreground">
                          ({col.type})
                        </span>
                      )}
                      {col.sortable && (
                        <span className="ml-auto">
                          {sort?.columnId === col.id ? (
                            sort.direction === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : sort.direction === "desc" ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Resize handle */}
                    {col.resizable !== false && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary"
                        onMouseDown={(e) =>
                          handleResizeStart(e, col.id, col.width || 100)
                        }
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="py-16 text-center"
                  >
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b hover:bg-muted/30 transition-colors",
                      selectedRows.includes(rowIndex) && "bg-accent"
                    )}
                    style={{ height: rowHeight }}
                    onClick={(e) => handleRowClick(rowIndex, e)}
                  >
                    <td className="px-2 py-1 text-muted-foreground text-xs sticky left-0 bg-background">
                      {startRow + rowIndex}
                    </td>
                    {visibleColumns.map((col) => {
                      const originalIndex = columns.findIndex(
                        (c) => c.id === col.id
                      );
                      const value = row[originalIndex];

                      return (
                        <td
                          key={col.id}
                          className={cn(
                            "px-3 py-1 truncate",
                            col.align === "center" && "text-center",
                            col.align === "right" && "text-right"
                          )}
                          style={{ maxWidth: col.maxWidth }}
                        >
                          {col.formatter
                            ? col.formatter(value, row)
                            : formatCellValue(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
          <div className="text-sm text-muted-foreground">
            {selectedRows.length > 0 ? (
              <span>{selectedRows.length} selected</span>
            ) : (
              <span>
                Showing {startRow}-{endRow}
                {totalRows && ` of ${totalRows.toLocaleString()}`}
              </span>
            )}
          </div>

          {onPageChange && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(0)}
                disabled={page === 0}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(totalPages - 1)}
                disabled={page >= totalPages - 1}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ResultsTable.displayName = "ResultsTable";

export { ResultsTable };
