"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      collapsed = false,
      onCollapsedChange,
      collapsible = true,
      header,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && header}
          {collapsible && (
            <button
              onClick={() => onCollapsedChange?.(!collapsed)}
              className={cn(
                "rounded-md p-1.5 hover:bg-sidebar-accent transition-colors",
                "text-sidebar-foreground",
                collapsed && "mx-auto"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation content */}
        <nav className="flex flex-col gap-1 p-2 overflow-y-auto h-[calc(100vh-3.5rem-4rem)]">
          {children}
        </nav>

        {/* Footer */}
        {footer && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border bg-sidebar p-2">
            {footer}
          </div>
        )}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

export interface SidebarItemProps extends React.HTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
  asChild?: boolean;
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, icon, active, collapsed, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground",
          collapsed && "justify-center px-2",
          className
        )}
        title={collapsed && typeof children === "string" ? children : undefined}
        {...props}
      >
        {icon && <span className="h-5 w-5 shrink-0 flex items-center justify-center">{icon}</span>}
        {!collapsed && <span>{children}</span>}
      </a>
    );
  }
);
SidebarItem.displayName = "SidebarItem";

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("my-2 border-t border-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string; collapsed?: boolean }
>(({ className, title, collapsed, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props}>
    {title && !collapsed && (
      <h4 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h4>
    )}
    {children}
  </div>
));
SidebarSection.displayName = "SidebarSection";

// Nested sidebar components

export interface SidebarNestedItemProps {
  /** Label text for the nested item */
  label: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Whether this item is currently active */
  active?: boolean;
  /** Whether the sidebar is collapsed */
  collapsed?: boolean;
  /** Children items to render when expanded */
  children?: React.ReactNode;
  /** Default expanded state */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Click handler for the item (if no children) */
  onClick?: () => void;
  /** Href for the item (if no children) */
  href?: string;
  /** Additional className */
  className?: string;
}

const SidebarNestedItem = React.forwardRef<HTMLDivElement, SidebarNestedItemProps>(
  (
    {
      label,
      icon,
      active,
      collapsed,
      children,
      defaultExpanded = false,
      expanded: controlledExpanded,
      onExpandedChange,
      onClick,
      href,
      className,
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : internalExpanded;
    const hasChildren = React.Children.count(children) > 0;

    const handleToggle = () => {
      if (hasChildren) {
        const newExpanded = !expanded;
        if (!isControlled) {
          setInternalExpanded(newExpanded);
        }
        onExpandedChange?.(newExpanded);
      } else {
        onClick?.();
      }
    };

    const content = (
      <>
        {icon && (
          <span className="h-5 w-5 shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  expanded && "rotate-180"
                )}
              />
            )}
          </>
        )}
      </>
    );

    // If it's a link without children
    if (href && !hasChildren) {
      return (
        <div ref={ref} className={className}>
          <a
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors w-full",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground border border-foreground"
                : "text-sidebar-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? label : undefined}
          >
            {content}
          </a>
        </div>
      );
    }

    return (
      <div ref={ref} className={className}>
        <button
          onClick={handleToggle}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors w-full",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            active
              ? "bg-sidebar-primary text-sidebar-primary-foreground border border-foreground"
              : "text-sidebar-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? label : undefined}
        >
          {content}
        </button>
        {hasChildren && expanded && !collapsed && (
          <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
            {children}
          </div>
        )}
      </div>
    );
  }
);
SidebarNestedItem.displayName = "SidebarNestedItem";

export interface SidebarSubItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Whether this item is currently active */
  active?: boolean;
}

const SidebarSubItem = React.forwardRef<HTMLAnchorElement, SidebarSubItemProps>(
  ({ className, icon, active, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          active
            ? "text-sidebar-primary-foreground font-medium"
            : "text-sidebar-foreground/80",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="h-4 w-4 shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </a>
    );
  }
);
SidebarSubItem.displayName = "SidebarSubItem";

export {
  Sidebar,
  SidebarItem,
  SidebarSeparator,
  SidebarSection,
  SidebarNestedItem,
  SidebarSubItem,
};
