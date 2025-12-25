"use client";

import * as React from "react";
import {
  Share2,
  Copy,
  Check,
  X,
  Link2,
  Mail,
  Users,
  Globe,
  Lock,
  ChevronDown,
  Trash2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type Permission = "view" | "edit" | "admin";

export type Visibility = "private" | "team" | "organization" | "public";

export interface ShareUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: Permission;
}

export interface ShareDialogProps {
  /** Title of the item being shared */
  title: string;
  /** Type of item */
  itemType?: string;
  /** Current visibility */
  visibility?: Visibility;
  /** Callback when visibility changes */
  onVisibilityChange?: (visibility: Visibility) => void;
  /** Users with access */
  sharedWith?: ShareUser[];
  /** Callback when user is added */
  onAddUser?: (email: string, permission: Permission) => void;
  /** Callback when user permission is changed */
  onChangePermission?: (userId: string, permission: Permission) => void;
  /** Callback when user is removed */
  onRemoveUser?: (userId: string) => void;
  /** Shareable link */
  shareLink?: string;
  /** Callback when link is copied */
  onCopyLink?: () => void;
  /** Available users to invite */
  availableUsers?: ShareUser[];
  /** Whether dialog is open */
  open?: boolean;
  /** Callback when dialog closes */
  onClose?: () => void;
  /** Additional className */
  className?: string;
}

const visibilityOptions: {
  value: Visibility;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "private",
    label: "Private",
    description: "Only people added can access",
    icon: <Lock className="h-4 w-4" />,
  },
  {
    value: "team",
    label: "Team",
    description: "Anyone in your team can access",
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: "organization",
    label: "Organization",
    description: "Anyone in your organization can access",
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: "public",
    label: "Public",
    description: "Anyone with the link can access",
    icon: <Globe className="h-4 w-4" />,
  },
];

const permissionLabels: Record<Permission, string> = {
  view: "Can view",
  edit: "Can edit",
  admin: "Admin",
};

const ShareDialog = React.forwardRef<HTMLDivElement, ShareDialogProps>(
  (
    {
      title,
      itemType: _itemType = "item",
      visibility = "private",
      onVisibilityChange,
      sharedWith = [],
      onAddUser,
      onChangePermission,
      onRemoveUser,
      shareLink,
      onCopyLink,
      availableUsers = [],
      open = true,
      onClose,
      className,
    },
    ref
  ) => {
    const [email, setEmail] = React.useState("");
    const [permission, setPermission] = React.useState<Permission>("view");
    const [copied, setCopied] = React.useState(false);
    const [showUserSearch, setShowUserSearch] = React.useState(false);

    const handleCopyLink = () => {
      if (shareLink) {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        onCopyLink?.();
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleAddUser = () => {
      if (email.trim()) {
        onAddUser?.(email, permission);
        setEmail("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddUser();
      }
    };

    const filteredUsers = availableUsers.filter(
      (u) =>
        !sharedWith.find((s) => s.id === u.id) &&
        (u.name.toLowerCase().includes(email.toLowerCase()) ||
          u.email.toLowerCase().includes(email.toLowerCase()))
    );

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          ref={ref}
          className={cn(
            "bg-background rounded-lg shadow-lg w-full max-w-md",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="font-medium">Share "{title}"</span>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Visibility */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Who can access</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {visibilityOptions.find((v) => v.value === visibility)?.icon}
                      <span>
                        {visibilityOptions.find((v) => v.value === visibility)?.label}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  {visibilityOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onVisibilityChange?.(option.value)}
                      className="flex items-start gap-3 py-2"
                    >
                      <span className="mt-0.5">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                      {visibility === option.value && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add people */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Add people</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowUserSearch(e.target.value.length > 0);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowUserSearch(email.length > 0)}
                    onBlur={() => setTimeout(() => setShowUserSearch(false), 200)}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* User search results */}
                  {showUserSearch && filteredUsers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setEmail(user.email);
                            setShowUserSearch(false);
                          }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div>{user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {permissionLabels[permission]}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(Object.keys(permissionLabels) as Permission[]).map((p) => (
                      <DropdownMenuItem key={p} onClick={() => setPermission(p)}>
                        {permissionLabels[p]}
                        {permission === p && <Check className="h-4 w-4 ml-2" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" onClick={handleAddUser} disabled={!email.trim()}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Shared with list */}
            {sharedWith.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Shared with ({sharedWith.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {sharedWith.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-md group"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7">
                            {permissionLabels[user.permission]}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(Object.keys(permissionLabels) as Permission[]).map(
                            (p) => (
                              <DropdownMenuItem
                                key={p}
                                onClick={() => onChangePermission?.(user.id, p)}
                              >
                                {permissionLabels[p]}
                                {user.permission === p && (
                                  <Check className="h-4 w-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 opacity-0 group-hover:opacity-100"
                        onClick={() => onRemoveUser?.(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share link */}
            {shareLink && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Share link</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 text-sm bg-muted rounded-md truncate">
                    <Link2 className="inline h-4 w-4 mr-2 text-muted-foreground" />
                    {shareLink}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-4 py-3 border-t">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    );
  }
);
ShareDialog.displayName = "ShareDialog";

export { ShareDialog };
