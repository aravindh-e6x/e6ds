"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  color?: string;
}

const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  ({ className, value, max = 100, label, size = 120, color = "rgb(var(--e6-green))", ...props }, ref) => {
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const strokeWidth = size * 0.08;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI;
    const offset = circumference * (1 - percentage);

    return (
      <div ref={ref} className={cn("flex flex-col items-center", className)} {...props}>
        <svg width={size} height={size / 2 + strokeWidth}>
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="text-2xl font-semibold -mt-6" style={{ color }}>
          {Math.round(value)}%
        </div>
        {label && <div className="text-sm text-muted-foreground">{label}</div>}
      </div>
    );
  }
);
Gauge.displayName = "Gauge";

export { Gauge };
