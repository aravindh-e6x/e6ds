"use client";

import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

export interface LogHistogramDataPoint {
  timestamp: string;
  count: number;
  error?: number;
  warn?: number;
  info?: number;
}

export interface LogHistogramProps extends React.HTMLAttributes<HTMLDivElement> {
  data: LogHistogramDataPoint[];
  height?: number;
  stacked?: boolean;
}

const levelColors = {
  error: "#ef4444",
  warn: "#f59e0b",
  info: "#3b82f6",
};

const LogHistogram = React.forwardRef<HTMLDivElement, LogHistogramProps>(
  ({ className, data, height = 60, stacked = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} barGap={0}>
            <XAxis dataKey="timestamp" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            {stacked ? (
              <>
                <Bar dataKey="error" stackId="a" fill={levelColors.error} />
                <Bar dataKey="warn" stackId="a" fill={levelColors.warn} />
                <Bar dataKey="info" stackId="a" fill={levelColors.info} />
              </>
            ) : (
              <Bar dataKey="count" fill="rgb(var(--e6-green))">
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.error ? levelColors.error : "rgb(var(--e6-green))"}
                  />
                ))}
              </Bar>
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  }
);
LogHistogram.displayName = "LogHistogram";

export { LogHistogram };
