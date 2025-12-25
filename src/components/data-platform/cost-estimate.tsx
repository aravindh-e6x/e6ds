"use client";

import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Clock,
  Database,
  Zap,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";

export interface CostBreakdown {
  label: string;
  amount: number;
  percentage?: number;
  description?: string;
}

export interface CostEstimateData {
  /** Estimated cost in dollars */
  estimatedCost: number;
  /** Cost breakdown by category */
  breakdown?: CostBreakdown[];
  /** Data to be scanned */
  bytesToScan?: number;
  /** Estimated duration in seconds */
  estimatedDuration?: number;
  /** Cost comparison vs previous run */
  costChange?: number;
  /** Cost limit warning threshold */
  warningThreshold?: number;
  /** Cost limit error threshold */
  errorThreshold?: number;
  /** Optimization suggestions */
  suggestions?: string[];
  /** Currency symbol */
  currency?: string;
}

export interface CostEstimateProps {
  /** Cost estimate data */
  data: CostEstimateData;
  /** Display mode */
  mode?: "compact" | "detailed" | "inline";
  /** Whether estimate is loading */
  isLoading?: boolean;
  /** Callback when run anyway is clicked */
  onRunAnyway?: () => void;
  /** Callback when optimize is clicked */
  onOptimize?: () => void;
  /** Additional className */
  className?: string;
}

const formatCurrency = (amount: number, currency: string = "$"): string => {
  if (amount < 0.01) return `<${currency}0.01`;
  if (amount < 1) return `${currency}${amount.toFixed(3)}`;
  if (amount < 100) return `${currency}${amount.toFixed(2)}`;
  return `${currency}${amount.toFixed(0)}`;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes < 1024 * 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

const CostEstimate = React.forwardRef<HTMLDivElement, CostEstimateProps>(
  (
    {
      data,
      mode = "detailed",
      isLoading = false,
      onRunAnyway,
      onOptimize,
      className,
    },
    ref
  ) => {
    const [showBreakdown, setShowBreakdown] = React.useState(false);
    const currency = data.currency || "$";

    const isWarning =
      data.warningThreshold !== undefined &&
      data.estimatedCost >= data.warningThreshold;
    const isError =
      data.errorThreshold !== undefined &&
      data.estimatedCost >= data.errorThreshold;

    const statusColor = isError
      ? "text-destructive"
      : isWarning
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-foreground";

    const statusBg = isError
      ? "bg-destructive/10"
      : isWarning
      ? "bg-yellow-50 dark:bg-yellow-950"
      : "bg-muted/30";

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            className
          )}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          Estimating cost...
        </div>
      );
    }

    if (mode === "inline") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2 text-sm", className)}
        >
          <DollarSign className={cn("h-4 w-4", statusColor)} />
          <span className={statusColor}>
            {formatCurrency(data.estimatedCost, currency)}
          </span>
          {data.costChange !== undefined && data.costChange !== 0 && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs",
                data.costChange > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
              )}
            >
              {data.costChange > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(data.costChange)}%
            </span>
          )}
          {(isWarning || isError) && (
            <AlertTriangle className={cn("h-4 w-4", statusColor)} />
          )}
        </div>
      );
    }

    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-4 px-3 py-2 rounded-md",
            statusBg,
            className
          )}
        >
          <div className="flex items-center gap-2">
            <DollarSign className={cn("h-4 w-4", statusColor)} />
            <span className={cn("font-medium", statusColor)}>
              {formatCurrency(data.estimatedCost, currency)}
            </span>
          </div>
          {data.bytesToScan && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Database className="h-3.5 w-3.5" />
              {formatBytes(data.bytesToScan)}
            </div>
          )}
          {data.estimatedDuration && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              ~{formatDuration(data.estimatedDuration)}
            </div>
          )}
          {isError && onRunAnyway && (
            <Button variant="outline" size="sm" onClick={onRunAnyway}>
              Run Anyway
            </Button>
          )}
        </div>
      );
    }

    // Detailed mode
    return (
      <div ref={ref} className={cn("border rounded-lg", className)}>
        {/* Header */}
        <div className={cn("px-4 py-3 border-b", statusBg)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className={cn("h-5 w-5", statusColor)} />
              <span className="font-medium">Cost Estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold", statusColor)}>
                {formatCurrency(data.estimatedCost, currency)}
              </span>
              {data.costChange !== undefined && data.costChange !== 0 && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-sm",
                    data.costChange > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                  )}
                >
                  {data.costChange > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(data.costChange)}%
                </span>
              )}
            </div>
          </div>

          {(isWarning || isError) && (
            <div
              className={cn(
                "flex items-center gap-2 mt-2 text-sm",
                statusColor
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              {isError
                ? `Cost exceeds limit (${formatCurrency(data.errorThreshold!, currency)})`
                : `Cost is above warning threshold (${formatCurrency(data.warningThreshold!, currency)})`}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x px-4 py-3 border-b">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Database className="h-3.5 w-3.5" />
              Data Scanned
            </div>
            <div className="font-medium">
              {data.bytesToScan ? formatBytes(data.bytesToScan) : "-"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5" />
              Est. Duration
            </div>
            <div className="font-medium">
              {data.estimatedDuration
                ? formatDuration(data.estimatedDuration)
                : "-"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Zap className="h-3.5 w-3.5" />
              Cost/GB
            </div>
            <div className="font-medium">
              {data.bytesToScan
                ? formatCurrency(
                    data.estimatedCost /
                      (data.bytesToScan / (1024 * 1024 * 1024)),
                    currency
                  )
                : "-"}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        {data.breakdown && data.breakdown.length > 0 && (
          <div className="border-b">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full px-4 py-2 flex items-center justify-between text-sm hover:bg-muted/50"
            >
              <span>Cost Breakdown</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showBreakdown && "rotate-180"
                )}
              />
            </button>
            {showBreakdown && (
              <div className="px-4 pb-3 space-y-2">
                {data.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount, currency)}
                        </span>
                      </div>
                      {item.percentage !== undefined && (
                        <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {data.suggestions && data.suggestions.length > 0 && (
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950 border-b">
            <div className="flex items-start gap-2 text-sm">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Optimization Suggestions
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  {data.suggestions.map((suggestion, idx) => (
                    <li key={idx}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {(isError || data.suggestions?.length) && (
          <div className="px-4 py-3 flex justify-end gap-2">
            {data.suggestions?.length && onOptimize && (
              <Button variant="outline" size="sm" onClick={onOptimize}>
                <Zap className="h-4 w-4 mr-1" />
                Optimize
              </Button>
            )}
            {isError && onRunAnyway && (
              <Button variant="outline" size="sm" onClick={onRunAnyway}>
                Run Anyway
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
CostEstimate.displayName = "CostEstimate";

export { CostEstimate };
