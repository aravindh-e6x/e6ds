"use client";

import * as React from "react";
import {
  Clock,
  FileCode,
  Database,
  File,
  Table,
  Star,
  MoreHorizontal,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

export type RecentItemType = "notebook" | "sql" | "table" | "file" | "query";

export interface RecentItem {
  id: string;
  name: string;
  type: RecentItemType;
  path?: string;
  lastAccessed: Date;
  isFavorite?: boolean;
  icon?: React.ReactNode;
}

export interface RecentItemsProps {
  /** Array of recent items */
  items: RecentItem[];
  /** Title for the section */
  title?: string;
  /** Maximum items to display */
  maxItems?: number;
  /** Callback when an item is clicked */
  onItemClick?: (item: RecentItem) => void;
  /** Callback when an item is removed from recents */
  onRemove?: (item: RecentItem) => void;
  /** Callback when favorite is toggled */
  onFavoriteToggle?: (item: RecentItem) => void;
  /** Callback when item is opened in new tab */
  onOpenInNewTab?: (item: RecentItem) => void;
  /** Whether to show the path */
  showPath?: boolean;
  /** Whether to show timestamps */
  showTimestamp?: boolean;
  /** Additional className */
  className?: string;
}

const itemTypeIcons: Record<RecentItemType, React.ElementType> = {
  notebook: FileCode,
  sql: Database,
  table: Table,
  file: File,
  query: Database,
};

const itemTypeColors: Record<RecentItemType, string> = {
  notebook: "text-orange-600 dark:text-orange-400",
  sql: "text-blue-600 dark:text-blue-400",
  table: "text-purple-600 dark:text-purple-400",
  file: "text-muted-foreground",
  query: "text-green-600 dark:text-green-400",
};

const RecentItems = React.forwardRef<HTMLDivElement, RecentItemsProps>(
  (
    {
      items,
      title = "Recent",
      maxItems = 10,
      onItemClick,
      onRemove,
      onFavoriteToggle,
      onOpenInNewTab,
      showPath = true,
      showTimestamp = true,
      className,
    },
    ref
  ) => {
    const displayItems = items.slice(0, maxItems);

    return (
      <div ref={ref} className={cn("", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">
            ({items.length})
          </span>
        </div>

        {/* Items list */}
        <div className="py-1">
          {displayItems.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No recent items
            </div>
          ) : (
            displayItems.map((item) => {
              const IconComponent = item.icon
                ? null
                : itemTypeIcons[item.type];
              const iconColor = itemTypeColors[item.type];

              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => onItemClick?.(item)}
                >
                  {/* Icon */}
                  <span className={cn("h-4 w-4 shrink-0", iconColor)}>
                    {item.icon ? (
                      item.icon
                    ) : IconComponent ? (
                      <IconComponent className="h-4 w-4" />
                    ) : null}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate">{item.name}</span>
                      {item.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                    </div>
                    {showPath && item.path && (
                      <div className="text-xs text-muted-foreground truncate">
                        {item.path}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  {showTimestamp && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(item.lastAccessed, {
                        addSuffix: true,
                      })}
                    </span>
                  )}

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onOpenInNewTab && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInNewTab(item);
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in New Tab
                        </DropdownMenuItem>
                      )}
                      {onFavoriteToggle && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteToggle(item);
                          }}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {item.isFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </DropdownMenuItem>
                      )}
                      {onRemove && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove from Recent
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);
RecentItems.displayName = "RecentItems";

export { RecentItems };
