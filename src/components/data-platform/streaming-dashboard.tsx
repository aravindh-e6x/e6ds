"use client";

import * as React from "react";
import {
  Activity,
  Play,
  Square,
  RefreshCw,
  AlertCircle,
  Clock,
  Loader2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Settings,
  Trash2,
  Eye,
  Zap,
  Database,
  ArrowRight,
  BarChart3,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export type StreamStatus = "running" | "stopped" | "failed" | "starting" | "stopping";

export interface StreamMetrics {
  inputRate: number;
  outputRate: number;
  processingRate: number;
  batchDuration: number;
  latency: number;
  backpressure: number;
  memoryUsed: number;
  cpuUsage: number;
}

export interface StreamSource {
  name: string;
  type: "kafka" | "kinesis" | "eventhub" | "file" | "socket";
  topic?: string;
  partitions?: number;
}

export interface StreamSink {
  name: string;
  type: "delta" | "kafka" | "console" | "memory" | "foreachBatch";
  path?: string;
}

export interface StreamingJob {
  id: string;
  name: string;
  description?: string;
  status: StreamStatus;
  source: StreamSource;
  sink: StreamSink;
  startTime?: Date;
  uptime?: number;
  metrics?: StreamMetrics;
  checkpointLocation?: string;
  triggerInterval?: string;
  lastBatchId?: number;
  processedBatches?: number;
  totalRecordsProcessed?: number;
  error?: string;
}

export interface StreamingDashboardProps {
  /** List of streaming jobs */
  jobs: StreamingJob[];
  /** Currently selected job ID */
  selectedJobId?: string;
  /** Callback when job is selected */
  onJobSelect?: (jobId: string | null) => void;
  /** Callback when job is started */
  onJobStart?: (jobId: string) => void;
  /** Callback when job is stopped */
  onJobStop?: (jobId: string) => void;
  /** Callback when job is restarted */
  onJobRestart?: (jobId: string) => void;
  /** Callback when job settings is clicked */
  onJobSettings?: (jobId: string) => void;
  /** Callback when job details is clicked */
  onJobDetails?: (jobId: string) => void;
  /** Additional className */
  className?: string;
}

const statusConfig: Record<StreamStatus, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  running: {
    icon: <Activity className="h-4 w-4 animate-pulse" />,
    label: "Running",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  stopped: {
    icon: <Square className="h-4 w-4" />,
    label: "Stopped",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/50",
  },
  failed: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Failed",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/50",
  },
  starting: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Starting",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  stopping: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Stopping",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
};

const sourceTypeIcons: Record<string, React.ReactNode> = {
  kafka: <Zap className="h-4 w-4" />,
  kinesis: <Activity className="h-4 w-4" />,
  eventhub: <Activity className="h-4 w-4" />,
  file: <Database className="h-4 w-4" />,
  socket: <Zap className="h-4 w-4" />,
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toFixed(0);
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

const StreamingDashboard = React.forwardRef<HTMLDivElement, StreamingDashboardProps>(
  (
    {
      jobs,
      selectedJobId,
      onJobSelect,
      onJobStart,
      onJobStop,
      onJobRestart,
      onJobSettings,
      onJobDetails,
      className,
    },
    ref
  ) => {
    const runningJobs = jobs.filter((j) => j.status === "running");
    const failedJobs = jobs.filter((j) => j.status === "failed");

    const totalInputRate = runningJobs.reduce((acc, j) => acc + (j.metrics?.inputRate || 0), 0);
    const totalOutputRate = runningJobs.reduce((acc, j) => acc + (j.metrics?.outputRate || 0), 0);
    const avgLatency =
      runningJobs.length > 0
        ? runningJobs.reduce((acc, j) => acc + (j.metrics?.latency || 0), 0) / runningJobs.length
        : 0;

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-background", className)}>
        {/* Header */}
        <div className="px-4 py-3 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Streaming Dashboard</h2>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-5 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Active Streams</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{runningJobs.length}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Failed Streams</div>
              <div className={cn("text-2xl font-bold", failedJobs.length > 0 ? "text-red-600 dark:text-red-400" : "")}>
                {failedJobs.length}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Input Rate</div>
              <div className="text-2xl font-bold">{formatNumber(totalInputRate)}/s</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Output Rate</div>
              <div className="text-2xl font-bold">{formatNumber(totalOutputRate)}/s</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Avg Latency</div>
              <div className="text-2xl font-bold">{avgLatency.toFixed(0)}ms</div>
            </div>
          </div>
        </div>

        {/* Job list */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            {jobs.map((job) => (
              <StreamJobCard
                key={job.id}
                job={job}
                isSelected={job.id === selectedJobId}
                onSelect={() => onJobSelect?.(job.id)}
                onStart={() => onJobStart?.(job.id)}
                onStop={() => onJobStop?.(job.id)}
                onRestart={() => onJobRestart?.(job.id)}
                onSettings={() => onJobSettings?.(job.id)}
                onDetails={() => onJobDetails?.(job.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
StreamingDashboard.displayName = "StreamingDashboard";

const StreamJobCard: React.FC<{
  job: StreamingJob;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onDetails: () => void;
}> = ({ job, isSelected, onSelect, onStart, onStop, onRestart, onSettings, onDetails }) => {
  const config = statusConfig[job.status];

  return (
    <div
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50",
        isSelected && "border-primary ring-2 ring-primary/20"
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", config.bgColor)}>
            <span className={config.color}>{config.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{job.name}</h3>
              <Badge variant={job.status === "running" ? "default" : job.status === "failed" ? "destructive" : "secondary"}>
                {config.label}
              </Badge>
            </div>
            {job.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{job.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {job.status === "running" ? (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onStop(); }}>
              <Square className="h-3.5 w-3.5 mr-1" />
              Stop
            </Button>
          ) : job.status === "stopped" || job.status === "failed" ? (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onStart(); }}>
              <Play className="h-3.5 w-3.5 mr-1" />
              Start
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDetails}>
                <Eye className="h-3.5 w-3.5 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-3.5 w-3.5 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRestart}>
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Restart
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Source → Sink */}
      <div className="flex items-center gap-3 mb-4 p-2 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          {sourceTypeIcons[job.source.type]}
          <div>
            <p className="text-sm font-medium">{job.source.name}</p>
            <p className="text-xs text-muted-foreground">
              {job.source.type}
              {job.source.topic && ` • ${job.source.topic}`}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <div>
            <p className="text-sm font-medium">{job.sink.name}</p>
            <p className="text-xs text-muted-foreground">{job.sink.type}</p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {job.error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{job.error}</span>
        </div>
      )}

      {/* Metrics */}
      {job.metrics && job.status === "running" && (
        <div className="grid grid-cols-6 gap-4">
          <MetricItem
            label="Input Rate"
            value={`${formatNumber(job.metrics.inputRate)}/s`}
            icon={<TrendingUp className="h-3 w-3" />}
          />
          <MetricItem
            label="Output Rate"
            value={`${formatNumber(job.metrics.outputRate)}/s`}
            icon={<TrendingDown className="h-3 w-3" />}
          />
          <MetricItem
            label="Latency"
            value={`${job.metrics.latency}ms`}
            icon={<Timer className="h-3 w-3" />}
            warning={job.metrics.latency > 1000}
          />
          <MetricItem
            label="Batch Duration"
            value={`${job.metrics.batchDuration}ms`}
            icon={<Clock className="h-3 w-3" />}
          />
          <MetricItem
            label="Backpressure"
            value={`${(job.metrics.backpressure * 100).toFixed(0)}%`}
            icon={<BarChart3 className="h-3 w-3" />}
            warning={job.metrics.backpressure > 0.8}
          />
          <MetricItem
            label="Uptime"
            value={job.uptime ? formatUptime(job.uptime) : "-"}
            icon={<Clock className="h-3 w-3" />}
          />
        </div>
      )}

      {/* Stopped/idle stats */}
      {job.status !== "running" && job.totalRecordsProcessed !== undefined && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Processed: {formatNumber(job.totalRecordsProcessed)} records</span>
          {job.processedBatches && <span>Batches: {job.processedBatches}</span>}
        </div>
      )}
    </div>
  );
};

const MetricItem: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  warning?: boolean;
}> = ({ label, value, icon, warning }) => (
  <div className={cn("text-center", warning && "text-yellow-600 dark:text-yellow-400")}>
    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
      {icon}
      {label}
    </div>
    <div className="font-medium text-sm">{value}</div>
  </div>
);

export { StreamingDashboard };
