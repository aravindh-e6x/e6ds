"use client";

import * as React from "react";
import {
  Key,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  List,
  Braces,
  Binary,
  Copy,
  Info,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";

export type ColumnDataType =
  | "string"
  | "varchar"
  | "text"
  | "char"
  | "int"
  | "integer"
  | "bigint"
  | "smallint"
  | "tinyint"
  | "float"
  | "double"
  | "decimal"
  | "numeric"
  | "boolean"
  | "bool"
  | "date"
  | "timestamp"
  | "datetime"
  | "time"
  | "array"
  | "map"
  | "struct"
  | "json"
  | "binary"
  | "blob"
  | "uuid"
  | "unknown";

export interface ColumnStatistics {
  nullCount?: number;
  nullPercentage?: number;
  distinctCount?: number;
  minValue?: string | number;
  maxValue?: string | number;
  avgValue?: number;
  sampleValues?: (string | number | null)[];
}

export interface ColumnInfoData {
  name: string;
  type: ColumnDataType;
  rawType?: string;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isPartitionKey?: boolean;
  isClusterKey?: boolean;
  comment?: string;
  defaultValue?: string;
  precision?: number;
  scale?: number;
  maxLength?: number;
  statistics?: ColumnStatistics;
  foreignKeyRef?: {
    table: string;
    column: string;
  };
}

export interface ColumnInfoProps {
  /** Column data */
  column: ColumnInfoData;
  /** Whether to show statistics */
  showStatistics?: boolean;
  /** Whether to show sample values */
  showSampleValues?: boolean;
  /** Callback when copy is clicked */
  onCopy?: (text: string) => void;
  /** Callback when foreign key is clicked */
  onForeignKeyClick?: (table: string, column: string) => void;
  /** Display mode */
  mode?: "compact" | "detailed";
  /** Additional className */
  className?: string;
}

const dataTypeIcons: Record<string, React.ReactNode> = {
  string: <Type className="h-4 w-4 text-green-600 dark:text-green-400" />,
  varchar: <Type className="h-4 w-4 text-green-600 dark:text-green-400" />,
  text: <Type className="h-4 w-4 text-green-600 dark:text-green-400" />,
  char: <Type className="h-4 w-4 text-green-600 dark:text-green-400" />,
  int: <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  integer: <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  bigint: <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  smallint: <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  tinyint: <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  float: <Hash className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  double: <Hash className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  decimal: <Hash className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  numeric: <Hash className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  boolean: <ToggleLeft className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  bool: <ToggleLeft className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  date: <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  timestamp: <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  datetime: <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  time: <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  array: <List className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  map: <Braces className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  struct: <Braces className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  json: <Braces className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  binary: <Binary className="h-4 w-4 text-gray-600 dark:text-gray-400" />,
  blob: <Binary className="h-4 w-4 text-gray-600 dark:text-gray-400" />,
  uuid: <Hash className="h-4 w-4 text-pink-600 dark:text-pink-400" />,
  unknown: <Info className="h-4 w-4 text-muted-foreground" />,
};

const ColumnInfo = React.forwardRef<HTMLDivElement, ColumnInfoProps>(
  (
    {
      column,
      showStatistics = true,
      showSampleValues = true,
      onCopy,
      onForeignKeyClick,
      mode = "detailed",
      className,
    },
    ref
  ) => {
    const icon = dataTypeIcons[column.type] || dataTypeIcons.unknown;

    const formatTypeString = () => {
      let typeStr = column.rawType || column.type;

      if (column.maxLength) {
        typeStr += `(${column.maxLength})`;
      } else if (column.precision !== undefined) {
        typeStr += column.scale !== undefined
          ? `(${column.precision}, ${column.scale})`
          : `(${column.precision})`;
      }

      return typeStr;
    };

    if (mode === "compact") {
      return (
        <TooltipProvider>
          <div
            ref={ref}
            className={cn(
              "flex items-center gap-2 py-1 px-2 hover:bg-muted/50",
              className
            )}
          >
            {/* Key indicators */}
            {column.isPrimaryKey && (
              <Tooltip>
                <TooltipTrigger>
                  <Key className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                </TooltipTrigger>
                <TooltipContent>Primary Key</TooltipContent>
              </Tooltip>
            )}
            {column.isForeignKey && (
              <Tooltip>
                <TooltipTrigger>
                  <Key className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </TooltipTrigger>
                <TooltipContent>
                  Foreign Key → {column.foreignKeyRef?.table}.
                  {column.foreignKeyRef?.column}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Icon */}
            <span className="shrink-0">{icon}</span>

            {/* Name */}
            <span className="font-medium text-sm">{column.name}</span>

            {/* Type */}
            <span className="text-xs text-muted-foreground font-mono">
              {formatTypeString()}
            </span>

            {/* Nullable */}
            {column.nullable === false && (
              <span className="text-xs text-orange-600 dark:text-orange-400">NOT NULL</span>
            )}

            {/* Partition */}
            {column.isPartitionKey && (
              <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-1 rounded">
                partition
              </span>
            )}
          </div>
        </TooltipProvider>
      );
    }

    return (
      <div ref={ref} className={cn("border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
          {icon}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{column.name}</span>
              {column.isPrimaryKey && (
                <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-1.5 py-0.5 rounded">
                  PK
                </span>
              )}
              {column.isForeignKey && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  FK
                </span>
              )}
              {column.isPartitionKey && (
                <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-1.5 py-0.5 rounded">
                  Partition
                </span>
              )}
              {column.isClusterKey && (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                  Cluster
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {formatTypeString()}
              {column.nullable === false && " NOT NULL"}
            </div>
          </div>
          {onCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(column.name)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Details */}
        <div className="px-4 py-3 space-y-3">
          {/* Comment */}
          {column.comment && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Description</div>
              <div className="text-sm">{column.comment}</div>
            </div>
          )}

          {/* Default value */}
          {column.defaultValue && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Default</div>
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">
                {column.defaultValue}
              </code>
            </div>
          )}

          {/* Foreign key reference */}
          {column.foreignKeyRef && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">References</div>
              <button
                onClick={() =>
                  onForeignKeyClick?.(
                    column.foreignKeyRef!.table,
                    column.foreignKeyRef!.column
                  )
                }
                className="text-sm text-link hover:underline"
              >
                {column.foreignKeyRef.table}.{column.foreignKeyRef.column}
              </button>
            </div>
          )}

          {/* Statistics */}
          {showStatistics && column.statistics && (
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Statistics
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {column.statistics.distinctCount !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Distinct: </span>
                    <span>{column.statistics.distinctCount.toLocaleString()}</span>
                  </div>
                )}
                {column.statistics.nullPercentage !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Null: </span>
                    <span>{column.statistics.nullPercentage.toFixed(1)}%</span>
                  </div>
                )}
                {column.statistics.minValue !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Min: </span>
                    <span className="font-mono">
                      {String(column.statistics.minValue)}
                    </span>
                  </div>
                )}
                {column.statistics.maxValue !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Max: </span>
                    <span className="font-mono">
                      {String(column.statistics.maxValue)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sample values */}
          {showSampleValues && column.statistics?.sampleValues && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">
                Sample Values
              </div>
              <div className="flex flex-wrap gap-1">
                {column.statistics.sampleValues.slice(0, 5).map((value, i) => (
                  <code
                    key={i}
                    className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
                  >
                    {value === null ? "NULL" : String(value)}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ColumnInfo.displayName = "ColumnInfo";

export { ColumnInfo };
