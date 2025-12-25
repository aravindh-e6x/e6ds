"use client";

import * as React from "react";
import {
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  MoreHorizontal,
  Timer,
  Calendar,
  User,
  Zap,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { formatDistanceToNow, format } from "date-fns";

export type JobRunStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "cancelled"
  | "skipped"
  | "timeout";

export type TriggerType = "manual" | "scheduled" | "api" | "retry" | "workflow";

export interface JobRunData {
  id: string;
  jobId: string;
  jobName: string;
  runNumber: number;
  status: JobRunStatus;
  triggerType: TriggerType;
  triggeredBy?: string;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // seconds
  clusterName?: string;
  errorMessage?: string;
  tasks?: {
    total: number;
    completed: number;
    failed: number;
    running: number;
  };
}

export interface JobRunCardProps {
  /** Job run data */
  run: JobRunData;
  /** Display mode */
  mode?: "compact" | "detailed";
  /** Callback when view details is clicked */
  onViewDetails?: () => void;
  /** Callback when view logs is clicked */
  onViewLogs?: () => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Additional className */
  className?: string;
}

const statusConfig: Record<
  JobRunStatus,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  pending: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    icon: <Clock className="h-4 w-4" />,
    label: "Pending",
  },
  running: {
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Running",
  },
  success: {
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: "Success",
  },
  failed: {
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    icon: <XCircle className="h-4 w-4" />,
    label: "Failed",
  },
  cancelled: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    icon: <Square className="h-4 w-4" />,
    label: "Cancelled",
  },
  skipped: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    icon: <SkipForward className="h-4 w-4" />,
    label: "Skipped",
  },
  timeout: {
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Timeout",
  },
};

const triggerIcons: Record<TriggerType, React.ReactNode> = {
  manual: <User className="h-3.5 w-3.5" />,
  scheduled: <Calendar className="h-3.5 w-3.5" />,
  api: <Zap className="h-3.5 w-3.5" />,
  retry: <RotateCcw className="h-3.5 w-3.5" />,
  workflow: <Play className="h-3.5 w-3.5" />,
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "-";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) return `${minutes}m ${secs}s`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const JobRunCard = React.forwardRef<HTMLDivElement, JobRunCardProps>(
  (
    {
      run,
      mode = "detailed",
      onViewDetails,
      onViewLogs,
      onCancel,
      onRetry,
      className,
    },
    ref
  ) => {
    const config = statusConfig[run.status];
    const canCancel = run.status === "running" || run.status === "pending";
    const canRetry = run.status === "failed" || run.status === "cancelled";

    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer",
            className
          )}
          onClick={onViewDetails}
        >
          <span className={cn(config.color)}>{config.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">
                {run.jobName}
              </span>
              <span className="text-xs text-muted-foreground">
                #{run.runNumber}
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {formatDuration(run.duration)}
          </span>
          {run.startedAt && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(run.startedAt, { addSuffix: true })}
            </span>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <span className={cn(config.color)}>{config.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{run.jobName}</span>
              <span className="text-sm text-muted-foreground">
                Run #{run.runNumber}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{run.id}</div>
          </div>
          <span
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
              config.bgColor,
              config.color
            )}
          >
            {config.label}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={onViewDetails}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onViewLogs && (
                <DropdownMenuItem onClick={onViewLogs}>
                  View Logs
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {canCancel && onCancel && (
                <DropdownMenuItem onClick={onCancel}>
                  <Square className="mr-2 h-4 w-4" />
                  Cancel Run
                </DropdownMenuItem>
              )}
              {canRetry && onRetry && (
                <DropdownMenuItem onClick={onRetry}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry Run
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-3">
          {/* Error message */}
          {run.status === "failed" && run.errorMessage && (
            <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
              <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <span className="text-destructive">{run.errorMessage}</span>
            </div>
          )}

          {/* Timing */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Started</div>
              <div>
                {run.startedAt
                  ? format(run.startedAt, "MMM d, HH:mm:ss")
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Duration</div>
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4 text-muted-foreground" />
                {formatDuration(run.duration)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Trigger</div>
              <div className="flex items-center gap-1">
                {triggerIcons[run.triggerType]}
                <span className="capitalize">{run.triggerType}</span>
              </div>
            </div>
          </div>

          {/* Task progress */}
          {run.tasks && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Tasks</span>
                <span>
                  {run.tasks.completed}/{run.tasks.total}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    run.tasks.failed > 0 ? "bg-destructive" : "bg-primary"
                  )}
                  style={{
                    width: `${(run.tasks.completed / run.tasks.total) * 100}%`,
                  }}
                />
              </div>
              {run.tasks.running > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {run.tasks.running} task(s) running
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {run.triggeredBy && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {run.triggeredBy}
              </span>
            )}
            {run.clusterName && <span>Cluster: {run.clusterName}</span>}
          </div>
        </div>

        {/* Actions */}
        {(canCancel || canRetry) && (
          <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30">
            {canCancel && onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel}>
                <Square className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
            {canRetry && onRetry && (
              <Button size="sm" onClick={onRetry}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
JobRunCard.displayName = "JobRunCard";

export { JobRunCard };
