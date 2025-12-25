"use client";

import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  Zap,
  Database,
  Clock,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "mtd" | "ytd";
export type CostCategory = "compute" | "storage" | "networking" | "jobs" | "sql" | "ml" | "other";

export interface CostBreakdown {
  category: CostCategory;
  amount: number;
  previousAmount?: number;
  percentage: number;
}

export interface CostTrend {
  date: Date;
  amount: number;
  forecast?: boolean;
}

export interface TopSpender {
  id: string;
  name: string;
  type: "user" | "workspace" | "cluster" | "job";
  amount: number;
  previousAmount?: number;
  trend: number;
}

export interface CostAlert {
  id: string;
  severity: "warning" | "critical";
  message: string;
  category?: CostCategory;
  timestamp: Date;
}

export interface CostDashboardProps {
  /** Total cost for the period */
  totalCost: number;
  /** Previous period total for comparison */
  previousTotalCost?: number;
  /** Cost breakdown by category */
  breakdown: CostBreakdown[];
  /** Daily cost trend */
  trend: CostTrend[];
  /** Top spenders */
  topSpenders: TopSpender[];
  /** Cost alerts */
  alerts?: CostAlert[];
  /** Budget amount */
  budget?: number;
  /** Budget used percentage */
  budgetUsed?: number;
  /** Current time range */
  timeRange: TimeRange;
  /** Callback when time range changes */
  onTimeRangeChange?: (range: TimeRange) => void;
  /** Callback when export is clicked */
  onExport?: () => void;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Additional className */
  className?: string;
}

const categoryConfig: Record<CostCategory, { icon: React.ReactNode; color: string; label: string }> = {
  compute: { icon: <Zap className="h-4 w-4" />, color: "text-blue-600 dark:text-blue-400", label: "Compute" },
  storage: { icon: <Database className="h-4 w-4" />, color: "text-green-600 dark:text-green-400", label: "Storage" },
  networking: { icon: <ArrowUpRight className="h-4 w-4" />, color: "text-purple-600 dark:text-purple-400", label: "Networking" },
  jobs: { icon: <Clock className="h-4 w-4" />, color: "text-orange-600 dark:text-orange-400", label: "Jobs" },
  sql: { icon: <Database className="h-4 w-4" />, color: "text-cyan-600 dark:text-cyan-400", label: "SQL Analytics" },
  ml: { icon: <BarChart3 className="h-4 w-4" />, color: "text-pink-600 dark:text-pink-400", label: "ML & AI" },
  other: { icon: <DollarSign className="h-4 w-4" />, color: "text-gray-600 dark:text-gray-400", label: "Other" },
};

const timeRangeLabels: Record<TimeRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last year",
  mtd: "Month to date",
  ytd: "Year to date",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

const CostDashboard = React.forwardRef<HTMLDivElement, CostDashboardProps>(
  (
    {
      totalCost,
      previousTotalCost,
      breakdown,
      trend,
      topSpenders,
      alerts = [],
      budget,
      budgetUsed,
      timeRange,
      onTimeRangeChange,
      onExport,
      onRefresh,
      className,
    },
    ref
  ) => {
    const costChange = previousTotalCost
      ? ((totalCost - previousTotalCost) / previousTotalCost) * 100
      : 0;

    const criticalAlerts = alerts.filter((a) => a.severity === "critical");
    const warningAlerts = alerts.filter((a) => a.severity === "warning");

    // Simple bar chart representation
    const maxTrendAmount = Math.max(...trend.map((t) => t.amount));

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-background overflow-auto", className)}>
        {/* Header */}
        <div className="px-4 py-3 border-b bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Cost Management</h2>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {timeRangeLabels[timeRange]}
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
                    <DropdownMenuItem
                      key={range}
                      onClick={() => onTimeRangeChange?.(range)}
                    >
                      {timeRangeLabels[range]}
                      {range === timeRange && " ✓"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {criticalAlerts.length} critical
                </Badge>
              )}
              {warningAlerts.length > 0 && (
                <Badge variant="outline" className="gap-1 text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400">
                  <AlertCircle className="h-3 w-3" />
                  {warningAlerts.length} warnings
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Cost */}
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Cost</span>
                {costChange !== 0 && (
                  <Badge
                    variant={costChange > 0 ? "destructive" : "default"}
                    className="gap-1"
                  >
                    {costChange > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatPercentage(costChange)}
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
              {previousTotalCost && (
                <p className="text-xs text-muted-foreground mt-1">
                  vs {formatCurrency(previousTotalCost)} previous period
                </p>
              )}
            </div>

            {/* Budget */}
            {budget !== undefined && (
              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Budget</span>
                  {budgetUsed !== undefined && budgetUsed > 90 && (
                    <Badge variant="destructive">
                      {budgetUsed > 100 ? "Over budget" : "Near limit"}
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold">{formatCurrency(budget)}</p>
                {budgetUsed !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{budgetUsed.toFixed(0)}% used</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(budget - totalCost)} remaining
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          budgetUsed > 100
                            ? "bg-red-500"
                            : budgetUsed > 90
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        )}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Compute */}
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-muted-foreground">Compute</span>
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(breakdown.find((b) => b.category === "compute")?.amount || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(breakdown.find((b) => b.category === "compute")?.percentage || 0).toFixed(0)}% of
                total
              </p>
            </div>

            {/* Storage */}
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-muted-foreground">Storage</span>
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(breakdown.find((b) => b.category === "storage")?.amount || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(breakdown.find((b) => b.category === "storage")?.percentage || 0).toFixed(0)}% of
                total
              </p>
            </div>
          </div>

          {/* Cost trend chart */}
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-medium mb-4">Cost Trend</h3>
            <div className="h-48 flex items-end gap-1">
              {trend.map((point, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="w-full relative">
                    <div
                      className={cn(
                        "w-full rounded-t transition-all",
                        point.forecast
                          ? "bg-primary/30 border-2 border-dashed border-primary"
                          : "bg-primary hover:bg-primary/80"
                      )}
                      style={{
                        height: `${(point.amount / maxTrendAmount) * 180}px`,
                      }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border rounded px-2 py-1 text-xs shadow-lg whitespace-nowrap">
                      {formatCurrency(point.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{trend[0]?.date.toLocaleDateString()}</span>
              <span>{trend[trend.length - 1]?.date.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cost breakdown */}
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-medium mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                {breakdown
                  .sort((a, b) => b.amount - a.amount)
                  .map((item) => {
                    const config = categoryConfig[item.category];
                    const change =
                      item.previousAmount !== undefined
                        ? ((item.amount - item.previousAmount) / item.previousAmount) * 100
                        : 0;

                    return (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={config.color}>{config.icon}</span>
                            <span className="text-sm">{config.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                            {change !== 0 && (
                              <span
                                className={cn(
                                  "text-xs",
                                  change > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                                )}
                              >
                                {formatPercentage(change)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", config.color.replace("text-", "bg-"))}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Top spenders */}
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-medium mb-4">Top Spenders</h3>
              <div className="space-y-3">
                {topSpenders.slice(0, 8).map((spender, i) => (
                  <div
                    key={spender.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{spender.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{spender.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(spender.amount)}</p>
                      <div className="flex items-center justify-end gap-1 text-xs">
                        {spender.trend > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-red-600 dark:text-red-400" />
                        ) : spender.trend < 0 ? (
                          <ArrowDownRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            spender.trend > 0 ? "text-red-600 dark:text-red-400" : spender.trend < 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                          )}
                        >
                          {Math.abs(spender.trend).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-medium mb-4">Cost Alerts</h3>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      alert.severity === "critical"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                    )}
                  >
                    <AlertCircle
                      className={cn(
                        "h-4 w-4 shrink-0 mt-0.5",
                        alert.severity === "critical"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {alert.category && (
                      <Badge variant="outline" className="text-xs">
                        {categoryConfig[alert.category].label}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
CostDashboard.displayName = "CostDashboard";

export { CostDashboard };
