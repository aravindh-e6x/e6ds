"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnnotationMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  color?: string;
}

const AnnotationMarker = React.forwardRef<HTMLDivElement, AnnotationMarkerProps>(
  ({ className, label, color = "#8b5cf6", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("absolute flex flex-col items-center", className)} {...props}>
        <div
          className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent"
          style={{ borderBottomColor: color }}
        />
        <div className="w-px h-full" style={{ backgroundColor: color }} />
        <span
          className="px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </div>
    );
  }
);
AnnotationMarker.displayName = "AnnotationMarker";

export { AnnotationMarker };
