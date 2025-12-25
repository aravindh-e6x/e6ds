"use client";

import * as React from "react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Activity,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";

export interface ResourceMetric {
  current: number;
  max: number;
  unit: string;
  history?: number[];
}

export interface ResourceData {
  cpu?: ResourceMetric;
  memory?: ResourceMetric;
  disk?: ResourceMetric;
  network?: {
    bytesIn: number;
    bytesOut: number;
  };
  custom?: Record<string, ResourceMetric>;
}

export interface ResourceMonitorProps {
  /** Resource data */
  resources: ResourceData;
  /** Title */
  title?: string;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Warning threshold (0-1) */
  warningThreshold?: number;
  /** Critical threshold (0-1) */
  criticalThreshold?: number;
  /** Display mode */
  mode?: "compact" | "detailed" | "chart";
  /** Additional className */
  className?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  icon: React.ReactNode;
  warningThreshold: number;
  criticalThreshold: number;
  showSparkline?: boolean;
  history?: number[];
}

const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  label,
  unit,
  icon,
  warningThreshold,
  criticalThreshold,
  showSparkline = false,
  history = [],
}) => {
  const percentage = (value / max) * 100;
  const isCritical = percentage / 100 >= criticalThreshold;
  const isWarning = percentage / 100 >= warningThreshold;

  const color = isCritical
    ? "text-destructive"
    : isWarning
    ? "text-yellow-600 dark:text-yellow-400"
    : "text-primary";

  const bgColor = isCritical
    ? "bg-destructive"
    : isWarning
    ? "bg-yellow-500 dark:bg-yellow-400"
    : "bg-primary";

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          {(isCritical || isWarning) && (
            <AlertTriangle
              className={cn("h-4 w-4", isCritical ? "text-destructive" : "text-yellow-600 dark:text-yellow-400")}
            />
          )}
          <span className={cn("text-sm font-medium", color)}>
            {value.toFixed(1)}{unit}
          </span>
          <span className="text-xs text-muted-foreground">/ {max}{unit}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300", bgColor)}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Sparkline */}
      {showSparkline && history.length > 1 && (
        <div className="h-8 flex items-end gap-px">
          {history.slice(-20).map((v, i) => {
            const h = (v / max) * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-muted-foreground/30 rounded-t"
                style={{ height: `${Math.min(h, 100)}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const ResourceMonitor = React.forwardRef<HTMLDivElement, ResourceMonitorProps>(
  (
    {
      resources,
      title = "Resources",
      isLoading = false,
      onRefresh,
      warningThreshold = 0.7,
      criticalThreshold = 0.9,
      mode = "detailed",
      className,
    },
    ref
  ) => {
    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-4 px-3 py-2 bg-muted/30",
            className
          )}
        >
          {resources.cpu && (
            <div className="flex items-center gap-1 text-sm">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span>{resources.cpu.current.toFixed(0)}%</span>
            </div>
          )}
          {resources.memory && (
            <div className="flex items-center gap-1 text-sm">
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
              <span>
                {resources.memory.current.toFixed(1)}/{resources.memory.max}
                {resources.memory.unit}
              </span>
            </div>
          )}
          {resources.disk && (
            <div className="flex items-center gap-1 text-sm">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span>
                {resources.disk.current.toFixed(1)}/{resources.disk.max}
                {resources.disk.unit}
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("border bg-card", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>
          )}
        </div>

        {/* Metrics */}
        <div className="p-4 space-y-4">
          {resources.cpu && (
            <Gauge
              value={resources.cpu.current}
              max={resources.cpu.max}
              label="CPU"
              unit="%"
              icon={<Cpu className="h-4 w-4" />}
              warningThreshold={warningThreshold}
              criticalThreshold={criticalThreshold}
              showSparkline={mode === "chart"}
              history={resources.cpu.history}
            />
          )}

          {resources.memory && (
            <Gauge
              value={resources.memory.current}
              max={resources.memory.max}
              label="Memory"
              unit={resources.memory.unit}
              icon={<MemoryStick className="h-4 w-4" />}
              warningThreshold={warningThreshold}
              criticalThreshold={criticalThreshold}
              showSparkline={mode === "chart"}
              history={resources.memory.history}
            />
          )}

          {resources.disk && (
            <Gauge
              value={resources.disk.current}
              max={resources.disk.max}
              label="Disk"
              unit={resources.disk.unit}
              icon={<HardDrive className="h-4 w-4" />}
              warningThreshold={warningThreshold}
              criticalThreshold={criticalThreshold}
              showSparkline={mode === "chart"}
              history={resources.disk.history}
            />
          )}

          {resources.network && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Network className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Network</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">In: </span>
                  <span>{formatBytes(resources.network.bytesIn)}/s</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Out: </span>
                  <span>{formatBytes(resources.network.bytesOut)}/s</span>
                </div>
              </div>
            </div>
          )}

          {/* Custom metrics */}
          {resources.custom &&
            Object.entries(resources.custom).map(([key, metric]) => (
              <Gauge
                key={key}
                value={metric.current}
                max={metric.max}
                label={key}
                unit={metric.unit}
                icon={<Activity className="h-4 w-4" />}
                warningThreshold={warningThreshold}
                criticalThreshold={criticalThreshold}
                showSparkline={mode === "chart"}
                history={metric.history}
              />
            ))}
        </div>
      </div>
    );
  }
);
ResourceMonitor.displayName = "ResourceMonitor";

export { ResourceMonitor };
