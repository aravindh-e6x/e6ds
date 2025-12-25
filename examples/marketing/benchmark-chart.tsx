"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BenchmarkItem {
  /** Item label */
  label: string;
  /** Item value (numeric) */
  value: number;
  /** Formatted display value */
  displayValue: string;
  /** Whether this is the highlighted/winning item */
  highlighted?: boolean;
}

export interface BenchmarkChartProps {
  /** Chart title */
  title: string;
  /** Chart subtitle/description */
  subtitle?: string;
  /** Benchmark items to display */
  items: BenchmarkItem[];
  /** Unit label (e.g., "ms", "GB", "$") */
  unit?: string;
  /** Note displayed below the chart */
  note?: string;
  /** Whether lower values are better */
  lowerIsBetter?: boolean;
  /** Visual variant */
  variant?: "default" | "horizontal" | "minimal";
  /** Additional className */
  className?: string;
}

const BenchmarkChart = React.forwardRef<HTMLDivElement, BenchmarkChartProps>(
  (
    {
      title,
      subtitle,
      items,
      unit,
      note,
      lowerIsBetter = false,
      variant = "default",
      className,
    },
    ref
  ) => {
    const maxValue = Math.max(...items.map((item) => item.value));

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-background p-6",
          variant === "minimal" && "border-0 bg-transparent p-0",
          className
        )}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Bars */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const isWinner = lowerIsBetter
              ? item.value === Math.min(...items.map((i) => i.value))
              : item.value === maxValue;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      (item.highlighted || isWinner) && "text-primary"
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      (item.highlighted || isWinner) && "text-primary"
                    )}
                  >
                    {item.displayValue}
                    {unit && <span className="text-muted-foreground ml-0.5">{unit}</span>}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      item.highlighted || isWinner
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        {note && (
          <p className="mt-4 text-xs text-muted-foreground">{note}</p>
        )}
      </div>
    );
  }
);
BenchmarkChart.displayName = "BenchmarkChart";

export interface BenchmarkGridProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of benchmark charts */
  benchmarks: BenchmarkChartProps[];
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Additional className */
  className?: string;
}

const BenchmarkGrid = React.forwardRef<HTMLDivElement, BenchmarkGridProps>(
  (
    {
      heading,
      subheading,
      benchmarks,
      columns = 2,
      className,
    },
    ref
  ) => {
    return (
      <section ref={ref} className={cn("py-16 px-4", className)}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {subheading}
                </p>
              )}
            </div>
          )}

          {/* Grid */}
          <div
            className={cn(
              "grid gap-6",
              columns === 2 && "grid-cols-1 md:grid-cols-2",
              columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {benchmarks.map((benchmark, index) => (
              <BenchmarkChart key={index} {...benchmark} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
BenchmarkGrid.displayName = "BenchmarkGrid";

export { BenchmarkChart, BenchmarkGrid };
