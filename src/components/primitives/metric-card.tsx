import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export type MetricTrend = "up" | "down" | "neutral";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: MetricTrend;
  icon?: React.ReactNode;
  description?: string;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      label,
      value,
      change,
      changeLabel,
      trend,
      icon,
      description,
      className,
      ...props
    },
    ref
  ) => {
    const determinedTrend = trend || (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined);

    const TrendIcon = determinedTrend === "up"
      ? TrendingUp
      : determinedTrend === "down"
        ? TrendingDown
        : Minus;

    const trendColor = determinedTrend === "up"
      ? "text-green-500 dark:text-green-400"
      : determinedTrend === "down"
        ? "text-red-500 dark:text-red-400"
        : "text-muted-foreground";

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 bg-card border border-border rounded-none",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            {(change !== undefined || changeLabel) && (
              <div className={cn("flex items-center mt-2 text-sm", trendColor)}>
                {determinedTrend && <TrendIcon className="w-4 h-4 mr-1" />}
                {change !== undefined && (
                  <span>
                    {change > 0 ? "+" : ""}
                    {change}%
                  </span>
                )}
                {changeLabel && (
                  <span className="ml-1 text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
            {description && (
              <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-muted rounded-none">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { MetricCard };
