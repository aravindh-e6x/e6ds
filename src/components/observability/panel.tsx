"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: { label: string; onClick: () => void }[];
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border bg-card flex flex-col", className)} {...props}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 hover:bg-muted rounded">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action) => (
                  <DropdownMenuItem key={action.label} onClick={action.onClick}>
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    );
  }
);
Panel.displayName = "Panel";

export { Panel };
