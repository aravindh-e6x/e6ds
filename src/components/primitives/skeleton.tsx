"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton. Can be a number (px) or string (e.g., "100%") */
  width?: number | string;
  /** Height of the skeleton. Can be a number (px) or string (e.g., "1rem") */
  height?: number | string;
  /** Shape variant of the skeleton */
  variant?: "rectangular" | "circular" | "text";
  /** Whether to animate the skeleton */
  animate?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      width,
      height,
      variant = "rectangular",
      animate = true,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      rectangular: "",
      circular: "rounded-full",
      text: "rounded-sm",
    };

    const defaultHeights = {
      rectangular: undefined,
      circular: undefined,
      text: "1em",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-muted",
          animate && "animate-pulse",
          variantStyles[variant],
          className
        )}
        style={{
          width: width,
          height: height ?? defaultHeights[variant],
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of lines to render */
  lines?: number;
  /** Gap between lines */
  gap?: number | string;
  /** Whether to animate */
  animate?: boolean;
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, gap = "0.5rem", animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        style={{ gap }}
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            animate={animate}
            className="h-4"
            style={{
              width: index === lines - 1 ? "60%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = "SkeletonText";

export interface SkeletonAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the avatar skeleton */
  size?: "sm" | "md" | "lg" | number;
  /** Whether to animate */
  animate?: boolean;
}

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = "md", animate = true, ...props }, ref) => {
    const sizeMap = {
      sm: 32,
      md: 40,
      lg: 56,
    };

    const dimension = typeof size === "number" ? size : sizeMap[size];

    return (
      <Skeleton
        ref={ref}
        variant="circular"
        width={dimension}
        height={dimension}
        animate={animate}
        className={className}
        {...props}
      />
    );
  }
);
SkeletonAvatar.displayName = "SkeletonAvatar";

export interface SkeletonCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show header skeleton */
  showHeader?: boolean;
  /** Whether to show avatar in header */
  showAvatar?: boolean;
  /** Number of content lines */
  contentLines?: number;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether to animate */
  animate?: boolean;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      className,
      showHeader = true,
      showAvatar = true,
      contentLines = 3,
      showActions = false,
      animate = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("border bg-card p-4 space-y-4", className)}
        {...props}
      >
        {showHeader && (
          <div className="flex items-center gap-3">
            {showAvatar && <SkeletonAvatar size="md" animate={animate} />}
            <div className="flex-1 space-y-2">
              <Skeleton
                variant="text"
                animate={animate}
                className="h-4 w-1/2"
              />
              <Skeleton
                variant="text"
                animate={animate}
                className="h-3 w-1/3"
              />
            </div>
          </div>
        )}
        <SkeletonText lines={contentLines} animate={animate} />
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton animate={animate} className="h-9 w-20" />
            <Skeleton animate={animate} className="h-9 w-20" />
          </div>
        )}
      </div>
    );
  }
);
SkeletonCard.displayName = "SkeletonCard";

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard };
