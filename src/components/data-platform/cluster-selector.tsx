"use client";

import * as React from "react";
import {
  Server,
  ChevronDown,
  Plus,
  Settings,
  Play,
  Square,
  Loader2,
  AlertCircle,
  Check,
  Cpu,
  MemoryStick,
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

export type ClusterState =
  | "running"
  | "starting"
  | "stopping"
  | "stopped"
  | "error"
  | "pending";

export interface ClusterInfo {
  id: string;
  name: string;
  state: ClusterState;
  nodeType?: string;
  nodeCount?: number;
  memory?: string;
  cores?: number;
  sparkVersion?: string;
  creator?: string;
  autoTerminationMinutes?: number;
}

export interface ClusterSelectorProps {
  /** Available clusters */
  clusters: ClusterInfo[];
  /** Currently selected cluster ID */
  selectedClusterId?: string;
  /** Callback when cluster is selected */
  onSelect?: (clusterId: string) => void;
  /** Callback when start is clicked */
  onStart?: (clusterId: string) => void;
  /** Callback when stop is clicked */
  onStop?: (clusterId: string) => void;
  /** Callback when configure is clicked */
  onConfigure?: (clusterId: string) => void;
  /** Callback when create new is clicked */
  onCreate?: () => void;
  /** Whether a cluster is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

const stateColors: Record<ClusterState, string> = {
  running: "text-green-600 dark:text-green-400",
  starting: "text-yellow-600 dark:text-yellow-400",
  stopping: "text-yellow-600 dark:text-yellow-400",
  stopped: "text-muted-foreground",
  error: "text-destructive",
  pending: "text-blue-600 dark:text-blue-400",
};

const stateIcons: Record<ClusterState, React.ReactNode> = {
  running: <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400" />,
  starting: <Loader2 className="h-3 w-3 animate-spin text-yellow-600 dark:text-yellow-400" />,
  stopping: <Loader2 className="h-3 w-3 animate-spin text-yellow-600 dark:text-yellow-400" />,
  stopped: <div className="w-2 h-2 rounded-full bg-muted-foreground" />,
  error: <AlertCircle className="h-3 w-3 text-destructive" />,
  pending: <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-400" />,
};

const stateLabels: Record<ClusterState, string> = {
  running: "Running",
  starting: "Starting...",
  stopping: "Stopping...",
  stopped: "Stopped",
  error: "Error",
  pending: "Pending",
};

const ClusterSelector = React.forwardRef<HTMLDivElement, ClusterSelectorProps>(
  (
    {
      clusters,
      selectedClusterId,
      onSelect,
      onStart,
      onStop,
      onConfigure,
      onCreate,
      required: _required = false,
      placeholder = "Select a cluster",
      disabled = false,
      className,
    },
    ref
  ) => {
    const selectedCluster = clusters.find((c) => c.id === selectedClusterId);

    const runningClusters = clusters.filter((c) => c.state === "running");
    const otherClusters = clusters.filter((c) => c.state !== "running");

    return (
      <div ref={ref} className={cn("", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full justify-between",
                !selectedCluster && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                {selectedCluster ? (
                  <>
                    <span>{selectedCluster.name}</span>
                    <span className="flex items-center gap-1">
                      {stateIcons[selectedCluster.state]}
                    </span>
                  </>
                ) : (
                  <span>{placeholder}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            {/* Running clusters */}
            {runningClusters.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Running
                </div>
                {runningClusters.map((cluster) => (
                  <ClusterMenuItem
                    key={cluster.id}
                    cluster={cluster}
                    isSelected={cluster.id === selectedClusterId}
                    onSelect={() => onSelect?.(cluster.id)}
                    onStart={() => onStart?.(cluster.id)}
                    onStop={() => onStop?.(cluster.id)}
                    onConfigure={() => onConfigure?.(cluster.id)}
                  />
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Other clusters */}
            {otherClusters.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {runningClusters.length > 0 ? "Other Clusters" : "Clusters"}
                </div>
                {otherClusters.map((cluster) => (
                  <ClusterMenuItem
                    key={cluster.id}
                    cluster={cluster}
                    isSelected={cluster.id === selectedClusterId}
                    onSelect={() => onSelect?.(cluster.id)}
                    onStart={() => onStart?.(cluster.id)}
                    onStop={() => onStop?.(cluster.id)}
                    onConfigure={() => onConfigure?.(cluster.id)}
                  />
                ))}
              </>
            )}

            {clusters.length === 0 && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No clusters available
              </div>
            )}

            {/* Create new */}
            {onCreate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Cluster
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);
ClusterSelector.displayName = "ClusterSelector";

interface ClusterMenuItemProps {
  cluster: ClusterInfo;
  isSelected: boolean;
  onSelect: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onConfigure?: () => void;
}

const ClusterMenuItem: React.FC<ClusterMenuItemProps> = ({
  cluster,
  isSelected,
  onSelect,
  onStart,
  onStop,
  onConfigure,
}) => {
  const canStart = cluster.state === "stopped" || cluster.state === "error";
  const canStop = cluster.state === "running";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-2 hover:bg-accent cursor-pointer group",
        isSelected && "bg-accent"
      )}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      <span className="w-4 h-4 flex items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>

      {/* State indicator */}
      <span className="shrink-0">{stateIcons[cluster.state]}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{cluster.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={stateColors[cluster.state]}>
            {stateLabels[cluster.state]}
          </span>
          {cluster.nodeCount && (
            <span className="flex items-center gap-0.5">
              <Cpu className="h-3 w-3" />
              {cluster.nodeCount} nodes
            </span>
          )}
          {cluster.memory && (
            <span className="flex items-center gap-0.5">
              <MemoryStick className="h-3 w-3" />
              {cluster.memory}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        {canStart && onStart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="p-1 hover:bg-muted rounded text-green-600 dark:text-green-400"
            title="Start cluster"
          >
            <Play className="h-3.5 w-3.5" />
          </button>
        )}
        {canStop && onStop && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
            className="p-1 hover:bg-muted rounded text-destructive"
            title="Stop cluster"
          >
            <Square className="h-3.5 w-3.5" />
          </button>
        )}
        {onConfigure && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure();
            }}
            className="p-1 hover:bg-muted rounded"
            title="Configure"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export { ClusterSelector };
