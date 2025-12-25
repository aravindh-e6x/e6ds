"use client";

import * as React from "react";
import {
  Search,
  Download,
  RefreshCw,
  ArrowDown,
  Filter,
  ChevronDown,
  Copy,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface LogViewerProps {
  /** Log entries */
  logs: LogEntry[];
  /** Whether logs are loading */
  isLoading?: boolean;
  /** Whether there are more logs to load */
  hasMore?: boolean;
  /** Callback to load more logs */
  onLoadMore?: () => void;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Callback when download is clicked */
  onDownload?: () => void;
  /** Whether to auto-scroll to bottom */
  autoScroll?: boolean;
  /** Visible log levels */
  visibleLevels?: LogLevel[];
  /** Callback when visible levels change */
  onVisibleLevelsChange?: (levels: LogLevel[]) => void;
  /** Maximum height */
  maxHeight?: number;
  /** Additional className */
  className?: string;
}

const levelColors: Record<LogLevel, string> = {
  debug: "text-muted-foreground",
  info: "text-blue-600 dark:text-blue-400",
  warn: "text-yellow-600 dark:text-yellow-400",
  error: "text-destructive",
  fatal: "text-destructive font-bold",
};

const levelBgColors: Record<LogLevel, string> = {
  debug: "",
  info: "",
  warn: "bg-yellow-50 dark:bg-yellow-950",
  error: "bg-red-50 dark:bg-red-950",
  fatal: "bg-red-100 dark:bg-red-900",
};

const formatTimestamp = (date: Date): string => {
  return date.toISOString().replace("T", " ").replace("Z", "");
};

const LogViewer = React.forwardRef<HTMLDivElement, LogViewerProps>(
  (
    {
      logs,
      isLoading = false,
      hasMore = false,
      onLoadMore,
      onRefresh,
      onDownload,
      autoScroll = true,
      visibleLevels = ["debug", "info", "warn", "error", "fatal"],
      onVisibleLevelsChange,
      maxHeight = 500,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] =
      React.useState(autoScroll);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter logs
    const filteredLogs = React.useMemo(() => {
      return logs.filter((log) => {
        if (!visibleLevels.includes(log.level)) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            log.message.toLowerCase().includes(query) ||
            log.source?.toLowerCase().includes(query)
          );
        }
        return true;
      });
    }, [logs, visibleLevels, searchQuery]);

    // Auto-scroll to bottom
    React.useEffect(() => {
      if (isAutoScrollEnabled && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [filteredLogs, isAutoScrollEnabled]);

    const handleLevelToggle = (level: LogLevel) => {
      if (onVisibleLevelsChange) {
        const newLevels = visibleLevels.includes(level)
          ? visibleLevels.filter((l) => l !== level)
          : [...visibleLevels, level];
        onVisibleLevelsChange(newLevels);
      }
    };

    const handleCopyLog = (log: LogEntry) => {
      const text = `[${formatTimestamp(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message}`;
      navigator.clipboard.writeText(text);
    };

    return (
      <div ref={ref} className={cn("flex flex-col border bg-card", className)}>
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>

          {/* Level filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-1" />
                Levels
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(["debug", "info", "warn", "error", "fatal"] as LogLevel[]).map(
                (level) => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={visibleLevels.includes(level)}
                    onCheckedChange={() => handleLevelToggle(level)}
                  >
                    <span className={cn("uppercase text-xs", levelColors[level])}>
                      {level}
                    </span>
                  </DropdownMenuCheckboxItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          {/* Auto-scroll toggle */}
          <Button
            variant={isAutoScrollEnabled ? "secondary" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>

          {/* Refresh */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>
          )}

          {/* Download */}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Logs container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto font-mono text-xs"
          style={{ maxHeight }}
        >
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "No logs to display"
              )}
            </div>
          ) : (
            <div className="divide-y">
              {/* Load more button */}
              {hasMore && onLoadMore && (
                <button
                  onClick={onLoadMore}
                  className="w-full py-2 text-center text-sm text-muted-foreground hover:bg-muted/50"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load earlier logs"}
                </button>
              )}

              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "group flex items-start gap-2 px-3 py-1.5 hover:bg-muted/50",
                    levelBgColors[log.level]
                  )}
                >
                  {/* Timestamp */}
                  <span className="text-muted-foreground shrink-0 w-44">
                    {formatTimestamp(log.timestamp)}
                  </span>

                  {/* Level */}
                  <span
                    className={cn(
                      "shrink-0 w-12 uppercase",
                      levelColors[log.level]
                    )}
                  >
                    {log.level}
                  </span>

                  {/* Source */}
                  {log.source && (
                    <span className="shrink-0 text-muted-foreground w-24 truncate">
                      [{log.source}]
                    </span>
                  )}

                  {/* Message */}
                  <span className="flex-1 whitespace-pre-wrap break-all">
                    {log.message}
                  </span>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopyLog(log)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t bg-muted/30 text-xs text-muted-foreground">
          <span>
            {filteredLogs.length} log{filteredLogs.length !== 1 && "s"}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          {isLoading && <span>Updating...</span>}
        </div>
      </div>
    );
  }
);
LogViewer.displayName = "LogViewer";

export { LogViewer };
