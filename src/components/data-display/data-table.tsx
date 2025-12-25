"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  onRowClick?: (row: T, index: number) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
}

function DataTableComponent<T extends Record<string, unknown>>(
  {
    className,
    data,
    columns,
    loading,
    emptyMessage = "No data available",
    striped = false,
    hoverable = true,
    compact = false,
    stickyHeader = false,
    onRowClick,
    sortColumn,
    sortDirection,
    onSort,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const getCellValue = (row: T, key: keyof T | string): unknown => {
    if (typeof key === "string" && key.includes(".")) {
      return key.split(".").reduce<unknown>((obj, k) => (obj as Record<string, unknown>)?.[k], row as unknown);
    }
    return row[key as keyof T];
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortColumn !== column.key) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div
      ref={ref}
      className={cn("border bg-card overflow-hidden", className)}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={cn(
              "border-b bg-muted/50",
              stickyHeader && "sticky top-0 z-10"
            )}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "text-left text-sm font-medium text-muted-foreground",
                    compact ? "px-3 py-2" : "px-4 py-3",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.sortable && "cursor-pointer select-none hover:text-foreground"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && onSort?.(String(column.key))}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end"
                    )}
                  >
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={cn(
                    "text-center text-muted-foreground",
                    compact ? "px-3 py-8" : "px-4 py-12"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={cn(
                    "text-center text-muted-foreground",
                    compact ? "px-3 py-8" : "px-4 py-12"
                  )}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b last:border-0",
                    striped && rowIndex % 2 === 1 && "bg-muted/30",
                    hoverable && "hover:bg-muted/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column) => {
                    const value = getCellValue(row, column.key);
                    return (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "text-sm",
                          compact ? "px-3 py-2" : "px-4 py-3",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(value, row, rowIndex)
                          : String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DataTable = React.forwardRef(DataTableComponent) as <T extends Record<string, unknown>>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export { DataTable };
