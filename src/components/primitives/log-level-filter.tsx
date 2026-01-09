"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export interface LogLevelFilterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  activeLevels: LogLevel[];
  onToggle: (level: LogLevel) => void;
  counts?: Partial<Record<LogLevel, number>>;
}

const levels: { level: LogLevel; color: string }[] = [
  { level: "error", color: "bg-red-500" },
  { level: "warn", color: "bg-yellow-500" },
  { level: "info", color: "bg-blue-500" },
  { level: "debug", color: "bg-gray-500" },
  { level: "trace", color: "bg-gray-400" },
];

const LogLevelFilter = React.forwardRef<HTMLDivElement, LogLevelFilterProps>(
  ({ className, activeLevels, onToggle, counts, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex gap-1", className)} {...props}>
        {levels.map(({ level, color }) => (
          <button
            key={level}
            onClick={() => onToggle(level)}
            className={cn(
              "px-2 py-1 text-xs font-medium border rounded transition-colors",
              activeLevels.includes(level)
                ? `${color} text-white border-transparent`
                : "bg-transparent text-muted-foreground border-border hover:bg-muted"
            )}
          >
            {level}
            {counts?.[level] !== undefined && (
              <span className="ml-1 opacity-70">({counts[level]})</span>
            )}
          </button>
        ))}
      </div>
    );
  }
);
LogLevelFilter.displayName = "LogLevelFilter";

export { LogLevelFilter };
