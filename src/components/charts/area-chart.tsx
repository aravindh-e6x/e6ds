"use client";

import * as React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "./chart-tooltip";

export interface AreaChartDataPoint {
  [key: string]: string | number;
}

export interface AreaConfig {
  dataKey: string;
  name?: string;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  type?: "linear" | "monotone" | "step" | "stepBefore" | "stepAfter";
  stacked?: boolean;
}

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AreaChartDataPoint[];
  areas: AreaConfig[];
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

const SimpleAreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      className,
      data,
      areas,
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
            <RechartsAreaChart data={data}>
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
              {areas.map((area, index) => {
                const color = area.color || defaultColors[index % defaultColors.length];
                return (
                  <Area
                    key={area.dataKey}
                    type={area.type || "monotone"}
                    dataKey={area.dataKey}
                    name={area.name || area.dataKey}
                    stroke={color}
                    fill={color}
                    fillOpacity={area.fillOpacity ?? 0.3}
                    strokeWidth={area.strokeWidth || 2}
                    stackId={stacked || area.stacked ? "stack" : undefined}
                  />
                );
              })}
            </RechartsAreaChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
);
SimpleAreaChart.displayName = "AreaChart";

export { SimpleAreaChart as AreaChart };
