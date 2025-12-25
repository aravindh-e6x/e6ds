"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton, type IconButtonProps } from "./icon-button";

export interface RefreshButtonProps extends Omit<IconButtonProps, "children"> {
  loading?: boolean;
  onRefresh?: () => void;
}

const RefreshButton = React.forwardRef<HTMLButtonElement, RefreshButtonProps>(
  ({ className, loading, onRefresh, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onRefresh?.();
      onClick?.(e);
    };

    return (
      <IconButton
        ref={ref}
        variant="ghost"
        size="sm"
        className={cn(className)}
        onClick={handleClick}
        disabled={loading}
        {...props}
      >
        <RefreshCw
          className={cn("h-4 w-4", loading && "animate-spin")}
        />
        <span className="sr-only">Refresh</span>
      </IconButton>
    );
  }
);
RefreshButton.displayName = "RefreshButton";

export { RefreshButton };
