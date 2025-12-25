"use client";

import * as React from "react";
import {
  Server,
  Cpu,
  MemoryStick,
  Clock,
  Play,
  Square,
  RotateCcw,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { formatDistanceToNow } from "date-fns";

export type ClusterState =
  | "running"
  | "starting"
  | "stopping"
  | "stopped"
  | "error"
  | "pending"
  | "terminating"
  | "restarting";

export interface ClusterStatusData {
  id: string;
  name: string;
  state: ClusterState;
  nodeType?: string;
  driverNodeType?: string;
  nodeCount?: number;
  coresPerNode?: number;
  memoryPerNode?: string;
  totalCores?: number;
  totalMemory?: string;
  sparkVersion?: string;
  runtimeVersion?: string;
  creator?: string;
  createdAt?: Date;
  startedAt?: Date;
  terminatedAt?: Date;
  autoTerminationMinutes?: number;
  lastActivityAt?: Date;
  uptime?: number; // seconds
  errorMessage?: string;
}

export interface ClusterStatusProps {
  /** Cluster data */
  cluster: ClusterStatusData;
  /** Display mode */
  mode?: "compact" | "detailed" | "card";
  /** Callback when start is clicked */
  onStart?: () => void;
  /** Callback when stop is clicked */
  onStop?: () => void;
  /** Callback when restart is clicked */
  onRestart?: () => void;
  /** Callback when configure is clicked */
  onConfigure?: () => void;
  /** Additional className */
  className?: string;
}

const stateConfig: Record<
  ClusterState,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  running: {
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: "Running",
  },
  starting: {
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Starting",
  },
  stopping: {
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Stopping",
  },
  stopped: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    icon: <Square className="h-4 w-4" />,
    label: "Stopped",
  },
  error: {
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Error",
  },
  pending: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Pending",
  },
  terminating: {
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Terminating",
  },
  restarting: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    icon: <RotateCcw className="h-4 w-4 animate-spin" />,
    label: "Restarting",
  },
};

const formatUptime = (seconds?: number): string => {
  if (!seconds) return "-";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const ClusterStatus = React.forwardRef<HTMLDivElement, ClusterStatusProps>(
  (
    {
      cluster,
      mode = "detailed",
      onStart,
      onStop,
      onRestart,
      onConfigure,
      className,
    },
    ref
  ) => {
    const config = stateConfig[cluster.state];
    const canStart = cluster.state === "stopped" || cluster.state === "error";
    const canStop = cluster.state === "running";
    const canRestart = cluster.state === "running";

    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2 px-3 py-2", className)}
        >
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{cluster.name}</span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
              config.bgColor,
              config.color
            )}
          >
            {config.icon}
            <span>{config.label}</span>
          </span>
          {cluster.state === "running" && (
            <>
              {cluster.totalCores && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  {cluster.totalCores} cores
                </span>
              )}
              {cluster.totalMemory && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MemoryStick className="h-3 w-3" />
                  {cluster.totalMemory}
                </span>
              )}
            </>
          )}
        </div>
      );
    }

    if (mode === "card") {
      return (
        <div
          ref={ref}
          className={cn("border bg-card p-4 space-y-3", className)}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{cluster.name}</div>
                <div className="text-xs text-muted-foreground">
                  {cluster.nodeType}
                </div>
              </div>
            </div>
            <span
              className={cn(
                "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                config.bgColor,
                config.color
              )}
            >
              {config.icon}
              <span>{config.label}</span>
            </span>
          </div>

          {/* Stats */}
          {cluster.state === "running" && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Cpu className="h-4 w-4" />
                <span>{cluster.totalCores || "-"} cores</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MemoryStick className="h-4 w-4" />
                <span>{cluster.totalMemory || "-"}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatUptime(cluster.uptime)}</span>
              </div>
            </div>
          )}

          {/* Error message */}
          {cluster.state === "error" && cluster.errorMessage && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {cluster.errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {canStart && onStart && (
              <Button size="sm" onClick={onStart}>
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {canStop && onStop && (
              <Button size="sm" variant="outline" onClick={onStop}>
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            )}
            {canRestart && onRestart && (
              <Button size="sm" variant="outline" onClick={onRestart}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Restart
              </Button>
            )}
            {onConfigure && (
              <Button size="sm" variant="ghost" onClick={onConfigure}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Detailed mode
    return (
      <div ref={ref} className={cn("border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">{cluster.name}</div>
              <div className="text-xs text-muted-foreground">
                {cluster.id}
              </div>
            </div>
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm px-3 py-1 rounded-full",
              config.bgColor,
              config.color
            )}
          >
            {config.icon}
            <span>{config.label}</span>
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Error */}
          {cluster.state === "error" && cluster.errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <span className="text-sm text-destructive">
                {cluster.errorMessage}
              </span>
            </div>
          )}

          {/* Resources */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Resources
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">
                    {cluster.totalCores || "-"} cores
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cluster.nodeCount || 1} × {cluster.coresPerNode || "-"}{" "}
                    cores/node
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">
                    {cluster.totalMemory || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cluster.nodeCount || 1} × {cluster.memoryPerNode || "-"}
                    /node
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Configuration
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Node Type: </span>
                <span>{cluster.nodeType || "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Driver: </span>
                <span>{cluster.driverNodeType || cluster.nodeType || "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Spark: </span>
                <span>{cluster.sparkVersion || "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Runtime: </span>
                <span>{cluster.runtimeVersion || "-"}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Activity
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {cluster.uptime && cluster.state === "running" && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Uptime: {formatUptime(cluster.uptime)}</span>
                </div>
              )}
              {cluster.startedAt && cluster.state === "running" && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Started{" "}
                    {formatDistanceToNow(cluster.startedAt, { addSuffix: true })}
                  </span>
                </div>
              )}
              {cluster.creator && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Created by {cluster.creator}</span>
                </div>
              )}
              {cluster.autoTerminationMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Auto-terminate after {cluster.autoTerminationMinutes}m
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-4 py-3 border-t bg-muted/30">
          {canStart && onStart && (
            <Button size="sm" onClick={onStart}>
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          {canStop && onStop && (
            <Button size="sm" variant="outline" onClick={onStop}>
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
          )}
          {canRestart && onRestart && (
            <Button size="sm" variant="outline" onClick={onRestart}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Restart
            </Button>
          )}
          <div className="flex-1" />
          {onConfigure && (
            <Button size="sm" variant="ghost" onClick={onConfigure}>
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          )}
        </div>
      </div>
    );
  }
);
ClusterStatus.displayName = "ClusterStatus";

export { ClusterStatus };
