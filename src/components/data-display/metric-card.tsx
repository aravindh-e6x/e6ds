"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const metricCardVariants = cva(
  "border bg-card p-6",
  {
    variants: {
      size: {
        default: "",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  description?: string;
  trend?: React.ReactNode;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      title,
      value,
      change,
      changeType = "neutral",
      icon,
      description,
      trend,
      size,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(metricCardVariants({ size }), className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-card-foreground">{value}</h3>
              {change && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    changeType === "positive" && "text-green-600 dark:text-green-400",
                    changeType === "negative" && "text-red-600 dark:text-red-400",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            {trend && <div className="mt-4">{trend}</div>}
          </div>
          {icon && (
            <div className="rounded-lg bg-primary/10 p-3 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { MetricCard, metricCardVariants };
