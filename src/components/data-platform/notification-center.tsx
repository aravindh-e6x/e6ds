"use client";

import * as React from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  Check,
  Trash2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../primitives/popover";
import { formatDistanceToNow } from "date-fns";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: Date;
  read?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationCenterProps {
  /** Notifications */
  notifications: Notification[];
  /** Callback when notification is marked as read */
  onMarkAsRead?: (id: string) => void;
  /** Callback when all notifications are marked as read */
  onMarkAllAsRead?: () => void;
  /** Callback when notification is dismissed */
  onDismiss?: (id: string) => void;
  /** Callback when all notifications are cleared */
  onClearAll?: () => void;
  /** Callback when settings is clicked */
  onSettings?: () => void;
  /** Maximum height of the list */
  maxHeight?: number;
  /** Additional className for trigger */
  className?: string;
}

const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  error: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-destructive",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  warning: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
};

const NotificationCenter = React.forwardRef<
  HTMLButtonElement,
  NotificationCenterProps
>(
  (
    {
      notifications,
      onMarkAsRead,
      onMarkAllAsRead,
      onDismiss,
      onClearAll,
      onSettings,
      maxHeight = 400,
      className,
    },
    ref
  ) => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className={cn("relative", className)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-medium">Notifications</span>
            <div className="flex items-center gap-1">
              {onMarkAllAsRead && unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={onMarkAllAsRead}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={onSettings}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="overflow-auto" style={{ maxHeight }}>
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type];

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "group relative px-4 py-3 hover:bg-muted/50",
                        !notification.read && "bg-muted/30"
                      )}
                      onClick={() => {
                        if (!notification.read) {
                          onMarkAsRead?.(notification.id);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <span className={cn("shrink-0 mt-0.5", config.color)}>
                          {config.icon}
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-sm">
                              {notification.title}
                            </div>
                            {/* Dismiss button */}
                            {onDismiss && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismiss(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          {notification.message && (
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {notification.message}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </span>

                            {notification.actionLabel && notification.onAction && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.onAction?.();
                                }}
                                className="text-xs text-link hover:underline"
                              >
                                {notification.actionLabel}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && onClearAll && (
            <div className="px-4 py-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={onClearAll}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);
NotificationCenter.displayName = "NotificationCenter";

export { NotificationCenter };
