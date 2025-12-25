"use client";

import * as React from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  XCircle,
  Shield,
  Database,
  Key,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Eye,
  Play,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export type AuditEventType =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "EXECUTE"
  | "ACCESS"
  | "PERMISSION_CHANGE"
  | "CLUSTER_START"
  | "CLUSTER_STOP"
  | "ERROR";

export type AuditSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  severity: AuditSeverity;
  user: {
    email: string;
    name?: string;
    ipAddress?: string;
  };
  action: string;
  resource?: {
    type: string;
    name: string;
    id?: string;
  };
  details?: Record<string, unknown>;
  requestId?: string;
  success: boolean;
  errorMessage?: string;
  workspace?: string;
}

export interface AuditLogViewerProps {
  /** List of audit log entries */
  logs: AuditLogEntry[];
  /** Whether logs are loading */
  isLoading?: boolean;
  /** Total count of logs */
  totalCount?: number;
  /** Current page */
  page?: number;
  /** Page size */
  pageSize?: number;
  /** Callback when filters change */
  onFilterChange?: (filters: AuditFilters) => void;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when log entry is clicked */
  onLogClick?: (log: AuditLogEntry) => void;
  /** Callback when logs are exported */
  onExport?: () => void;
  /** Callback when logs are refreshed */
  onRefresh?: () => void;
  /** Additional className */
  className?: string;
}

export interface AuditFilters {
  search?: string;
  eventTypes?: AuditEventType[];
  severities?: AuditSeverity[];
  users?: string[];
  startDate?: Date;
  endDate?: Date;
  success?: boolean | null;
}

const eventTypeConfig: Record<AuditEventType, { icon: React.ReactNode; color: string }> = {
  LOGIN: { icon: <LogIn className="h-3.5 w-3.5" />, color: "text-green-600 dark:text-green-400" },
  LOGOUT: { icon: <LogOut className="h-3.5 w-3.5" />, color: "text-gray-600 dark:text-gray-400" },
  CREATE: { icon: <Edit className="h-3.5 w-3.5" />, color: "text-blue-600 dark:text-blue-400" },
  UPDATE: { icon: <Edit className="h-3.5 w-3.5" />, color: "text-yellow-600 dark:text-yellow-400" },
  DELETE: { icon: <Trash2 className="h-3.5 w-3.5" />, color: "text-red-600 dark:text-red-400" },
  EXECUTE: { icon: <Play className="h-3.5 w-3.5" />, color: "text-purple-600 dark:text-purple-400" },
  ACCESS: { icon: <Eye className="h-3.5 w-3.5" />, color: "text-cyan-600 dark:text-cyan-400" },
  PERMISSION_CHANGE: { icon: <Key className="h-3.5 w-3.5" />, color: "text-orange-600 dark:text-orange-400" },
  CLUSTER_START: { icon: <Play className="h-3.5 w-3.5" />, color: "text-green-600 dark:text-green-400" },
  CLUSTER_STOP: { icon: <Square className="h-3.5 w-3.5" />, color: "text-red-600 dark:text-red-400" },
  ERROR: { icon: <AlertCircle className="h-3.5 w-3.5" />, color: "text-red-600 dark:text-red-400" },
};

const severityConfig: Record<AuditSeverity, { color: string; bgColor: string }> = {
  INFO: { color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
  WARNING: { color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
  ERROR: { color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/50" },
  CRITICAL: { color: "text-red-700 dark:text-red-300", bgColor: "bg-red-200 dark:bg-red-800/50" },
};

function formatDateTime(date: Date): string {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const AuditLogViewer = React.forwardRef<HTMLDivElement, AuditLogViewerProps>(
  (
    {
      logs,
      isLoading = false,
      totalCount,
      page = 1,
      pageSize = 50,
      onFilterChange,
      onPageChange,
      onLogClick,
      onExport,
      onRefresh,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedEventTypes, setSelectedEventTypes] = React.useState<Set<AuditEventType>>(new Set());
    const [selectedSeverities, setSelectedSeverities] = React.useState<Set<AuditSeverity>>(new Set());
    const [expandedLogs, setExpandedLogs] = React.useState<Set<string>>(new Set());

    const toggleLogExpand = (id: string) => {
      const next = new Set(expandedLogs);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setExpandedLogs(next);
    };

    const handleSearch = (value: string) => {
      setSearchQuery(value);
      onFilterChange?.({
        search: value,
        eventTypes: Array.from(selectedEventTypes),
        severities: Array.from(selectedSeverities),
      });
    };

    const toggleEventType = (type: AuditEventType) => {
      const next = new Set(selectedEventTypes);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      setSelectedEventTypes(next);
      onFilterChange?.({
        search: searchQuery,
        eventTypes: Array.from(next),
        severities: Array.from(selectedSeverities),
      });
    };

    const toggleSeverity = (severity: AuditSeverity) => {
      const next = new Set(selectedSeverities);
      if (next.has(severity)) {
        next.delete(severity);
      } else {
        next.add(severity);
      }
      setSelectedSeverities(next);
      onFilterChange?.({
        search: searchQuery,
        eventTypes: Array.from(selectedEventTypes),
        severities: Array.from(next),
      });
    };

    // Count by severity
    const severityCounts = logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-background", className)}>
        {/* Header */}
        <div className="px-4 py-3 border-b bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Audit Logs</h2>
              {totalCount !== undefined && (
                <Badge variant="secondary">{totalCount.toLocaleString()} events</Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className={cn("h-3.5 w-3.5 mr-1", isLoading && "animate-spin")} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search logs..."
                className="pl-8 h-8 text-sm"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  Event Type
                  {selectedEventTypes.size > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1">
                      {selectedEventTypes.size}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(Object.keys(eventTypeConfig) as AuditEventType[]).map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedEventTypes.has(type)}
                    onCheckedChange={() => toggleEventType(type)}
                  >
                    <span className={eventTypeConfig[type].color}>{eventTypeConfig[type].icon}</span>
                    <span className="ml-2">{type}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Severity
                  {selectedSeverities.size > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1">
                      {selectedSeverities.size}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(["INFO", "WARNING", "ERROR", "CRITICAL"] as AuditSeverity[]).map((severity) => (
                  <DropdownMenuCheckboxItem
                    key={severity}
                    checked={selectedSeverities.has(severity)}
                    onCheckedChange={() => toggleSeverity(severity)}
                  >
                    <span className={severityConfig[severity].color}>{severity}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Date Range
            </Button>
          </div>

          {/* Severity summary */}
          <div className="flex items-center gap-4 mt-3">
            {(["INFO", "WARNING", "ERROR", "CRITICAL"] as AuditSeverity[]).map((severity) => (
              <div key={severity} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    severity === "INFO" && "bg-blue-500",
                    severity === "WARNING" && "bg-yellow-500",
                    severity === "ERROR" && "bg-red-500",
                    severity === "CRITICAL" && "bg-red-700"
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {severity}: {severityCounts[severity] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Log list */}
        <div className="flex-1 overflow-auto">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No audit logs found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <LogEntryRow
                  key={log.id}
                  log={log}
                  isExpanded={expandedLogs.has(log.id)}
                  onToggle={() => toggleLogExpand(log.id)}
                  onClick={() => onLogClick?.(log)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount !== undefined && totalCount > pageSize && (
          <div className="px-4 py-2 border-t bg-card flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} of{" "}
              {totalCount.toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => onPageChange?.(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page * pageSize >= totalCount}
                onClick={() => onPageChange?.(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
AuditLogViewer.displayName = "AuditLogViewer";

const LogEntryRow: React.FC<{
  log: AuditLogEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onClick: () => void;
}> = ({ log, isExpanded, onToggle, onClick }) => {
  const eventConfig = eventTypeConfig[log.eventType];
  const severityConf = severityConfig[log.severity];

  return (
    <div className="hover:bg-muted/30">
      <div
        className="px-4 py-2 cursor-pointer flex items-start gap-3"
        onClick={onClick}
      >
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-0.5 mt-0.5">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        <span className={cn("mt-0.5", eventConfig.color)}>{eventConfig.icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{log.action}</span>
            <Badge variant="outline" className="text-xs">
              {log.eventType}
            </Badge>
            <Badge className={cn("text-xs", severityConf.bgColor, severityConf.color)}>
              {log.severity}
            </Badge>
            {!log.success && (
              <Badge variant="destructive" className="text-xs gap-1">
                <XCircle className="h-3 w-3" />
                Failed
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(log.timestamp)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {log.user.email}
            </span>
            {log.user.ipAddress && <span>{log.user.ipAddress}</span>}
            {log.resource && (
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {log.resource.type}: {log.resource.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-3 pl-12">
          <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
            {log.errorMessage && (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{log.errorMessage}</span>
              </div>
            )}

            {log.requestId && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Request ID:</span>
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  {log.requestId}
                </code>
              </div>
            )}

            {log.workspace && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Workspace:</span>
                <span>{log.workspace}</span>
              </div>
            )}

            {log.details && Object.keys(log.details).length > 0 && (
              <div>
                <span className="text-muted-foreground block mb-1">Details:</span>
                <pre className="font-mono text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { AuditLogViewer };
