"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  ({ className, data, width = 100, height = 24, color = "rgb(var(--e6-green))", ...props }, ref) => {
    if (!data.length) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        <svg width={width} height={height}>
          <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} />
        </svg>
      </div>
    );
  }
);
Sparkline.displayName = "Sparkline";

export { Sparkline };
