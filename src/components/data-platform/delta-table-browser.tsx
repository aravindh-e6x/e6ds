"use client";

import * as React from "react";
import {
  Database,
  Table,
  Clock,
  History,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Search,
  Eye,
  GitCommit,
  MoreHorizontal,
  Copy,
  Trash2,
  Layers,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export interface DeltaColumn {
  name: string;
  type: string;
  nullable: boolean;
  comment?: string;
  partitionKey?: boolean;
}

export interface DeltaVersion {
  version: number;
  timestamp: Date;
  operation: string;
  operationParameters?: Record<string, unknown>;
  numFiles?: number;
  numRows?: number;
  sizeBytes?: number;
}

export interface DeltaTable {
  id: string;
  name: string;
  catalog: string;
  schema: string;
  location: string;
  columns: DeltaColumn[];
  partitionColumns?: string[];
  currentVersion: number;
  createdAt: Date;
  lastModified: Date;
  numFiles: number;
  sizeBytes: number;
  numRows?: number;
  comment?: string;
  properties?: Record<string, string>;
  history?: DeltaVersion[];
}

export interface DeltaTableBrowserProps {
  /** List of tables */
  tables: DeltaTable[];
  /** Currently selected table ID */
  selectedTableId?: string;
  /** Current view mode */
  viewMode?: "list" | "details";
  /** Callback when table is selected */
  onTableSelect?: (tableId: string | null) => void;
  /** Callback when table is previewed */
  onTablePreview?: (tableId: string) => void;
  /** Callback when table history is clicked */
  onTableHistory?: (tableId: string) => void;
  /** Callback when table is refreshed */
  onTableRefresh?: (tableId: string) => void;
  /** Callback when table is optimized */
  onTableOptimize?: (tableId: string) => void;
  /** Callback when vacuum is clicked */
  onTableVacuum?: (tableId: string) => void;
  /** Additional className */
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const DeltaTableBrowser = React.forwardRef<HTMLDivElement, DeltaTableBrowserProps>(
  (
    {
      tables,
      selectedTableId,
      onTableSelect,
      onTablePreview,
      onTableHistory,
      onTableRefresh,
      onTableOptimize,
      onTableVacuum,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedTable, setExpandedTable] = React.useState<string | null>(null);

    const filteredTables = tables.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.schema.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.catalog.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedTable = tables.find((t) => t.id === selectedTableId);

    return (
      <div ref={ref} className={cn("flex h-full bg-background", className)}>
        {/* Table list */}
        <div className="w-80 border-r flex flex-col">
          {/* Header */}
          <div className="px-3 py-2 border-b bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Delta Tables</span>
              <Badge variant="secondary" className="ml-auto">{tables.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables..."
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="flex-1 overflow-auto">
            {filteredTables.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <Table className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No tables found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredTables.map((table) => (
                  <div
                    key={table.id}
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors",
                      table.id === selectedTableId && "bg-muted"
                    )}
                    onClick={() => onTableSelect?.(table.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{table.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {table.catalog}.{table.schema}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTable(expandedTable === table.id ? null : table.id);
                        }}
                        className="p-0.5 hover:bg-muted rounded"
                      >
                        {expandedTable === table.id ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {expandedTable === table.id && (
                      <div className="mt-2 pl-6 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-3 w-3" />
                          <span>{formatBytes(table.sizeBytes)}</span>
                          <span>•</span>
                          <span>{table.numFiles} files</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="h-3 w-3" />
                          <span>v{table.currentVersion}</span>
                          <span>•</span>
                          <span>{table.columns.length} columns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Modified {formatRelativeTime(table.lastModified)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table details */}
        <div className="flex-1 flex flex-col">
          {selectedTable ? (
            <>
              {/* Table header */}
              <div className="px-4 py-3 border-b bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Table className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h2 className="font-semibold">{selectedTable.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedTable.catalog}.{selectedTable.schema}.{selectedTable.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTablePreview?.(selectedTable.id)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTableHistory?.(selectedTable.id)}
                    >
                      <History className="h-3.5 w-3.5 mr-1" />
                      History
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTableRefresh?.(selectedTable.id)}>
                          <RefreshCw className="h-3.5 w-3.5 mr-2" />
                          Refresh
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTableOptimize?.(selectedTable.id)}>
                          <Layers className="h-3.5 w-3.5 mr-2" />
                          Optimize
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTableVacuum?.(selectedTable.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Vacuum
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Copy Path
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    <span className="font-medium">{formatBytes(selectedTable.sizeBytes)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Files:</span>{" "}
                    <span className="font-medium">{selectedTable.numFiles}</span>
                  </div>
                  {selectedTable.numRows && (
                    <div>
                      <span className="text-muted-foreground">Rows:</span>{" "}
                      <span className="font-medium">{formatNumber(selectedTable.numRows)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Version:</span>{" "}
                    <span className="font-medium">v{selectedTable.currentVersion}</span>
                  </div>
                  {selectedTable.partitionColumns && selectedTable.partitionColumns.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Partitioned by:</span>{" "}
                      <span className="font-medium">{selectedTable.partitionColumns.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Schema */}
              <div className="flex-1 overflow-auto p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Schema</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium">Column</th>
                          <th className="text-left px-3 py-2 font-medium">Type</th>
                          <th className="text-left px-3 py-2 font-medium">Nullable</th>
                          <th className="text-left px-3 py-2 font-medium">Partition</th>
                          <th className="text-left px-3 py-2 font-medium">Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedTable.columns.map((col) => (
                          <tr key={col.name} className="hover:bg-muted/30">
                            <td className="px-3 py-2 font-mono text-xs">{col.name}</td>
                            <td className="px-3 py-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {col.type}
                              </Badge>
                            </td>
                            <td className="px-3 py-2">{col.nullable ? "Yes" : "No"}</td>
                            <td className="px-3 py-2">
                              {col.partitionKey && (
                                <Badge variant="secondary" className="text-xs">
                                  Partition Key
                                </Badge>
                              )}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground text-xs">
                              {col.comment || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Version History */}
                {selectedTable.history && selectedTable.history.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent History</h3>
                    <div className="space-y-2">
                      {selectedTable.history.slice(0, 5).map((version) => (
                        <div
                          key={version.version}
                          className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/30"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                            <GitCommit className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">v{version.version}</span>
                              <Badge variant="outline" className="text-xs">
                                {version.operation}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span>{formatRelativeTime(version.timestamp)}</span>
                              {version.numRows && <span>{formatNumber(version.numRows)} rows</span>}
                              {version.sizeBytes && <span>{formatBytes(version.sizeBytes)}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Properties */}
                {selectedTable.properties && Object.keys(selectedTable.properties).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Properties</h3>
                    <div className="border rounded-lg divide-y">
                      {Object.entries(selectedTable.properties).map(([key, value]) => (
                        <div key={key} className="flex items-center px-3 py-2 text-sm">
                          <span className="font-mono text-xs text-muted-foreground w-48 shrink-0">
                            {key}
                          </span>
                          <span className="truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Table className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a table</p>
                <p className="text-sm">Choose a table from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
DeltaTableBrowser.displayName = "DeltaTableBrowser";

export { DeltaTableBrowser };
