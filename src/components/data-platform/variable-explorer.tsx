"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronDown,
  Variable,
  Hash,
  Type,
  List,
  Braces,
  Table,
  ToggleLeft,
  Calendar,
  Search,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";

export type VariableType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "dataframe"
  | "null"
  | "undefined"
  | "function"
  | "date"
  | "other";

export interface VariableInfo {
  name: string;
  type: VariableType;
  value: unknown;
  shape?: string; // For arrays/dataframes: "(100, 5)"
  size?: number; // Memory size in bytes
  children?: VariableInfo[];
}

export interface VariableExplorerProps {
  /** List of variables */
  variables: VariableInfo[];
  /** Title for the explorer */
  title?: string;
  /** Whether to show the search input */
  showSearch?: boolean;
  /** Whether to show type icons */
  showTypeIcons?: boolean;
  /** Whether to show memory size */
  showSize?: boolean;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Callback when a variable is clicked */
  onVariableClick?: (variable: VariableInfo) => void;
  /** Callback when a variable is deleted */
  onVariableDelete?: (variable: VariableInfo) => void;
  /** Maximum depth for nested objects */
  maxDepth?: number;
  /** Additional className */
  className?: string;
}

const typeIcons: Record<VariableType, React.ReactNode> = {
  string: <Type className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />,
  number: <Hash className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
  boolean: <ToggleLeft className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />,
  array: <List className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />,
  object: <Braces className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />,
  dataframe: <Table className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />,
  null: <Variable className="h-3.5 w-3.5 text-muted-foreground" />,
  undefined: <Variable className="h-3.5 w-3.5 text-muted-foreground" />,
  function: <Variable className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />,
  date: <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />,
  other: <Variable className="h-3.5 w-3.5 text-muted-foreground" />,
};

const formatValue = (variable: VariableInfo): string => {
  const { type, value, shape } = variable;

  if (value === null) return "null";
  if (value === undefined) return "undefined";

  switch (type) {
    case "string":
      const strVal = String(value);
      return strVal.length > 50 ? `"${strVal.slice(0, 50)}..."` : `"${strVal}"`;
    case "number":
      return String(value);
    case "boolean":
      return String(value);
    case "array":
      return shape ? `Array${shape}` : `Array(${(value as unknown[]).length})`;
    case "object":
      return shape || `Object`;
    case "dataframe":
      return shape ? `DataFrame${shape}` : "DataFrame";
    case "function":
      return "function()";
    case "date":
      return value instanceof Date ? value.toISOString() : String(value);
    default:
      return String(value);
  }
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface VariableRowProps {
  variable: VariableInfo;
  depth: number;
  maxDepth: number;
  showTypeIcons: boolean;
  showSize: boolean;
  onVariableClick?: (variable: VariableInfo) => void;
  onVariableDelete?: (variable: VariableInfo) => void;
}

const VariableRow: React.FC<VariableRowProps> = ({
  variable,
  depth,
  maxDepth,
  showTypeIcons,
  showSize,
  onVariableClick,
  onVariableDelete,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren =
    variable.children && variable.children.length > 0 && depth < maxDepth;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer",
          "text-sm"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onVariableClick?.(variable)}
      >
        {/* Expand/collapse */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : null}
        </span>

        {/* Type icon */}
        {showTypeIcons && (
          <span className="shrink-0">{typeIcons[variable.type]}</span>
        )}

        {/* Name */}
        <span className="font-medium text-foreground shrink-0">
          {variable.name}
        </span>

        {/* Type label */}
        <span className="text-xs text-muted-foreground shrink-0">
          {variable.type}
          {variable.shape && ` ${variable.shape}`}
        </span>

        {/* Value */}
        <span className="flex-1 text-muted-foreground truncate font-mono text-xs">
          {formatValue(variable)}
        </span>

        {/* Size */}
        {showSize && variable.size !== undefined && (
          <span className="text-xs text-muted-foreground shrink-0">
            {formatSize(variable.size)}
          </span>
        )}

        {/* Delete button */}
        {onVariableDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVariableDelete(variable);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {variable.children!.map((child, index) => (
            <VariableRow
              key={`${child.name}-${index}`}
              variable={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              showTypeIcons={showTypeIcons}
              showSize={showSize}
              onVariableClick={onVariableClick}
              onVariableDelete={onVariableDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const VariableExplorer = React.forwardRef<HTMLDivElement, VariableExplorerProps>(
  (
    {
      variables,
      title = "Variables",
      showSearch = true,
      showTypeIcons = true,
      showSize = true,
      onRefresh,
      onVariableClick,
      onVariableDelete,
      maxDepth = 3,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredVariables = React.useMemo(() => {
      if (!searchQuery) return variables;
      const query = searchQuery.toLowerCase();
      return variables.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.type.toLowerCase().includes(query)
      );
    }, [variables, searchQuery]);

    return (
      <div ref={ref} className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center gap-2">
            <Variable className="h-4 w-4" />
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">
              ({variables.length})
            </span>
          </div>
          {onRefresh && (
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={onRefresh}>
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
                placeholder="Filter variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
        )}

        {/* Variable list */}
        <div className="flex-1 overflow-auto">
          {filteredVariables.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No matching variables" : "No variables defined"}
            </div>
          ) : (
            filteredVariables.map((variable, index) => (
              <VariableRow
                key={`${variable.name}-${index}`}
                variable={variable}
                depth={0}
                maxDepth={maxDepth}
                showTypeIcons={showTypeIcons}
                showSize={showSize}
                onVariableClick={onVariableClick}
                onVariableDelete={onVariableDelete}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);
VariableExplorer.displayName = "VariableExplorer";

export { VariableExplorer };
