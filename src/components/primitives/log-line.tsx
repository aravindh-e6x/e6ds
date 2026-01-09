"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logLineVariants = cva(
  "flex items-center gap-3 px-3 py-1 font-mono text-xs border-b border-border/50 hover:bg-muted/50",
  {
    variants: {
      level: {
        error: "bg-red-500/10 text-red-700 dark:text-red-400",
        warn: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        info: "",
        debug: "text-muted-foreground",
        trace: "text-muted-foreground/70",
      },
    },
    defaultVariants: {
      level: "info",
    },
  }
);

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export interface LogLineProps extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
  level: LogLevel;
  message: string;
  service?: string;
}

const LogLine = React.forwardRef<HTMLDivElement, LogLineProps>(
  ({ className, timestamp, level, message, service, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(logLineVariants({ level }), className)} {...props}>
        <span className="text-muted-foreground shrink-0">{timestamp}</span>
        <span className="uppercase w-12 shrink-0">{level}</span>
        {service && (
          <span className="px-1.5 py-0.5 bg-muted text-[10px] shrink-0">{service}</span>
        )}
        <span className="truncate">{message}</span>
      </div>
    );
  }
);
LogLine.displayName = "LogLine";

export { LogLine, logLineVariants };
