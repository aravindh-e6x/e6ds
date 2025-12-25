"use client";

import * as React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PieChartDataPoint[];
  height?: number;
  title?: string;
  description?: string;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  tooltipFormatter?: (value: number, name: string) => string;
  loading?: boolean;
  donut?: boolean;
  showLabels?: boolean;
  labelFormatter?: (entry: PieChartDataPoint) => string;
}

const defaultColors = [
  "rgb(var(--e6-green))",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const SimplePieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      className,
      data,
      height = 300,
      title,
      description,
      showLegend = true,
      innerRadius,
      outerRadius = 80,
      tooltipFormatter,
      loading,
      donut = false,
      showLabels = false,
      labelFormatter,
      ...props
    },
    ref
  ) => {
    const isEmpty = !data || data.length === 0;
    const computedInnerRadius = donut ? outerRadius * 0.6 : (innerRadius ?? 0);

    const renderLabel = (props: { name?: string; percent?: number }) => {
      if (!props.name || props.percent === undefined) return "";
      const entry = { name: props.name, value: 0, percent: props.percent };
      if (labelFormatter) return labelFormatter(entry as PieChartDataPoint);
      return `${props.name}: ${(props.percent * 100).toFixed(0)}%`;
    };

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
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={computedInnerRadius}
                outerRadius={outerRadius}
                dataKey="value"
                nameKey="name"
                label={showLabels ? renderLabel : undefined}
                labelLine={showLabels}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || defaultColors[index % defaultColors.length]}
                  />
                ))}
              </Pie>
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
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
);
SimplePieChart.displayName = "PieChart";

export { SimplePieChart as PieChart };
