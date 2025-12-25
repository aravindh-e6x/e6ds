"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const TopBar = React.forwardRef<HTMLElement, TopBarProps>(
  ({ className, left, right, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("border-b border-border bg-card", className)}
        {...props}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">{left}</div>
          <div className="flex items-center gap-2">{right || children}</div>
        </div>
      </nav>
    );
  }
);
TopBar.displayName = "TopBar";

export interface TopBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

const TopBarButton = React.forwardRef<HTMLButtonElement, TopBarButtonProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "p-2 rounded-md hover:bg-accent transition-colors",
          "text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      >
        {icon || children}
      </button>
    );
  }
);
TopBarButton.displayName = "TopBarButton";

export { TopBar, TopBarButton };
