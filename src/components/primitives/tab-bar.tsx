"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: "underline" | "pills" | "enclosed";
  size?: "sm" | "default" | "lg";
}

const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  (
    {
      className,
      tabs,
      activeTab,
      onTabChange,
      variant = "underline",
      size = "default",
      ...props
    },
    ref
  ) => {
    const [internalActiveTab, setInternalActiveTab] = React.useState(tabs[0]?.id);
    const currentTab = activeTab ?? internalActiveTab;

    const handleTabClick = (tabId: string) => {
      setInternalActiveTab(tabId);
      onTabChange?.(tabId);
    };

    const sizeClasses = {
      sm: "text-sm px-3 py-1.5",
      default: "text-sm px-4 py-2",
      lg: "text-base px-5 py-2.5",
    };

    const getTabClasses = (tab: TabItem) => {
      const isActive = currentTab === tab.id;
      const baseClasses = cn(
        "inline-flex items-center gap-2 font-medium transition-colors",
        sizeClasses[size],
        tab.disabled && "opacity-50 pointer-events-none"
      );

      switch (variant) {
        case "underline":
          return cn(
            baseClasses,
            "border-b-2 -mb-px",
            isActive
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          );
        case "pills":
          return cn(
            baseClasses,
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          );
        case "enclosed":
          return cn(
            baseClasses,
            "border border-b-0",
            isActive
              ? "border-border bg-background text-foreground -mb-px"
              : "border-transparent text-muted-foreground hover:text-foreground"
          );
        default:
          return baseClasses;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          variant === "underline" && "border-b",
          variant === "pills" && "gap-1",
          className
        )}
        role="tablist"
        {...props}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={currentTab === tab.id}
            disabled={tab.disabled}
            className={getTabClasses(tab)}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs bg-muted rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }
);
TabBar.displayName = "TabBar";

export { TabBar };
