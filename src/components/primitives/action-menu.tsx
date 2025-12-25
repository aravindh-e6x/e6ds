"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { IconButton } from "./icon-button";

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

const ActionMenu = React.forwardRef<HTMLButtonElement, ActionMenuProps>(
  ({ items, trigger, align = "end", className }, ref) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <IconButton ref={ref} variant="ghost" size="sm" className={className}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </IconButton>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {items.map((item, index) => {
            if (item.separator) {
              return <DropdownMenuSeparator key={index} />;
            }
            return (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                disabled={item.disabled}
                className={cn(item.destructive && "text-destructive")}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ActionMenu.displayName = "ActionMenu";

export { ActionMenu };
