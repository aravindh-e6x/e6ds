"use client";

import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "./chart-tooltip";

export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface LineConfig {
  dataKey: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
  dot?: boolean;
  type?: "linear" | "monotone" | "step" | "stepBefore" | "stepAfter";
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: LineChartDataPoint[];
  lines: LineConfig[];
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
}

const defaultColors = [
  "rgb(var(--e6-green))",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const SimpleLineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      className,
      data,
      lines,
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
            <RechartsLineChart data={data}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={xAxisFormatter}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={yAxisFormatter}
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
              {lines.map((line, index) => (
                <Line
                  key={line.dataKey}
                  type={line.type || "monotone"}
                  dataKey={line.dataKey}
                  name={line.name || line.dataKey}
                  stroke={line.color || defaultColors[index % defaultColors.length]}
                  strokeWidth={line.strokeWidth || 2}
                  dot={line.dot ?? false}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
);
SimpleLineChart.displayName = "LineChart";

export { SimpleLineChart as LineChart };
