"use client";

import * as React from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Square,
  Timer,
  Database,
  Rows3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";

export type QueryState =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "cancelled"
  | "queued";

export interface QueryStatusData {
  state: QueryState;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milliseconds
  rowCount?: number;
  bytesScanned?: number;
  errorMessage?: string;
  queryId?: string;
  progress?: number; // 0-100
  stage?: string;
}

export interface QueryStatusProps {
  /** Query status data */
  status: QueryStatusData;
  /** Display mode */
  mode?: "compact" | "detailed" | "inline";
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Additional className */
  className?: string;
}

const stateConfig: Record<
  QueryState,
  { icon: React.ReactNode; color: string; label: string }
> = {
  idle: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-muted-foreground",
    label: "Ready",
  },
  running: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    color: "text-blue-600 dark:text-blue-400",
    label: "Running",
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    label: "Completed",
  },
  error: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-destructive",
    label: "Error",
  },
  cancelled: {
    icon: <Square className="h-4 w-4" />,
    color: "text-muted-foreground",
    label: "Cancelled",
  },
  queued: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-yellow-600 dark:text-yellow-400",
    label: "Queued",
  },
};

const formatDuration = (ms?: number): string => {
  if (!ms) return "-";
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
};

const formatBytes = (bytes?: number): string => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const QueryStatus = React.forwardRef<HTMLDivElement, QueryStatusProps>(
  ({ status, mode = "detailed", onCancel, className }, ref) => {
    const config = stateConfig[status.state];

    if (mode === "inline") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2 text-sm", className)}
        >
          <span className={config.color}>{config.icon}</span>
          <span className={config.color}>{config.label}</span>
          {status.duration && (
            <span className="text-muted-foreground">
              {formatDuration(status.duration)}
            </span>
          )}
          {status.state === "running" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      );
    }

    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-3 px-3 py-2 bg-muted/30 border",
            className
          )}
        >
          <span className={config.color}>{config.icon}</span>
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>
          {status.progress !== undefined && status.state === "running" && (
            <div className="flex-1 max-w-32">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            </div>
          )}
          {status.duration && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {formatDuration(status.duration)}
            </span>
          )}
          {status.rowCount !== undefined && status.state === "success" && (
            <span className="text-sm text-muted-foreground">
              {status.rowCount.toLocaleString()} rows
            </span>
          )}
          {status.state === "running" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={onCancel}
            >
              <Square className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      );
    }

    // Detailed mode
    return (
      <div ref={ref} className={cn("border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
          <span className={config.color}>{config.icon}</span>
          <span className={cn("font-medium", config.color)}>{config.label}</span>
          {status.stage && status.state === "running" && (
            <span className="text-sm text-muted-foreground">
              - {status.stage}
            </span>
          )}
          <div className="flex-1" />
          {status.state === "running" && onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <Square className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>

        {/* Progress */}
        {status.progress !== undefined && status.state === "running" && (
          <div className="px-4 py-2 border-b">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span>{status.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {status.state === "error" && status.errorMessage && (
          <div className="px-4 py-3 border-b bg-destructive/10">
            <div className="flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{status.errorMessage}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground flex items-center gap-1 mb-1">
              <Timer className="h-3.5 w-3.5" />
              Duration
            </div>
            <div className="font-medium">{formatDuration(status.duration)}</div>
          </div>
          <div>
            <div className="text-muted-foreground flex items-center gap-1 mb-1">
              <Rows3 className="h-3.5 w-3.5" />
              Rows
            </div>
            <div className="font-medium">
              {status.rowCount?.toLocaleString() || "-"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground flex items-center gap-1 mb-1">
              <Database className="h-3.5 w-3.5" />
              Data Scanned
            </div>
            <div className="font-medium">
              {formatBytes(status.bytesScanned)}
            </div>
          </div>
        </div>

        {/* Query ID */}
        {status.queryId && (
          <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
            Query ID: {status.queryId}
          </div>
        )}
      </div>
    );
  }
);
QueryStatus.displayName = "QueryStatus";

export { QueryStatus };
