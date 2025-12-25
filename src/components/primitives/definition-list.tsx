"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DefinitionItem {
  term: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
}

export interface DefinitionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DefinitionItem[];
  layout?: "horizontal" | "vertical" | "grid";
  columns?: 1 | 2 | 3 | 4;
  striped?: boolean;
  bordered?: boolean;
}

const DefinitionList = React.forwardRef<HTMLDListElement, DefinitionListProps>(
  (
    {
      className,
      items,
      layout = "horizontal",
      columns = 1,
      striped = false,
      bordered = true,
      ...props
    },
    ref
  ) => {
    if (layout === "grid") {
      const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
      };

      return (
        <dl
          ref={ref}
          className={cn("grid gap-4", gridCols[columns], className)}
          {...props}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "space-y-1",
                bordered && "p-4 border bg-card"
              )}
            >
              <dt className="text-sm text-muted-foreground flex items-center gap-2">
                {item.icon}
                {item.term}
              </dt>
              <dd className="text-sm font-medium">{item.description}</dd>
            </div>
          ))}
        </dl>
      );
    }

    if (layout === "vertical") {
      return (
        <dl
          ref={ref}
          className={cn("space-y-4", className)}
          {...props}
        >
          {items.map((item, index) => (
            <div key={index} className="space-y-1">
              <dt className="text-sm text-muted-foreground flex items-center gap-2">
                {item.icon}
                {item.term}
              </dt>
              <dd className="text-sm font-medium">{item.description}</dd>
            </div>
          ))}
        </dl>
      );
    }

    // Horizontal layout (table-like)
    return (
      <dl
        ref={ref}
        className={cn(bordered && "border", className)}
        {...props}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              bordered && index !== items.length - 1 && "border-b",
              striped && index % 2 === 1 && "bg-muted/30"
            )}
          >
            <dt
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground bg-muted/50",
                "w-1/3 min-w-[150px] max-w-[250px]"
              )}
            >
              {item.icon}
              {item.term}
            </dt>
            <dd className="flex-1 px-4 py-3 text-sm">{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  }
);
DefinitionList.displayName = "DefinitionList";

export { DefinitionList };
