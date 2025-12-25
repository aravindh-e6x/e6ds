"use client";

import * as React from "react";
import {
  Table,
  Rows3,
  HardDrive,
  Calendar,
  Columns,
  Layers,
  Clock,
  FileText,
  RefreshCw,
  User,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { formatDistanceToNow } from "date-fns";

export interface PartitionInfo {
  column: string;
  type: string;
  values?: string[];
}

export interface TableStatsData {
  name: string;
  schema?: string;
  catalog?: string;
  rowCount?: number;
  sizeBytes?: number;
  columnCount?: number;
  partitions?: PartitionInfo[];
  partitionCount?: number;
  createdAt?: Date;
  lastModified?: Date;
  lastAccessedAt?: Date;
  owner?: string;
  description?: string;
  format?: string;
  location?: string;
  isView?: boolean;
  viewDefinition?: string;
  properties?: Record<string, string>;
}

export interface TableStatsProps {
  /** Table statistics data */
  stats: TableStatsData;
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Callback when view definition is clicked */
  onViewDefinition?: () => void;
  /** Additional className */
  className?: string;
}

const formatSize = (bytes?: number): string => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes < 1024 * 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1)} TB`;
};

const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return "-";
  return num.toLocaleString();
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <span className="text-muted-foreground shrink-0 mt-0.5">{icon}</span>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium truncate">{value}</div>
    </div>
  </div>
);

const TableStats = React.forwardRef<HTMLDivElement, TableStatsProps>(
  (
    { stats, showDetails = true, onRefresh, onViewDefinition, className },
    ref
  ) => {
    const fullPath = [stats.catalog, stats.schema, stats.name]
      .filter(Boolean)
      .join(".");

    return (
      <div ref={ref} className={cn("border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
          {stats.isView ? (
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <Table className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{stats.name}</div>
            {(stats.catalog || stats.schema) && (
              <div className="text-xs text-muted-foreground truncate">
                {fullPath}
              </div>
            )}
          </div>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Stats grid */}
        <div className="px-4 py-2 grid grid-cols-2 gap-x-4 border-b">
          <StatItem
            icon={<Rows3 className="h-4 w-4" />}
            label="Row Count"
            value={formatNumber(stats.rowCount)}
          />
          <StatItem
            icon={<HardDrive className="h-4 w-4" />}
            label="Size"
            value={formatSize(stats.sizeBytes)}
          />
          <StatItem
            icon={<Columns className="h-4 w-4" />}
            label="Columns"
            value={formatNumber(stats.columnCount)}
          />
          <StatItem
            icon={<Layers className="h-4 w-4" />}
            label="Partitions"
            value={formatNumber(stats.partitionCount)}
          />
        </div>

        {/* Timestamps */}
        <div className="px-4 py-2 border-b">
          {stats.lastModified && (
            <StatItem
              icon={<Clock className="h-4 w-4" />}
              label="Last Modified"
              value={formatDistanceToNow(stats.lastModified, {
                addSuffix: true,
              })}
            />
          )}
          {stats.createdAt && (
            <StatItem
              icon={<Calendar className="h-4 w-4" />}
              label="Created"
              value={formatDistanceToNow(stats.createdAt, { addSuffix: true })}
            />
          )}
          {stats.owner && (
            <StatItem
              icon={<User className="h-4 w-4" />}
              label="Owner"
              value={stats.owner}
            />
          )}
        </div>

        {/* Description */}
        {stats.description && (
          <div className="px-4 py-3 border-b">
            <div className="text-xs text-muted-foreground mb-1">
              Description
            </div>
            <div className="text-sm">{stats.description}</div>
          </div>
        )}

        {/* Partition info */}
        {showDetails && stats.partitions && stats.partitions.length > 0 && (
          <div className="px-4 py-3 border-b">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              Partition Columns
            </div>
            <div className="space-y-1">
              {stats.partitions.map((partition, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm bg-muted/50 px-2 py-1 rounded"
                >
                  <span className="font-medium">{partition.column}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {partition.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View definition */}
        {stats.isView && stats.viewDefinition && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                View Definition
              </span>
              {onViewDefinition && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6"
                  onClick={onViewDefinition}
                >
                  Open
                </Button>
              )}
            </div>
            <pre className="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-32">
              {stats.viewDefinition}
            </pre>
          </div>
        )}

        {/* Additional properties */}
        {showDetails && stats.properties && Object.keys(stats.properties).length > 0 && (
          <div className="px-4 py-3">
            <div className="text-xs text-muted-foreground mb-2">Properties</div>
            <div className="space-y-1">
              {Object.entries(stats.properties).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {showDetails && stats.location && (
          <div className="px-4 py-3 border-t">
            <div className="text-xs text-muted-foreground mb-1">Location</div>
            <div className="text-xs font-mono text-muted-foreground truncate">
              {stats.location}
            </div>
          </div>
        )}
      </div>
    );
  }
);
TableStats.displayName = "TableStats";

export { TableStats };
