"use client";

import * as React from "react";
import {
  Copy,
  Download,
  Maximize2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Table as TableIcon,
  FileText,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";

export type OutputType =
  | "text"
  | "table"
  | "error"
  | "html"
  | "image"
  | "chart"
  | "json"
  | "markdown";

export interface TableData {
  columns: Array<{ name: string; type?: string }>;
  rows: unknown[][];
  totalRows?: number;
}

export interface OutputData {
  type: OutputType;
  data: unknown;
  mimeType?: string;
}

export interface OutputRendererProps {
  /** Output data to render */
  output: OutputData;
  /** Execution time in seconds */
  executionTime?: number;
  /** Number of rows affected (for SQL) */
  rowsAffected?: number;
  /** Whether the output is expanded */
  isExpanded?: boolean;
  /** Maximum height before scrolling */
  maxHeight?: number;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Callback when copy is clicked */
  onCopy?: () => void;
  /** Callback when download is clicked */
  onDownload?: () => void;
  /** Callback when expand/collapse is toggled */
  onExpandToggle?: () => void;
  /** Callback when fullscreen is toggled */
  onFullscreen?: () => void;
  /** Additional className */
  className?: string;
}

const outputTypeIcons: Record<OutputType, React.ReactNode> = {
  text: <FileText className="h-4 w-4" />,
  table: <TableIcon className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4 text-destructive" />,
  html: <FileText className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  chart: <BarChart3 className="h-4 w-4" />,
  json: <FileText className="h-4 w-4" />,
  markdown: <FileText className="h-4 w-4" />,
};

const TextOutput: React.FC<{ data: string; maxHeight?: number }> = ({
  data,
  maxHeight,
}) => (
  <pre
    className="text-sm font-mono whitespace-pre-wrap p-3 bg-muted/30 overflow-auto"
    style={{ maxHeight }}
  >
    {data}
  </pre>
);

const ErrorOutput: React.FC<{ data: string | { message: string; traceback?: string } }> = ({
  data,
}) => {
  const errorData = typeof data === "string" ? { message: data } : data;

  return (
    <div className="p-3 bg-destructive/10 border border-destructive/20">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-destructive">{errorData.message}</p>
          {errorData.traceback && (
            <pre className="mt-2 text-xs font-mono text-destructive/80 whitespace-pre-wrap overflow-auto max-h-60">
              {errorData.traceback}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

const TableOutput: React.FC<{ data: TableData; maxHeight?: number }> = ({
  data,
  maxHeight = 400,
}) => {
  const [sortColumn, setSortColumn] = React.useState<number | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const sortedRows = React.useMemo(() => {
    if (sortColumn === null) return data.rows;

    return [...data.rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data.rows, sortColumn, sortDirection]);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
  };

  return (
    <div className="overflow-auto" style={{ maxHeight }}>
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-muted">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground border-b w-12">
              #
            </th>
            {data.columns.map((col, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-medium border-b cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort(i)}
              >
                <div className="flex items-center gap-1">
                  <span>{col.name}</span>
                  {col.type && (
                    <span className="text-xs text-muted-foreground font-normal">
                      ({col.type})
                    </span>
                  )}
                  {sortColumn === i && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30">
              <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2">
                  {cell === null || cell === undefined ? (
                    <span className="text-muted-foreground italic">null</span>
                  ) : typeof cell === "object" ? (
                    <span className="font-mono text-xs">
                      {JSON.stringify(cell)}
                    </span>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.totalRows && data.totalRows > data.rows.length && (
        <div className="px-3 py-2 text-sm text-muted-foreground bg-muted/50 border-t">
          Showing {data.rows.length} of {data.totalRows} rows
        </div>
      )}
    </div>
  );
};

const JsonOutput: React.FC<{ data: unknown; maxHeight?: number }> = ({
  data,
  maxHeight,
}) => (
  <pre
    className="text-sm font-mono whitespace-pre-wrap p-3 bg-muted/30 overflow-auto"
    style={{ maxHeight }}
  >
    {JSON.stringify(data, null, 2)}
  </pre>
);

const ImageOutput: React.FC<{ data: string }> = ({ data }) => (
  <div className="p-3 flex justify-center">
    <img src={data} alt="Output" className="max-w-full max-h-96 object-contain" />
  </div>
);

const HtmlOutput: React.FC<{ data: string }> = ({ data }) => (
  <div
    className="p-3 prose prose-sm max-w-none dark:prose-invert"
    dangerouslySetInnerHTML={{ __html: data }}
  />
);

const OutputRenderer = React.forwardRef<HTMLDivElement, OutputRendererProps>(
  (
    {
      output,
      executionTime,
      rowsAffected,
      isExpanded = true,
      maxHeight = 400,
      showHeader = true,
      onCopy,
      onDownload,
      onExpandToggle,
      onFullscreen,
      className,
    },
    ref
  ) => {
    const renderContent = () => {
      switch (output.type) {
        case "text":
          return <TextOutput data={String(output.data)} maxHeight={maxHeight} />;
        case "error":
          return <ErrorOutput data={output.data as string | { message: string; traceback?: string }} />;
        case "table":
          return <TableOutput data={output.data as TableData} maxHeight={maxHeight} />;
        case "json":
          return <JsonOutput data={output.data} maxHeight={maxHeight} />;
        case "image":
          return <ImageOutput data={String(output.data)} />;
        case "html":
          return <HtmlOutput data={String(output.data)} />;
        default:
          return <TextOutput data={JSON.stringify(output.data, null, 2)} maxHeight={maxHeight} />;
      }
    };

    return (
      <div ref={ref} className={cn("border bg-background", className)}>
        {/* Header */}
        {showHeader && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-b">
            {outputTypeIcons[output.type]}
            <span className="text-xs font-medium capitalize">{output.type}</span>

            {/* Metadata */}
            <div className="flex-1 flex items-center gap-3 text-xs text-muted-foreground">
              {executionTime !== undefined && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500 dark:text-green-400" />
                  {executionTime.toFixed(2)}s
                </span>
              )}
              {rowsAffected !== undefined && (
                <span>{rowsAffected} rows</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {onCopy && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={onCopy}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={onDownload}
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
              {onFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={onFullscreen}
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              )}
              {onExpandToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={onExpandToggle}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {isExpanded && renderContent()}
      </div>
    );
  }
);
OutputRenderer.displayName = "OutputRenderer";

export { OutputRenderer };
