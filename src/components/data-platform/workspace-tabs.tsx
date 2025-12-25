"use client";

import * as React from "react";
import {
  X,
  FileCode,
  Database,
  File,
  Table,
  MoreHorizontal,
  Pin,
  PinOff,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type TabType = "notebook" | "sql" | "table" | "file" | "query";

export interface WorkspaceTab {
  id: string;
  title: string;
  type: TabType;
  icon?: React.ReactNode;
  isDirty?: boolean;
  isPinned?: boolean;
  path?: string;
}

export interface WorkspaceTabsProps {
  /** Array of tabs */
  tabs: WorkspaceTab[];
  /** Currently active tab ID */
  activeTabId?: string;
  /** Callback when a tab is selected */
  onTabSelect?: (tabId: string) => void;
  /** Callback when a tab is closed */
  onTabClose?: (tabId: string) => void;
  /** Callback when close all tabs is triggered */
  onCloseAll?: () => void;
  /** Callback when close other tabs is triggered */
  onCloseOthers?: (tabId: string) => void;
  /** Callback when tab is pinned/unpinned */
  onPinToggle?: (tabId: string) => void;
  /** Callback when tab is duplicated */
  onDuplicate?: (tabId: string) => void;
  /** Callback when tabs are reordered */
  onReorder?: (tabs: WorkspaceTab[]) => void;
  /** Callback when tab is opened in new window */
  onOpenInNewWindow?: (tabId: string) => void;
  /** Maximum number of visible tabs before scrolling */
  maxVisibleTabs?: number;
  /** Additional className */
  className?: string;
}

const tabTypeIcons: Record<TabType, React.ElementType> = {
  notebook: FileCode,
  sql: Database,
  table: Table,
  file: File,
  query: Database,
};

const tabTypeColors: Record<TabType, string> = {
  notebook: "text-orange-600 dark:text-orange-400",
  sql: "text-blue-600 dark:text-blue-400",
  table: "text-purple-600 dark:text-purple-400",
  file: "text-muted-foreground",
  query: "text-green-600 dark:text-green-400",
};

const WorkspaceTabs = React.forwardRef<HTMLDivElement, WorkspaceTabsProps>(
  (
    {
      tabs,
      activeTabId,
      onTabSelect,
      onTabClose,
      onCloseAll,
      onCloseOthers,
      onPinToggle,
      onDuplicate,
      onReorder,
      onOpenInNewWindow,
      className,
    },
    ref
  ) => {
    const [draggedTabId, setDraggedTabId] = React.useState<string | null>(null);
    const [dragOverTabId, setDragOverTabId] = React.useState<string | null>(
      null
    );
    const tabsContainerRef = React.useRef<HTMLDivElement>(null);

    // Separate pinned and unpinned tabs
    const pinnedTabs = tabs.filter((t) => t.isPinned);
    const unpinnedTabs = tabs.filter((t) => !t.isPinned);
    const orderedTabs = [...pinnedTabs, ...unpinnedTabs];

    const handleDragStart = (e: React.DragEvent, tabId: string) => {
      setDraggedTabId(tabId);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, tabId: string) => {
      e.preventDefault();
      if (draggedTabId && draggedTabId !== tabId) {
        setDragOverTabId(tabId);
      }
    };

    const handleDragEnd = () => {
      if (draggedTabId && dragOverTabId && onReorder) {
        const draggedIndex = orderedTabs.findIndex(
          (t) => t.id === draggedTabId
        );
        const dropIndex = orderedTabs.findIndex((t) => t.id === dragOverTabId);

        if (draggedIndex !== -1 && dropIndex !== -1) {
          const newTabs = [...orderedTabs];
          const [removed] = newTabs.splice(draggedIndex, 1);
          newTabs.splice(dropIndex, 0, removed);
          onReorder(newTabs);
        }
      }
      setDraggedTabId(null);
      setDragOverTabId(null);
    };

    const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
      e.stopPropagation();
      onTabClose?.(tabId);
    };

    const handleMiddleClick = (e: React.MouseEvent, tabId: string) => {
      if (e.button === 1) {
        e.preventDefault();
        onTabClose?.(tabId);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center border-b bg-muted/30 overflow-x-auto",
          className
        )}
      >
        <div
          ref={tabsContainerRef}
          className="flex items-center min-w-0 flex-1"
        >
          {orderedTabs.map((tab) => {
            const IconComponent = tab.icon ? null : tabTypeIcons[tab.type];
            const iconColor = tabTypeColors[tab.type];
            const isActive = tab.id === activeTabId;
            const isDragOver = tab.id === dragOverTabId;

            return (
              <div
                key={tab.id}
                draggable
                onDragStart={(e) => handleDragStart(e, tab.id)}
                onDragOver={(e) => handleDragOver(e, tab.id)}
                onDragEnd={handleDragEnd}
                onMouseDown={(e) => handleMiddleClick(e, tab.id)}
                onClick={() => onTabSelect?.(tab.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-2 border-r cursor-pointer min-w-0 max-w-[200px]",
                  "hover:bg-accent/50 transition-colors",
                  isActive && "bg-background border-b-2 border-b-primary",
                  isDragOver && "bg-accent",
                  tab.isPinned && "bg-muted/50"
                )}
              >
                {/* Pin indicator */}
                {tab.isPinned && (
                  <Pin className="h-3 w-3 text-muted-foreground shrink-0 -rotate-45" />
                )}

                {/* Icon */}
                <span className={cn("h-4 w-4 shrink-0", iconColor)}>
                  {tab.icon ? (
                    tab.icon
                  ) : IconComponent ? (
                    <IconComponent className="h-4 w-4" />
                  ) : null}
                </span>

                {/* Title */}
                <span className="text-sm truncate flex-1">
                  {tab.title}
                  {tab.isDirty && (
                    <span className="ml-1 text-muted-foreground">•</span>
                  )}
                </span>

                {/* Close button */}
                {!tab.isPinned && (
                  <button
                    onClick={(e) => handleCloseClick(e, tab.id)}
                    className={cn(
                      "p-0.5 rounded hover:bg-muted shrink-0",
                      "opacity-0 group-hover:opacity-100",
                      isActive && "opacity-100"
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}

                {/* Context menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "p-0.5 rounded hover:bg-muted shrink-0",
                        "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onTabClose?.(tab.id)}>
                      <X className="mr-2 h-4 w-4" />
                      Close
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCloseOthers?.(tab.id)}>
                      Close Others
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCloseAll?.()}>
                      Close All
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onPinToggle?.(tab.id)}>
                      {tab.isPinned ? (
                        <>
                          <PinOff className="mr-2 h-4 w-4" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin className="mr-2 h-4 w-4" />
                          Pin
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate?.(tab.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    {onOpenInNewWindow && (
                      <DropdownMenuItem
                        onClick={() => onOpenInNewWindow(tab.id)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Window
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
WorkspaceTabs.displayName = "WorkspaceTabs";

export { WorkspaceTabs };
