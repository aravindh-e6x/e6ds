"use client";

import * as React from "react";
import {
  Star,
  FileCode,
  Database,
  File,
  Table,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type FavoriteItemType = "notebook" | "sql" | "table" | "file" | "query" | "folder";

export interface FavoriteItem {
  id: string;
  name: string;
  type: FavoriteItemType;
  path?: string;
  icon?: React.ReactNode;
}

export interface FavoritesProps {
  /** Array of favorite items */
  items: FavoriteItem[];
  /** Title for the section */
  title?: string;
  /** Callback when an item is clicked */
  onItemClick?: (item: FavoriteItem) => void;
  /** Callback when an item is removed from favorites */
  onRemove?: (item: FavoriteItem) => void;
  /** Callback when item is opened in new tab */
  onOpenInNewTab?: (item: FavoriteItem) => void;
  /** Callback when items are reordered */
  onReorder?: (items: FavoriteItem[]) => void;
  /** Whether to show the path */
  showPath?: boolean;
  /** Whether items can be reordered */
  reorderable?: boolean;
  /** Additional className */
  className?: string;
}

const itemTypeIcons: Record<FavoriteItemType, React.ElementType> = {
  notebook: FileCode,
  sql: Database,
  table: Table,
  file: File,
  query: Database,
  folder: File,
};

const itemTypeColors: Record<FavoriteItemType, string> = {
  notebook: "text-orange-600 dark:text-orange-400",
  sql: "text-blue-600 dark:text-blue-400",
  table: "text-purple-600 dark:text-purple-400",
  file: "text-muted-foreground",
  query: "text-green-600 dark:text-green-400",
  folder: "text-yellow-600 dark:text-yellow-400",
};

const Favorites = React.forwardRef<HTMLDivElement, FavoritesProps>(
  (
    {
      items,
      title = "Favorites",
      onItemClick,
      onRemove,
      onOpenInNewTab,
      onReorder,
      showPath = true,
      reorderable = false,
      className,
    },
    ref
  ) => {
    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(
      null
    );

    const handleDragStart = (index: number) => {
      setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex(index);
      }
    };

    const handleDragEnd = () => {
      if (
        draggedIndex !== null &&
        dragOverIndex !== null &&
        draggedIndex !== dragOverIndex &&
        onReorder
      ) {
        const newItems = [...items];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(dragOverIndex, 0, removed);
        onReorder(newItems);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    return (
      <div ref={ref} className={cn("", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">
            ({items.length})
          </span>
        </div>

        {/* Items list */}
        <div className="py-1">
          {items.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No favorites yet
            </div>
          ) : (
            items.map((item, index) => {
              const IconComponent = item.icon
                ? null
                : itemTypeIcons[item.type];
              const iconColor = itemTypeColors[item.type];
              const isDragOver = dragOverIndex === index;

              return (
                <div
                  key={item.id}
                  draggable={reorderable}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer",
                    isDragOver && "bg-accent border-t-2 border-primary"
                  )}
                  onClick={() => onItemClick?.(item)}
                >
                  {/* Drag handle */}
                  {reorderable && (
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
                  )}

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
                    <div className="text-sm truncate">{item.name}</div>
                    {showPath && item.path && (
                      <div className="text-xs text-muted-foreground truncate">
                        {item.path}
                      </div>
                    )}
                  </div>

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
                      {onRemove && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove from Favorites
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
Favorites.displayName = "Favorites";

export { Favorites };
