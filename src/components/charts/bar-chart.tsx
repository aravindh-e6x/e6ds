"use client";

import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "./chart-tooltip";

export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface BarConfig {
  dataKey: string;
  name?: string;
  color?: string;
  stacked?: boolean;
  radius?: number;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartDataPoint[];
  bars: BarConfig[];
  xAxisKey: string;
  height?: number;
  title?: string;
  description?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisFormatter?: (value: string) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => string;
  loading?: boolean;
  layout?: "horizontal" | "vertical";
  stacked?: boolean;
}

const defaultColors = [
  "rgb(var(--e6-green))",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const SimpleBarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      data,
      bars,
      xAxisKey,
      height = 300,
      title,
      description,
      showGrid = true,
      showLegend = true,
      xAxisFormatter,
      yAxisFormatter,
      tooltipFormatter,
      loading,
      layout = "horizontal",
      stacked = false,
      ...props
    },
    ref
  ) => {
    const isEmpty = !data || data.length === 0;

    return (
      <div ref={ref} className={cn("border bg-card p-6", className)} {...props}>
        {(title || description) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}
        {loading ? (
          <div
            className="flex items-center justify-center bg-muted/50 animate-pulse"
            style={{ height }}
          >
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : isEmpty ? (
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
              data={data}
              layout={layout}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis
                dataKey={layout === "horizontal" ? xAxisKey : undefined}
                type={layout === "horizontal" ? "category" : "number"}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={layout === "horizontal" ? xAxisFormatter : yAxisFormatter}
              />
              <YAxis
                dataKey={layout === "vertical" ? xAxisKey : undefined}
                type={layout === "vertical" ? "category" : "number"}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={layout === "vertical" ? xAxisFormatter : yAxisFormatter}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={tooltipFormatter}
                    labelFormatter={xAxisFormatter}
                  />
                }
              />
              {showLegend && <Legend />}
              {bars.map((bar, index) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.name || bar.dataKey}
                  fill={bar.color || defaultColors[index % defaultColors.length]}
                  radius={bar.radius ?? 0}
                  stackId={stacked || bar.stacked ? "stack" : undefined}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
);
SimpleBarChart.displayName = "BarChart";

export { SimpleBarChart as BarChart };
