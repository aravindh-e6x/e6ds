"use client";

import * as React from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Database,
  Copy,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type ExportFormat = "csv" | "json" | "excel" | "parquet" | "clipboard";

export interface ExportOption {
  format: ExportFormat;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ExportMenuProps {
  /** Available export options */
  options?: ExportOption[];
  /** Whether export is in progress */
  isExporting?: boolean;
  /** Currently exporting format */
  exportingFormat?: ExportFormat;
  /** Callback when export is clicked */
  onExport?: (format: ExportFormat) => void;
  /** Number of rows to export */
  rowCount?: number;
  /** Whether to show row count warning */
  showRowCountWarning?: boolean;
  /** Row count threshold for warning */
  rowCountWarningThreshold?: number;
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
  /** Button size */
  size?: "default" | "sm" | "lg";
  /** Additional className */
  className?: string;
}

const defaultOptions: ExportOption[] = [
  {
    format: "csv",
    label: "CSV",
    description: "Comma-separated values",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    format: "json",
    label: "JSON",
    description: "JavaScript Object Notation",
    icon: <FileJson className="h-4 w-4" />,
  },
  {
    format: "excel",
    label: "Excel",
    description: "Microsoft Excel (.xlsx)",
    icon: <FileSpreadsheet className="h-4 w-4" />,
  },
  {
    format: "parquet",
    label: "Parquet",
    description: "Apache Parquet format",
    icon: <Database className="h-4 w-4" />,
  },
  {
    format: "clipboard",
    label: "Copy to Clipboard",
    description: "Copy as tab-separated values",
    icon: <Copy className="h-4 w-4" />,
  },
];

const ExportMenu = React.forwardRef<HTMLButtonElement, ExportMenuProps>(
  (
    {
      options = defaultOptions,
      isExporting = false,
      exportingFormat,
      onExport,
      rowCount,
      showRowCountWarning = true,
      rowCountWarningThreshold = 100000,
      variant = "outline",
      size = "sm",
      className,
    },
    ref
  ) => {
    const showWarning =
      showRowCountWarning &&
      rowCount !== undefined &&
      rowCount > rowCountWarningThreshold;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant={variant}
            size={size}
            disabled={isExporting}
            className={className}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            Export
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Row count info */}
          {rowCount !== undefined && (
            <>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {rowCount.toLocaleString()} rows
                {showWarning && (
                  <span className="text-yellow-600 ml-1">
                    (large export)
                  </span>
                )}
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Export options */}
          {options.map((option) => {
            const isCurrentlyExporting =
              isExporting && exportingFormat === option.format;

            return (
              <DropdownMenuItem
                key={option.format}
                disabled={option.disabled || isExporting}
                onClick={() => onExport?.(option.format)}
              >
                <span className="mr-2">
                  {isCurrentlyExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    option.icon
                  )}
                </span>
                <div className="flex-1">
                  <div>{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ExportMenu.displayName = "ExportMenu";

export { ExportMenu };
