"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertStateVariants = cva(
  "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded",
  {
    variants: {
      state: {
        firing: "bg-red-500/20 text-red-700 dark:text-red-400",
        pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
        resolved: "bg-green-500/20 text-green-700 dark:text-green-400",
        normal: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      state: "normal",
    },
  }
);

export type AlertState = "firing" | "pending" | "resolved" | "normal";

export interface AlertStateIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: AlertState;
}

const AlertStateIndicator = React.forwardRef<HTMLSpanElement, AlertStateIndicatorProps>(
  ({ className, state, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(alertStateVariants({ state }), className)} {...props}>
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          state === "firing" && "bg-red-500 animate-pulse",
          state === "pending" && "bg-yellow-500",
          state === "resolved" && "bg-green-500",
          state === "normal" && "bg-gray-400"
        )} />
        {state}
      </span>
    );
  }
);
AlertStateIndicator.displayName = "AlertStateIndicator";

export { AlertStateIndicator, alertStateVariants };
