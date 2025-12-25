"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MainContentProps extends React.HTMLAttributes<HTMLElement> {
  sidebarCollapsed?: boolean;
  hasSidebar?: boolean;
}

const MainContent = React.forwardRef<HTMLElement, MainContentProps>(
  ({ className, sidebarCollapsed, hasSidebar = true, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "min-h-screen transition-all duration-300",
          hasSidebar && (sidebarCollapsed ? "ml-16" : "ml-64"),
          className
        )}
        {...props}
      >
        {children}
      </main>
    );
  }
);
MainContent.displayName = "MainContent";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between border-b border-border bg-background px-6 py-4",
          className
        )}
        {...props}
      >
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

export interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-6", className)} {...props}>
        {children}
      </div>
    );
  }
);
PageContent.displayName = "PageContent";

export { MainContent, PageHeader, PageContent };
