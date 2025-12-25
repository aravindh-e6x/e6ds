"use client";

import * as React from "react";
import {
  Layers,
  Database,
  Clock,
  User,
  Search,
  MoreHorizontal,
  Trash2,
  Copy,
  Eye,
  RefreshCw,
  Tag,
  ChevronDown,
  ChevronRight,
  Table,
  Zap,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
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

export type FeatureDataType = "STRING" | "INT" | "FLOAT" | "DOUBLE" | "BOOLEAN" | "TIMESTAMP" | "ARRAY" | "MAP";
export type FeatureStatus = "ACTIVE" | "DEPRECATED" | "PENDING";

export interface Feature {
  name: string;
  dataType: FeatureDataType;
  description?: string;
  tags?: string[];
  createdAt: Date;
  lastUpdated: Date;
  statistics?: {
    min?: number;
    max?: number;
    mean?: number;
    nullCount?: number;
    distinctCount?: number;
  };
}

export interface FeatureTable {
  id: string;
  name: string;
  description?: string;
  primaryKeys: string[];
  timestampKeys?: string[];
  features: Feature[];
  dataSource: {
    type: "delta" | "parquet" | "streaming";
    path: string;
  };
  status: FeatureStatus;
  createdAt: Date;
  lastUpdated: Date;
  createdBy?: string;
  tags?: string[];
  onlineStoreEnabled?: boolean;
  refreshSchedule?: string;
}

export interface FeatureStoreProps {
  /** List of feature tables */
  featureTables: FeatureTable[];
  /** Currently selected table ID */
  selectedTableId?: string;
  /** Callback when table is selected */
  onTableSelect?: (tableId: string | null) => void;
  /** Callback when feature is clicked */
  onFeatureClick?: (tableId: string, featureName: string) => void;
  /** Callback when table is refreshed */
  onTableRefresh?: (tableId: string) => void;
  /** Callback when table is deleted */
  onTableDelete?: (tableId: string) => void;
  /** Callback when new table is created */
  onTableCreate?: () => void;
  /** Additional className */
  className?: string;
}

const dataTypeColors: Record<FeatureDataType, string> = {
  STRING: "text-green-600 dark:text-green-400",
  INT: "text-blue-600 dark:text-blue-400",
  FLOAT: "text-purple-600 dark:text-purple-400",
  DOUBLE: "text-purple-600 dark:text-purple-400",
  BOOLEAN: "text-orange-600 dark:text-orange-400",
  TIMESTAMP: "text-cyan-600 dark:text-cyan-400",
  ARRAY: "text-pink-600 dark:text-pink-400",
  MAP: "text-yellow-600 dark:text-yellow-400",
};

const statusConfig: Record<FeatureStatus, { icon: React.ReactNode; color: string }> = {
  ACTIVE: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-green-600 dark:text-green-400",
  },
  DEPRECATED: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  PENDING: {
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
  },
};

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

const FeatureStore = React.forwardRef<HTMLDivElement, FeatureStoreProps>(
  (
    {
      featureTables,
      selectedTableId,
      onTableSelect,
      onFeatureClick,
      onTableRefresh,
      onTableDelete,
      onTableCreate,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedTables, setExpandedTables] = React.useState<Set<string>>(
      new Set(selectedTableId ? [selectedTableId] : [])
    );

    const selectedTable = featureTables.find((t) => t.id === selectedTableId);

    const filteredTables = featureTables.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.features.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const toggleTable = (id: string) => {
      const next = new Set(expandedTables);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setExpandedTables(next);
    };

    const totalFeatures = featureTables.reduce((acc, t) => acc + t.features.length, 0);

    return (
      <div ref={ref} className={cn("flex h-full bg-background", className)}>
        {/* Table list */}
        <div className="w-80 border-r flex flex-col">
          <div className="px-3 py-2 border-b bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Feature Store</span>
              </div>
              <Button size="sm" variant="outline" onClick={onTableCreate}>
                <Table className="h-3.5 w-3.5 mr-1" />
                New Table
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features..."
                className="pl-8 h-8 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{featureTables.length} tables</span>
              <span>•</span>
              <span>{totalFeatures} features</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredTables.map((table) => (
              <div key={table.id} className="border-b">
                <div
                  className={cn(
                    "px-3 py-2 cursor-pointer hover:bg-muted/50 flex items-center gap-2",
                    table.id === selectedTableId && "bg-muted"
                  )}
                  onClick={() => {
                    onTableSelect?.(table.id);
                    toggleTable(table.id);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTable(table.id);
                    }}
                    className="p-0.5"
                  >
                    {expandedTables.has(table.id) ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <Table className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{table.name}</p>
                      <span className={statusConfig[table.status].color}>
                        {statusConfig[table.status].icon}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {table.features.length} features
                    </p>
                  </div>
                  {table.onlineStoreEnabled && (
                    <span title="Online store enabled"><Zap className="h-3.5 w-3.5 text-yellow-500" /></span>
                  )}
                </div>

                {expandedTables.has(table.id) && (
                  <div className="pl-8 pb-2">
                    {table.features.slice(0, 8).map((feature) => (
                      <div
                        key={feature.name}
                        className="px-2 py-1 mx-2 rounded flex items-center gap-2 cursor-pointer hover:bg-muted/50 text-xs"
                        onClick={() => onFeatureClick?.(table.id, feature.name)}
                      >
                        <span className={cn("font-mono", dataTypeColors[feature.dataType])}>
                          {feature.dataType.toLowerCase()}
                        </span>
                        <span className="truncate">{feature.name}</span>
                      </div>
                    ))}
                    {table.features.length > 8 && (
                      <p className="px-2 mx-2 text-xs text-muted-foreground">
                        +{table.features.length - 8} more
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Table details */}
        <div className="flex-1 flex flex-col">
          {selectedTable ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Table className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{selectedTable.name}</h2>
                        <Badge
                          variant="outline"
                          className={statusConfig[selectedTable.status].color}
                        >
                          {selectedTable.status}
                        </Badge>
                        {selectedTable.onlineStoreEnabled && (
                          <Badge variant="secondary" className="gap-1">
                            <Zap className="h-3 w-3" />
                            Online
                          </Badge>
                        )}
                      </div>
                      {selectedTable.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedTable.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTableRefresh?.(selectedTable.id)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Refresh
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          Preview Data
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Copy Path
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onTableDelete?.(selectedTable.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {selectedTable.createdBy && (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {selectedTable.createdBy}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Updated {formatRelativeTime(selectedTable.lastUpdated)}
                  </span>
                  {selectedTable.refreshSchedule && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {selectedTable.refreshSchedule}
                    </span>
                  )}
                </div>

                {/* Keys */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Primary Keys:</span>
                    {selectedTable.primaryKeys.map((key) => (
                      <Badge key={key} variant="outline" className="font-mono text-xs">
                        {key}
                      </Badge>
                    ))}
                  </div>
                  {selectedTable.timestampKeys && selectedTable.timestampKeys.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Timestamp:</span>
                      {selectedTable.timestampKeys.map((key) => (
                        <Badge key={key} variant="outline" className="font-mono text-xs">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Data source */}
                <div className="flex items-center gap-2 mt-3 p-2 bg-muted/30 rounded-lg">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {selectedTable.dataSource.type}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-xs truncate">{selectedTable.dataSource.path}</span>
                </div>
              </div>

              {/* Features list */}
              <div className="flex-1 overflow-auto p-4">
                <h3 className="text-sm font-medium mb-3">
                  Features ({selectedTable.features.length})
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Name</th>
                        <th className="text-left px-3 py-2 font-medium">Type</th>
                        <th className="text-left px-3 py-2 font-medium">Description</th>
                        <th className="text-left px-3 py-2 font-medium">Statistics</th>
                        <th className="text-left px-3 py-2 font-medium">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedTable.features.map((feature) => (
                        <tr
                          key={feature.name}
                          className="hover:bg-muted/30 cursor-pointer"
                          onClick={() => onFeatureClick?.(selectedTable.id, feature.name)}
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{feature.name}</span>
                              {feature.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant="outline"
                              className={cn("font-mono text-xs", dataTypeColors[feature.dataType])}
                            >
                              {feature.dataType}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground text-xs max-w-xs truncate">
                            {feature.description || "-"}
                          </td>
                          <td className="px-3 py-2">
                            {feature.statistics ? (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {feature.statistics.min !== undefined && (
                                  <span>min: {feature.statistics.min}</span>
                                )}
                                {feature.statistics.max !== undefined && (
                                  <span>max: {feature.statistics.max}</span>
                                )}
                                {feature.statistics.nullCount !== undefined && (
                                  <span>nulls: {feature.statistics.nullCount}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {formatRelativeTime(feature.lastUpdated)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tags */}
                {selectedTable.tags && selectedTable.tags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex items-center gap-2">
                      {selectedTable.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a feature table</p>
                <p className="text-sm">Choose a table from the list to view its features</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
FeatureStore.displayName = "FeatureStore";

export { FeatureStore };
