"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LogLine, LogLevel } from "../primitives/log-line";

export interface LogContextEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface LogContextProps extends React.HTMLAttributes<HTMLDivElement> {
  before: LogContextEntry[];
  current: LogContextEntry;
  after: LogContextEntry[];
}

const LogContext = React.forwardRef<HTMLDivElement, LogContextProps>(
  ({ className, before, current, after, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border bg-card", className)} {...props}>
        <div className="px-3 py-2 border-b bg-muted text-sm font-medium">Log Context</div>
        <div className="opacity-60">
          {before.map((log) => (
            <LogLine key={log.id} {...log} />
          ))}
        </div>
        <div className="ring-2 ring-primary">
          <LogLine {...current} />
        </div>
        <div className="opacity-60">
          {after.map((log) => (
            <LogLine key={log.id} {...log} />
          ))}
        </div>
      </div>
    );
  }
);
LogContext.displayName = "LogContext";

export { LogContext };
