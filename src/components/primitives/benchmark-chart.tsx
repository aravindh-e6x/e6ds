import * as React from "react";
import { cn } from "../../lib/utils";

export interface BenchmarkItem {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface BenchmarkChartProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BenchmarkItem[];
  maxValue?: number;
  orientation?: "horizontal" | "vertical";
  formatValue?: (value: number) => string;
  unit?: string;
  lowerIsBetter?: boolean;
}

const defaultFormatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const BenchmarkChart = React.forwardRef<HTMLDivElement, BenchmarkChartProps>(
  (
    {
      items,
      maxValue,
      orientation = "horizontal",
      formatValue = defaultFormatValue,
      unit,
      lowerIsBetter,
      className,
      ...props
    },
    ref
  ) => {
    const calculatedMax = maxValue || Math.max(...items.map((item) => item.value)) * 1.1;

    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          className={cn("flex items-end justify-around gap-4 h-64", className)}
          {...props}
        >
          {items.map((item) => {
            const percentage = (item.value / calculatedMax) * 100;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <span className="text-sm font-medium">
                  {formatValue(item.value)}
                  {unit && <span className="text-muted-foreground ml-1">{unit}</span>}
                </span>
                <div className="w-full flex justify-center">
                  <div
                    className={cn(
                      "w-12 transition-all duration-500",
                      item.highlight
                        ? "bg-brand-primary"
                        : "bg-muted-foreground/30"
                    )}
                    style={{ height: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {lowerIsBetter && (
          <p className="text-xs text-muted-foreground">* Lower is better</p>
        )}
        {items.map((item) => {
          const percentage = (item.value / calculatedMax) * 100;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {formatValue(item.value)}
                  {unit && <span className="ml-1">{unit}</span>}
                </span>
              </div>
              <div className="h-6 bg-muted rounded-none overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    item.highlight
                      ? "bg-brand-primary"
                      : "bg-muted-foreground/50"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
BenchmarkChart.displayName = "BenchmarkChart";

export { BenchmarkChart };
