"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Trash2,
  Settings,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Timer,
  Zap,
  CalendarDays,
  History,
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

export type JobStatus = "idle" | "running" | "success" | "failed" | "paused" | "scheduled";
export type TriggerType = "cron" | "manual" | "file" | "continuous";

export interface JobRun {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: "running" | "success" | "failed";
  duration?: number;
  triggeredBy?: string;
  error?: string;
}

export interface ScheduledJob {
  id: string;
  name: string;
  description?: string;
  status: JobStatus;
  triggerType: TriggerType;
  schedule?: string;
  nextRun?: Date;
  lastRun?: JobRun;
  recentRuns?: JobRun[];
  cluster?: string;
  timeout?: number;
  retries?: number;
  tags?: string[];
}

export interface JobSchedulerProps {
  /** List of scheduled jobs */
  jobs: ScheduledJob[];
  /** Currently selected job ID */
  selectedJobId?: string;
  /** Callback when job is selected */
  onJobSelect?: (jobId: string | null) => void;
  /** Callback when job is run */
  onJobRun?: (jobId: string) => void;
  /** Callback when job is paused */
  onJobPause?: (jobId: string) => void;
  /** Callback when job is resumed */
  onJobResume?: (jobId: string) => void;
  /** Callback when job is cancelled */
  onJobCancel?: (jobId: string) => void;
  /** Callback when job is deleted */
  onJobDelete?: (jobId: string) => void;
  /** Callback when job is created */
  onJobCreate?: () => void;
  /** Callback when job settings is clicked */
  onJobSettings?: (jobId: string) => void;
  /** Callback when job history is clicked */
  onJobHistory?: (jobId: string) => void;
  /** Additional className */
  className?: string;
}

const statusConfig: Record<JobStatus, { icon: React.ReactNode; label: string; color: string }> = {
  idle: {
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Idle",
    color: "text-muted-foreground",
  },
  running: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    label: "Running",
    color: "text-blue-600 dark:text-blue-400",
  },
  success: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Success",
    color: "text-green-600 dark:text-green-400",
  },
  failed: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Failed",
    color: "text-red-600 dark:text-red-400",
  },
  paused: {
    icon: <Pause className="h-3.5 w-3.5" />,
    label: "Paused",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  scheduled: {
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: "Scheduled",
    color: "text-purple-600 dark:text-purple-400",
  },
};

const triggerIcons: Record<TriggerType, React.ReactNode> = {
  cron: <CalendarDays className="h-3.5 w-3.5" />,
  manual: <Play className="h-3.5 w-3.5" />,
  file: <Zap className="h-3.5 w-3.5" />,
  continuous: <RefreshCw className="h-3.5 w-3.5" />,
};

const JobScheduler = React.forwardRef<HTMLDivElement, JobSchedulerProps>(
  (
    {
      jobs,
      selectedJobId,
      onJobSelect,
      onJobRun,
      onJobPause,
      onJobResume,
      onJobCancel,
      onJobDelete,
      onJobCreate,
      onJobSettings,
      onJobHistory,
      className,
    },
    ref
  ) => {
    const [filter, setFilter] = React.useState<JobStatus | "all">("all");

    const filteredJobs = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

    const statusCounts = React.useMemo(() => {
      const counts: Record<string, number> = { all: jobs.length };
      jobs.forEach((job) => {
        counts[job.status] = (counts[job.status] || 0) + 1;
      });
      return counts;
    }, [jobs]);

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-background", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Job Scheduler</h2>
            <Badge variant="secondary">{jobs.length} jobs</Badge>
          </div>

          <Button size="sm" onClick={onJobCreate}>
            <Plus className="h-4 w-4 mr-1" />
            New Job
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto">
          {(["all", "running", "scheduled", "success", "failed", "paused"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className="shrink-0"
            >
              {status === "all" ? "All" : statusConfig[status].label}
              {statusCounts[status] ? (
                <span className="ml-1 text-xs opacity-70">({statusCounts[status]})</span>
              ) : null}
            </Button>
          ))}
        </div>

        {/* Job list */}
        <div className="flex-1 overflow-auto">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Timer className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-sm">Create a new job to get started</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredJobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  isSelected={job.id === selectedJobId}
                  onSelect={() => onJobSelect?.(job.id)}
                  onRun={() => onJobRun?.(job.id)}
                  onPause={() => onJobPause?.(job.id)}
                  onResume={() => onJobResume?.(job.id)}
                  onCancel={() => onJobCancel?.(job.id)}
                  onDelete={() => onJobDelete?.(job.id)}
                  onSettings={() => onJobSettings?.(job.id)}
                  onHistory={() => onJobHistory?.(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
JobScheduler.displayName = "JobScheduler";

const JobRow: React.FC<{
  job: ScheduledJob;
  isSelected: boolean;
  onSelect: () => void;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSettings: () => void;
  onHistory: () => void;
}> = ({ job, isSelected, onSelect, onRun, onPause, onResume, onCancel, onDelete, onSettings, onHistory }) => {
  const config = statusConfig[job.status];

  return (
    <div
      className={cn(
        "px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
        isSelected && "bg-muted"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div className={cn("mt-0.5", config.color)}>{config.icon}</div>

        {/* Job info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{job.name}</span>
            <Badge variant="outline" className="shrink-0 gap-1">
              {triggerIcons[job.triggerType]}
              {job.triggerType}
            </Badge>
            {job.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="shrink-0">
                {tag}
              </Badge>
            ))}
          </div>

          {job.description && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">{job.description}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {job.schedule && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {job.schedule}
              </span>
            )}
            {job.nextRun && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Next: {formatDateTime(job.nextRun)}
              </span>
            )}
            {job.lastRun && (
              <span className={cn("flex items-center gap-1", job.lastRun.status === "failed" && "text-red-600 dark:text-red-400")}>
                <History className="h-3 w-3" />
                Last: {formatRelativeTime(job.lastRun.startTime)}
                {job.lastRun.duration && ` (${job.lastRun.duration}s)`}
              </span>
            )}
            {job.cluster && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {job.cluster}
              </span>
            )}
          </div>

          {/* Recent runs mini chart */}
          {job.recentRuns && job.recentRuns.length > 0 && (
            <div className="flex items-center gap-0.5 mt-2">
              {job.recentRuns.slice(0, 20).map((run, i) => (
                <div
                  key={run.id}
                  className={cn(
                    "w-2 h-4 rounded-sm",
                    run.status === "success" && "bg-green-500 dark:bg-green-400",
                    run.status === "failed" && "bg-red-500 dark:bg-red-400",
                    run.status === "running" && "bg-blue-500 dark:bg-blue-400 animate-pulse"
                  )}
                  title={`Run ${i + 1}: ${run.status}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {job.status === "running" ? (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
              <Square className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
          ) : job.status === "paused" ? (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onResume(); }}>
              <Play className="h-3.5 w-3.5 mr-1" />
              Resume
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onRun(); }}>
              <Play className="h-3.5 w-3.5 mr-1" />
              Run Now
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-3.5 w-3.5 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHistory}>
                <History className="h-3.5 w-3.5 mr-2" />
                Run History
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-3.5 w-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {job.status !== "paused" && job.status !== "running" && (
                <DropdownMenuItem onClick={onPause}>
                  <Pause className="h-3.5 w-3.5 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

function formatDateTime(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export { JobScheduler };
