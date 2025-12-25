"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatBadgeProps {
  /** Main stat value */
  value: string;
  /** Label/description */
  label: string;
  /** Optional sublabel */
  sublabel?: string;
  /** Visual variant */
  variant?: "default" | "outline" | "filled" | "highlight";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

const StatBadge = React.forwardRef<HTMLDivElement, StatBadgeProps>(
  (
    {
      value,
      label,
      sublabel,
      variant = "default",
      size = "md",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col rounded-lg transition-colors",
          // Variants
          variant === "default" && "bg-muted/50",
          variant === "outline" && "border border-border bg-background",
          variant === "filled" && "bg-primary/10",
          variant === "highlight" && "bg-primary text-primary-foreground",
          // Sizes
          size === "sm" && "px-3 py-2",
          size === "md" && "px-4 py-3",
          size === "lg" && "px-6 py-4",
          className
        )}
      >
        <span
          className={cn(
            "font-bold",
            variant === "highlight" ? "text-primary-foreground" : "text-primary",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}
        >
          {value}
        </span>
        <span
          className={cn(
            "font-medium",
            variant === "highlight"
              ? "text-primary-foreground/90"
              : "text-foreground",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className={cn(
              variant === "highlight"
                ? "text-primary-foreground/70"
                : "text-muted-foreground",
              size === "sm" && "text-xs",
              size === "md" && "text-xs",
              size === "lg" && "text-sm"
            )}
          >
            {sublabel}
          </span>
        )}
      </div>
    );
  }
);
StatBadge.displayName = "StatBadge";

export interface StatBadgeGroupProps {
  /** Array of stat badges */
  stats: Omit<StatBadgeProps, "variant" | "size">[];
  /** Visual variant for all badges */
  variant?: StatBadgeProps["variant"];
  /** Size variant for all badges */
  size?: StatBadgeProps["size"];
  /** Layout direction */
  direction?: "row" | "column";
  /** Additional className */
  className?: string;
}

const StatBadgeGroup = React.forwardRef<HTMLDivElement, StatBadgeGroupProps>(
  (
    {
      stats,
      variant = "outline",
      size = "md",
      direction = "row",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-4",
          direction === "row" && "flex-row flex-wrap justify-center",
          direction === "column" && "flex-col",
          className
        )}
      >
        {stats.map((stat, index) => (
          <StatBadge
            key={index}
            {...stat}
            variant={variant}
            size={size}
          />
        ))}
      </div>
    );
  }
);
StatBadgeGroup.displayName = "StatBadgeGroup";

export { StatBadge, StatBadgeGroup };
