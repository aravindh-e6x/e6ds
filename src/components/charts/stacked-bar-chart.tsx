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

export interface StackedBarChartDataPoint {
  [key: string]: string | number;
}

export interface StackConfig {
  dataKey: string;
  name: string;
  color: string;
  stackId?: string;
}

export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StackedBarChartDataPoint[];
  stacks: StackConfig[];
  xAxisKey: string;
  height?: number;
  title?: string;
  description?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  layout?: "horizontal" | "vertical";
  tooltipFormatter?: (value: number, name: string) => string;
  xAxisFormatter?: (value: string) => string;
  yAxisFormatter?: (value: number) => string;
  loading?: boolean;
}

const defaultColors = [
  "rgb(var(--e6-green))",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const StackedBarChart = React.forwardRef<HTMLDivElement, StackedBarChartProps>(
  (
    {
      className,
      data,
      stacks,
      xAxisKey,
      height = 300,
      title,
      description,
      showLegend = true,
      showGrid = true,
      layout = "horizontal",
      tooltipFormatter,
      xAxisFormatter,
      yAxisFormatter,
      loading,
      ...props
    },
    ref
  ) => {
    const isEmpty = !data || data.length === 0;

    // Assign default colors if not specified
    const stacksWithColors = stacks.map((stack, index) => ({
      ...stack,
      color: stack.color || defaultColors[index % defaultColors.length],
      stackId: stack.stackId || "stack",
    }));

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
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={layout === "horizontal"}
                  horizontal={layout === "vertical"}
                />
              )}
              {layout === "horizontal" ? (
                <>
                  <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={xAxisFormatter}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={yAxisFormatter}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={yAxisFormatter}
                  />
                  <YAxis
                    dataKey={xAxisKey}
                    type="category"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={xAxisFormatter}
                    width={80}
                  />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0",
                }}
                formatter={(value, name) =>
                  tooltipFormatter && typeof value === "number" && typeof name === "string"
                    ? tooltipFormatter(value, name)
                    : value
                }
              />
              {showLegend && (
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
              )}
              {stacksWithColors.map((stack) => (
                <Bar
                  key={stack.dataKey}
                  dataKey={stack.dataKey}
                  name={stack.name}
                  fill={stack.color}
                  stackId={stack.stackId}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
);
StackedBarChart.displayName = "StackedBarChart";

export { StackedBarChart };
