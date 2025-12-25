"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Square,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";

export type TaskStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "cancelled"
  | "skipped";

export interface TimelineTask {
  id: string;
  name: string;
  status: TaskStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // seconds
  dependencies?: string[];
  errorMessage?: string;
}

export interface RunTimelineProps {
  /** Tasks in the run */
  tasks: TimelineTask[];
  /** Total run duration for scaling */
  totalDuration?: number;
  /** Start time of the run */
  startTime?: Date;
  /** Callback when a task is clicked */
  onTaskClick?: (task: TimelineTask) => void;
  /** Whether to show task names */
  showNames?: boolean;
  /** Additional className */
  className?: string;
}

const statusColors: Record<TaskStatus, string> = {
  pending: "bg-blue-200 dark:bg-blue-800",
  running: "bg-yellow-400 dark:bg-yellow-600",
  success: "bg-green-500 dark:bg-green-600",
  failed: "bg-destructive",
  cancelled: "bg-muted-foreground/50",
  skipped: "bg-muted-foreground/30",
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  running: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  success: <CheckCircle2 className="h-3.5 w-3.5" />,
  failed: <XCircle className="h-3.5 w-3.5" />,
  cancelled: <Square className="h-3.5 w-3.5" />,
  skipped: <AlertCircle className="h-3.5 w-3.5" />,
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) return `${minutes}m ${secs}s`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const RunTimeline = React.forwardRef<HTMLDivElement, RunTimelineProps>(
  (
    {
      tasks,
      totalDuration,
      startTime,
      onTaskClick,
      showNames = true,
      className,
    },
    ref
  ) => {
    // Calculate positions and widths
    const maxDuration =
      totalDuration ||
      Math.max(
        ...tasks.map((t) => {
          if (!startTime || !t.startTime) return 0;
          const offset =
            (t.startTime.getTime() - startTime.getTime()) / 1000;
          return offset + (t.duration || 0);
        }),
        1
      );

    const getTaskPosition = (task: TimelineTask) => {
      if (!startTime || !task.startTime) {
        return { left: 0, width: 10 };
      }

      const offset =
        (task.startTime.getTime() - startTime.getTime()) / 1000;
      const left = (offset / maxDuration) * 100;
      const width = Math.max(((task.duration || 1) / maxDuration) * 100, 2);

      return { left, width };
    };

    return (
      <TooltipProvider>
        <div ref={ref} className={cn("space-y-1", className)}>
          {/* Time axis */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>0s</span>
            <span>{formatDuration(maxDuration)}</span>
          </div>

          {/* Task bars */}
          {tasks.map((task) => {
            const pos = getTaskPosition(task);

            return (
              <div
                key={task.id}
                className="flex items-center gap-2 h-8"
              >
                {/* Task name */}
                {showNames && (
                  <div className="w-32 shrink-0 text-sm truncate">
                    {task.name}
                  </div>
                )}

                {/* Timeline bar */}
                <div className="flex-1 relative h-6 bg-muted/30 rounded">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "absolute h-full rounded cursor-pointer transition-opacity hover:opacity-80",
                          statusColors[task.status]
                        )}
                        style={{
                          left: `${pos.left}%`,
                          width: `${pos.width}%`,
                          minWidth: "8px",
                        }}
                        onClick={() => onTaskClick?.(task)}
                      >
                        <span className="absolute inset-0 flex items-center justify-center">
                          {statusIcons[task.status]}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <div className="font-medium">{task.name}</div>
                        <div className="text-xs capitalize">{task.status}</div>
                        {task.duration && (
                          <div className="text-xs">
                            Duration: {formatDuration(task.duration)}
                          </div>
                        )}
                        {task.errorMessage && (
                          <div className="text-xs text-destructive max-w-xs">
                            {task.errorMessage}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Duration */}
                <div className="w-16 shrink-0 text-xs text-muted-foreground text-right">
                  {task.duration ? formatDuration(task.duration) : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>
    );
  }
);
RunTimeline.displayName = "RunTimeline";

export { RunTimeline };
