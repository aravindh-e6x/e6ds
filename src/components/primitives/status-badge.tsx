"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 text-sm font-medium",
  {
    variants: {
      status: {
        active: "text-green-600 dark:text-green-400",
        disabled: "text-muted-foreground",
        accepted: "text-green-600 dark:text-green-400",
        pending: "text-yellow-600 dark:text-yellow-400",
        suspended: "text-muted-foreground",
        error: "text-destructive",
        warning: "text-yellow-600 dark:text-yellow-400",
      },
      showDot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      status: "active",
      showDot: true,
    },
  }
);

const dotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    status: {
      active: "bg-green-500 dark:bg-green-400",
      disabled: "bg-muted-foreground",
      accepted: "bg-green-500 dark:bg-green-400",
      pending: "bg-yellow-500 dark:bg-yellow-400",
      suspended: "bg-muted-foreground",
      error: "bg-destructive",
      warning: "bg-yellow-500 dark:bg-yellow-400",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "active" | "disabled" | "accepted" | "pending" | "suspended" | "error" | "warning" | null;
  showDot?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, showDot = true, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ status, className }))}
        {...props}
      >
        {showDot && <span className={cn(dotVariants({ status }))} />}
        {children}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
