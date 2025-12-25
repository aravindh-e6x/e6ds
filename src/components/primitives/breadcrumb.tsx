"use client";

import * as React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  maxItems?: number;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      items,
      separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      showHomeIcon = false,
      maxItems,
      ...props
    },
    ref
  ) => {
    let displayItems = items;
    let showEllipsis = false;

    if (maxItems && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-(maxItems - 1));
      displayItems = [firstItem, ...lastItems];
      showEllipsis = true;
    }

    const renderItem = (item: BreadcrumbItem, isLast: boolean, index: number) => {
      const content = (
        <>
          {index === 0 && showHomeIcon && !item.icon && (
            <Home className="h-4 w-4 mr-1" />
          )}
          {item.icon && <span className="mr-1">{item.icon}</span>}
          {item.label}
        </>
      );

      if (isLast) {
        return (
          <span className="text-foreground font-medium flex items-center">
            {content}
          </span>
        );
      }

      if (item.href) {
        return (
          <a
            href={item.href}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            onClick={item.onClick}
          >
            {content}
          </a>
        );
      }

      if (item.onClick) {
        return (
          <button
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            onClick={item.onClick}
          >
            {content}
          </button>
        );
      }

      return (
        <span className="text-muted-foreground flex items-center">{content}</span>
      );
    };

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn("", className)} {...props}>
        <ol className="flex items-center gap-2 text-sm">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const actualIndex = showEllipsis && index > 0 ? index + (items.length - displayItems.length) : index;

            return (
              <React.Fragment key={actualIndex}>
                {showEllipsis && index === 1 && (
                  <>
                    <li className="text-muted-foreground">...</li>
                    <li className="flex items-center">{separator}</li>
                  </>
                )}
                <li className="flex items-center">{renderItem(item, isLast, index)}</li>
                {!isLast && <li className="flex items-center">{separator}</li>}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
