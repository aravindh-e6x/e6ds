"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronDown,
  Database,
  Table,
  Columns,
  Key,
  Search,
  RefreshCw,
  MoreHorizontal,
  Copy,
  Eye,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type ColumnDataType =
  | "string"
  | "varchar"
  | "text"
  | "int"
  | "integer"
  | "bigint"
  | "float"
  | "double"
  | "decimal"
  | "boolean"
  | "date"
  | "timestamp"
  | "datetime"
  | "array"
  | "map"
  | "struct"
  | "json"
  | "binary"
  | "unknown";

export interface ColumnSchema {
  name: string;
  type: ColumnDataType;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isPartitionKey?: boolean;
  comment?: string;
  defaultValue?: string;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount?: number;
  sizeBytes?: number;
  lastModified?: Date;
  comment?: string;
  isView?: boolean;
}

export interface SchemaInfo {
  name: string;
  tables: TableSchema[];
}

export interface CatalogInfo {
  name: string;
  schemas: SchemaInfo[];
}

export interface SchemaViewerProps {
  /** Catalog data */
  catalogs: CatalogInfo[];
  /** Currently selected item path */
  selectedPath?: string;
  /** Callback when an item is selected */
  onSelect?: (path: string, type: "catalog" | "schema" | "table" | "column") => void;
  /** Callback when preview is clicked */
  onPreview?: (tablePath: string) => void;
  /** Callback when copy is clicked */
  onCopy?: (path: string) => void;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Whether to show search */
  showSearch?: boolean;
  /** Whether to show column details */
  showColumnDetails?: boolean;
  /** Additional className */
  className?: string;
}

const formatSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatRowCount = (count?: number): string => {
  if (!count) return "";
  if (count < 1000) return String(count);
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

interface TreeNodeProps {
  label: string;
  path: string;
  type: "catalog" | "schema" | "table" | "column";
  icon: React.ReactNode;
  children?: React.ReactNode;
  isSelected?: boolean;
  metadata?: React.ReactNode;
  onSelect?: (path: string, type: "catalog" | "schema" | "table" | "column") => void;
  onPreview?: () => void;
  onCopy?: () => void;
  depth?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  path,
  type,
  icon,
  children,
  isSelected,
  metadata,
  onSelect,
  onPreview,
  onCopy,
  depth = 0,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren = !!children;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 hover:bg-accent cursor-pointer",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded);
          onSelect?.(path, type);
        }}
      >
        {/* Expand/collapse */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )
          ) : null}
        </span>

        {/* Icon */}
        <span className="shrink-0">{icon}</span>

        {/* Label */}
        <span className="flex-1 text-sm truncate">{label}</span>

        {/* Metadata */}
        {metadata && (
          <span className="text-xs text-muted-foreground shrink-0">
            {metadata}
          </span>
        )}

        {/* Actions */}
        {(onPreview || onCopy) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPreview && (
                <DropdownMenuItem onClick={onPreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Data
                </DropdownMenuItem>
              )}
              {onCopy && (
                <DropdownMenuItem onClick={onCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Name
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && children}
    </div>
  );
};

const ColumnNode: React.FC<{
  column: ColumnSchema;
  path: string;
  isSelected?: boolean;
  showDetails?: boolean;
  onSelect?: (path: string, type: "column") => void;
  onCopy?: () => void;
  depth: number;
}> = ({ column, path, isSelected, showDetails, onSelect, onCopy, depth }) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-1 py-1 px-2 hover:bg-accent cursor-pointer",
        isSelected && "bg-accent"
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      onClick={() => onSelect?.(path, "column")}
    >
      {/* Spacer for alignment */}
      <span className="w-4 h-4 shrink-0" />

      {/* Icon */}
      <span className="shrink-0">
        {column.isPrimaryKey ? (
          <Key className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
        ) : column.isForeignKey ? (
          <Key className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        ) : (
          <Columns className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </span>

      {/* Name */}
      <span className="text-sm truncate">{column.name}</span>

      {/* Type */}
      {showDetails && (
        <span className="text-xs text-muted-foreground font-mono">
          {column.type}
          {column.nullable === false && (
            <span className="text-orange-600 dark:text-orange-400 ml-1">NOT NULL</span>
          )}
        </span>
      )}

      {/* Partition indicator */}
      {column.isPartitionKey && (
        <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-1 rounded">
          partition
        </span>
      )}

      <span className="flex-1" />

      {/* Copy */}
      {onCopy && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

const SchemaViewer = React.forwardRef<HTMLDivElement, SchemaViewerProps>(
  (
    {
      catalogs,
      selectedPath,
      onSelect,
      onPreview,
      onCopy,
      onRefresh,
      showSearch = true,
      showColumnDetails = true,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [_expandedPaths, _setExpandedPaths] = React.useState<Set<string>>(
      new Set()
    );

    const filteredCatalogs = React.useMemo(() => {
      if (!searchQuery) return catalogs;

      const query = searchQuery.toLowerCase();

      return catalogs
        .map((catalog) => ({
          ...catalog,
          schemas: catalog.schemas
            .map((schema) => ({
              ...schema,
              tables: schema.tables.filter(
                (table) =>
                  table.name.toLowerCase().includes(query) ||
                  table.columns.some((col) =>
                    col.name.toLowerCase().includes(query)
                  )
              ),
            }))
            .filter((schema) => schema.tables.length > 0),
        }))
        .filter((catalog) => catalog.schemas.length > 0);
    }, [catalogs, searchQuery]);

    return (
      <div ref={ref} className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Schema Browser</span>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={onRefresh}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Search */}
        {showSearch && (
          <div className="px-3 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables, columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
        )}

        {/* Tree */}
        <div className="flex-1 overflow-auto py-1">
          {filteredCatalogs.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No matching items" : "No catalogs available"}
            </div>
          ) : (
            filteredCatalogs.map((catalog) => (
              <TreeNode
                key={catalog.name}
                label={catalog.name}
                path={catalog.name}
                type="catalog"
                icon={<Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
                isSelected={selectedPath === catalog.name}
                onSelect={onSelect}
                onCopy={() => onCopy?.(catalog.name)}
                depth={0}
              >
                {catalog.schemas.map((schema) => (
                  <TreeNode
                    key={`${catalog.name}.${schema.name}`}
                    label={schema.name}
                    path={`${catalog.name}.${schema.name}`}
                    type="schema"
                    icon={<Database className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    isSelected={selectedPath === `${catalog.name}.${schema.name}`}
                    metadata={`${schema.tables.length} tables`}
                    onSelect={onSelect}
                    onCopy={() => onCopy?.(`${catalog.name}.${schema.name}`)}
                    depth={1}
                  >
                    {schema.tables.map((table) => {
                      const tablePath = `${catalog.name}.${schema.name}.${table.name}`;
                      return (
                        <TreeNode
                          key={tablePath}
                          label={table.name}
                          path={tablePath}
                          type="table"
                          icon={
                            table.isView ? (
                              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <Table className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            )
                          }
                          isSelected={selectedPath === tablePath}
                          metadata={
                            <>
                              {table.rowCount && (
                                <span className="mr-2">
                                  {formatRowCount(table.rowCount)} rows
                                </span>
                              )}
                              {table.sizeBytes && (
                                <span>{formatSize(table.sizeBytes)}</span>
                              )}
                            </>
                          }
                          onSelect={onSelect}
                          onPreview={() => onPreview?.(tablePath)}
                          onCopy={() => onCopy?.(tablePath)}
                          depth={2}
                        >
                          {table.columns.map((column) => {
                            const columnPath = `${tablePath}.${column.name}`;
                            return (
                              <ColumnNode
                                key={columnPath}
                                column={column}
                                path={columnPath}
                                isSelected={selectedPath === columnPath}
                                showDetails={showColumnDetails}
                                onSelect={onSelect}
                                onCopy={() => onCopy?.(column.name)}
                                depth={3}
                              />
                            );
                          })}
                        </TreeNode>
                      );
                    })}
                  </TreeNode>
                ))}
              </TreeNode>
            ))
          )}
        </div>
      </div>
    );
  }
);
SchemaViewer.displayName = "SchemaViewer";

export { SchemaViewer };
