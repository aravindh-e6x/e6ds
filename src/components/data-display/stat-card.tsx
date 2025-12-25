"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  previousValue?: string | number;
  percentChange?: number;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      previousValue,
      percentChange,
      prefix,
      suffix,
      loading,
      ...props
    },
    ref
  ) => {
    const getTrendIcon = () => {
      if (percentChange === undefined) return null;
      if (percentChange > 0) return <TrendingUp className="h-4 w-4" />;
      if (percentChange < 0) return <TrendingDown className="h-4 w-4" />;
      return <Minus className="h-4 w-4" />;
    };

    const getTrendColor = () => {
      if (percentChange === undefined) return "text-muted-foreground";
      if (percentChange > 0) return "text-green-600 dark:text-green-400";
      if (percentChange < 0) return "text-red-600 dark:text-red-400";
      return "text-muted-foreground";
    };

    return (
      <div
        ref={ref}
        className={cn("border bg-card p-6", className)}
        {...props}
      >
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-2">
          {loading ? (
            <div className="h-9 w-24 animate-pulse bg-muted rounded" />
          ) : (
            <p className="text-3xl font-bold">
              {prefix}
              {value}
              {suffix}
            </p>
          )}
        </div>
        {(previousValue !== undefined || percentChange !== undefined) && (
          <div className="mt-2 flex items-center gap-2">
            {percentChange !== undefined && (
              <span className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                {getTrendIcon()}
                {Math.abs(percentChange).toFixed(1)}%
              </span>
            )}
            {previousValue !== undefined && (
              <span className="text-sm text-muted-foreground">
                from {prefix}
                {previousValue}
                {suffix}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
