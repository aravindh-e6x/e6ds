"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: number;
}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ className, columns = 2, gap = 4, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid", className)}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 0.25}rem`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DashboardGrid.displayName = "DashboardGrid";

export { DashboardGrid };
