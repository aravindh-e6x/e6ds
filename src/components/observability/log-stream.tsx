"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LogLine, LogLevel } from "../primitives/log-line";
import { ScrollArea } from "../primitives/scroll-area";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  service?: string;
}

export interface LogStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  logs: LogEntry[];
  height?: number;
  onLogClick?: (log: LogEntry) => void;
  liveTail?: boolean;
}

const LogStream = React.forwardRef<HTMLDivElement, LogStreamProps>(
  ({ className, logs, height = 400, onLogClick, liveTail, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (liveTail && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [logs, liveTail]);

    return (
      <div ref={ref} className={cn("border bg-card", className)} {...props}>
        <ScrollArea style={{ height }} ref={scrollRef}>
          {logs.map((log) => (
            <LogLine
              key={log.id}
              timestamp={log.timestamp}
              level={log.level}
              message={log.message}
              service={log.service}
              onClick={() => onLogClick?.(log)}
              className={onLogClick ? "cursor-pointer" : undefined}
            />
          ))}
        </ScrollArea>
      </div>
    );
  }
);
LogStream.displayName = "LogStream";

export { LogStream };
