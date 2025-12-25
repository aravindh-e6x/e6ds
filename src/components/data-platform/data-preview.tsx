"use client";

import * as React from "react";
import {
  RefreshCw,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  AlertCircle,
  Table as TableIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";

export interface ColumnDefinition {
  name: string;
  type: string;
}

export interface DataPreviewProps {
  /** Table name being previewed */
  tableName?: string;
  /** Column definitions */
  columns: ColumnDefinition[];
  /** Row data */
  rows: unknown[][];
  /** Total row count in the table */
  totalRows?: number;
  /** Current page (0-indexed) */
  page?: number;
  /** Rows per page */
  pageSize?: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Callback when download is clicked */
  onDownload?: () => void;
  /** Callback when copy is clicked */
  onCopy?: () => void;
  /** Maximum height */
  maxHeight?: number;
  /** Additional className */
  className?: string;
}

const DataPreview = React.forwardRef<HTMLDivElement, DataPreviewProps>(
  (
    {
      tableName,
      columns,
      rows,
      totalRows,
      page = 0,
      pageSize = 100,
      isLoading = false,
      error,
      onRefresh,
      onPageChange,
      onPageSizeChange,
      onDownload,
      onCopy,
      maxHeight = 500,
      className,
    },
    ref
  ) => {
    const totalPages = totalRows ? Math.ceil(totalRows / pageSize) : 1;
    const startRow = page * pageSize + 1;
    const endRow = Math.min((page + 1) * pageSize, totalRows || rows.length);

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
          <span className="font-mono text-xs">
            {JSON.stringify(value).slice(0, 50)}
            {JSON.stringify(value).length > 50 && "..."}
          </span>
        );
      }
      const strValue = String(value);
      if (strValue.length > 100) {
        return strValue.slice(0, 100) + "...";
      }
      return strValue;
    };

    return (
      <div ref={ref} className={cn("flex flex-col border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
          <TableIcon className="h-4 w-4 text-muted-foreground" />
          {tableName && (
            <span className="font-medium text-sm">{tableName}</span>
          )}
          <span className="text-sm text-muted-foreground">
            {totalRows?.toLocaleString() || rows.length} rows
          </span>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
              </Button>
            )}
            {onCopy && (
              <Button variant="ghost" size="sm" onClick={onCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="flex items-center gap-2 px-4 py-8 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            No data to preview
          </div>
        ) : (
          <div className="overflow-auto" style={{ maxHeight }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted z-10">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground border-b w-12">
                    #
                  </th>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left font-medium border-b whitespace-nowrap"
                    >
                      <div>{col.name}</div>
                      <div className="text-xs font-normal text-muted-foreground">
                        {col.type}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-2 text-muted-foreground text-xs">
                      {startRow + rowIndex}
                    </td>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 max-w-xs truncate"
                      >
                        {formatCellValue(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {startRow}-{endRow}
                {totalRows && ` of ${totalRows.toLocaleString()}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Page size */}
              {onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page:
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => onPageSizeChange(Number(v))}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="250">250</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Pagination */}
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
        )}
      </div>
    );
  }
);
DataPreview.displayName = "DataPreview";

export { DataPreview };
