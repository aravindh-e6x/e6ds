"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PresenceStatus = "online" | "away" | "busy" | "offline";

export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  status: PresenceStatus;
  lastSeen?: Date;
  currentFile?: string;
  cursorPosition?: { line: number; column: number };
  color?: string;
}

export interface PresenceIndicatorProps {
  /** Users currently present */
  users: PresenceUser[];
  /** Current user ID (to exclude from display) */
  currentUserId?: string;
  /** Maximum avatars to show */
  maxVisible?: number;
  /** Size of avatars */
  size?: "sm" | "md" | "lg";
  /** Whether to show status dots */
  showStatus?: boolean;
  /** Whether to show tooltip on hover */
  showTooltip?: boolean;
  /** Callback when user is clicked */
  onUserClick?: (user: PresenceUser) => void;
  /** Additional className */
  className?: string;
}

const statusColors: Record<PresenceStatus, string> = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  busy: "bg-red-500",
  offline: "bg-gray-400",
};

const sizeConfig = {
  sm: {
    avatar: "w-6 h-6 text-xs",
    status: "w-2 h-2",
    overlap: "-ml-2",
    ring: "ring-1",
  },
  md: {
    avatar: "w-8 h-8 text-sm",
    status: "w-2.5 h-2.5",
    overlap: "-ml-2.5",
    ring: "ring-2",
  },
  lg: {
    avatar: "w-10 h-10 text-base",
    status: "w-3 h-3",
    overlap: "-ml-3",
    ring: "ring-2",
  },
};

const defaultColors = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

interface AvatarProps {
  user: PresenceUser;
  size: "sm" | "md" | "lg";
  showStatus: boolean;
  isFirst: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  user,
  size,
  showStatus,
  isFirst,
  onClick,
}) => {
  const config = sizeConfig[size];
  const userColor =
    user.color || defaultColors[user.id.charCodeAt(0) % defaultColors.length];

  return (
    <div
      className={cn(
        "relative group",
        !isFirst && config.overlap,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={cn(
            config.avatar,
            config.ring,
            "rounded-full ring-background"
          )}
          style={{ boxShadow: `0 0 0 2px ${userColor}` }}
        />
      ) : (
        <div
          className={cn(
            config.avatar,
            config.ring,
            "rounded-full ring-background flex items-center justify-center font-medium text-white"
          )}
          style={{ backgroundColor: userColor }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Status dot */}
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            config.status,
            statusColors[user.status]
          )}
        />
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div className="font-medium">{user.name}</div>
        {user.currentFile && (
          <div className="text-muted-foreground">
            Editing: {user.currentFile}
          </div>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
      </div>
    </div>
  );
};

const PresenceIndicator = React.forwardRef<
  HTMLDivElement,
  PresenceIndicatorProps
>(
  (
    {
      users,
      currentUserId,
      maxVisible = 4,
      size = "md",
      showStatus = true,
      showTooltip: _showTooltip = true,
      onUserClick,
      className,
    },
    ref
  ) => {
    const filteredUsers = users.filter(
      (u) => u.id !== currentUserId && u.status !== "offline"
    );

    const visibleUsers = filteredUsers.slice(0, maxVisible);
    const overflowCount = filteredUsers.length - maxVisible;

    if (filteredUsers.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn("flex items-center", className)}>
        {visibleUsers.map((user, index) => (
          <Avatar
            key={user.id}
            user={user}
            size={size}
            showStatus={showStatus}
            isFirst={index === 0}
            onClick={onUserClick ? () => onUserClick(user) : undefined}
          />
        ))}

        {overflowCount > 0 && (
          <div
            className={cn(
              sizeConfig[size].avatar,
              sizeConfig[size].overlap,
              sizeConfig[size].ring,
              "rounded-full ring-background bg-muted flex items-center justify-center font-medium text-muted-foreground"
            )}
          >
            +{overflowCount}
          </div>
        )}
      </div>
    );
  }
);
PresenceIndicator.displayName = "PresenceIndicator";

// Cursor overlay component for collaborative editing
export interface CursorOverlayProps {
  users: PresenceUser[];
  currentUserId?: string;
  className?: string;
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({
  users,
  currentUserId,
  className,
}) => {
  const activeUsers = users.filter(
    (u) =>
      u.id !== currentUserId &&
      u.status === "online" &&
      u.cursorPosition !== undefined
  );

  return (
    <div className={cn("pointer-events-none", className)}>
      {activeUsers.map((user) => {
        const userColor =
          user.color ||
          defaultColors[user.id.charCodeAt(0) % defaultColors.length];

        return (
          <div
            key={user.id}
            className="absolute"
            style={{
              top: `${(user.cursorPosition!.line - 1) * 20}px`,
              left: `${user.cursorPosition!.column * 8}px`,
            }}
          >
            {/* Cursor line */}
            <div
              className="w-0.5 h-5"
              style={{ backgroundColor: userColor }}
            />
            {/* Name tag */}
            <div
              className="absolute -top-5 left-0 px-1.5 py-0.5 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: userColor }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { PresenceIndicator, CursorOverlay };
