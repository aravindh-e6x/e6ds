"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "default" | "lg";
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      illustration,
      title,
      description,
      action,
      secondaryAction,
      size = "default",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: {
        container: "py-8",
        iconContainer: "h-12 w-12",
        title: "text-base",
        description: "text-sm",
      },
      default: {
        container: "py-12",
        iconContainer: "h-16 w-16",
        title: "text-lg",
        description: "text-sm",
      },
      lg: {
        container: "py-16",
        iconContainer: "h-20 w-20",
        title: "text-xl",
        description: "text-base",
      },
    };

    const classes = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          classes.container,
          className
        )}
        {...props}
      >
        {illustration ? (
          <div className="mb-6">{illustration}</div>
        ) : icon ? (
          <div
            className={cn(
              "mb-4 flex items-center justify-center rounded-full bg-muted",
              classes.iconContainer
            )}
          >
            {icon}
          </div>
        ) : null}
        <h3 className={cn("font-semibold text-foreground", classes.title)}>
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "mt-2 max-w-sm text-muted-foreground",
              classes.description
            )}
          >
            {description}
          </p>
        )}
        {(action || secondaryAction) && (
          <div className="mt-6 flex items-center gap-3">
            {action && (
              <Button
                variant={action.variant || "default"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
