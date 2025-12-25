"use client";

import * as React from "react";
import {
  History,
  ChevronRight,
  RotateCcw,
  Eye,
  GitBranch,
  GitCommit,
  Clock,
  FileText,
  Plus,
  Minus,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { formatDistanceToNow } from "date-fns";

export type ChangeType = "added" | "modified" | "deleted";

export interface VersionChange {
  path: string;
  type: ChangeType;
  additions?: number;
  deletions?: number;
}

export interface Version {
  id: string;
  number?: string;
  message?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  changes?: VersionChange[];
  isCurrent?: boolean;
  isAutoSave?: boolean;
}

export interface VersionHistoryProps {
  /** List of versions */
  versions: Version[];
  /** Currently selected version */
  selectedVersion?: string;
  /** Callback when version is selected */
  onSelectVersion?: (id: string) => void;
  /** Callback when version is restored */
  onRestoreVersion?: (id: string) => void;
  /** Callback when version is previewed */
  onPreviewVersion?: (id: string) => void;
  /** Callback when comparing versions */
  onCompareVersions?: (fromId: string, toId: string) => void;
  /** Whether to show detailed changes */
  showChanges?: boolean;
  /** Additional className */
  className?: string;
}

const changeTypeConfig: Record<
  ChangeType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  added: {
    icon: <Plus className="h-3 w-3" />,
    color: "text-green-600 dark:text-green-400",
    label: "Added",
  },
  modified: {
    icon: <Edit3 className="h-3 w-3" />,
    color: "text-yellow-600 dark:text-yellow-400",
    label: "Modified",
  },
  deleted: {
    icon: <Minus className="h-3 w-3" />,
    color: "text-red-600 dark:text-red-400",
    label: "Deleted",
  },
};

interface VersionItemProps {
  version: Version;
  isSelected: boolean;
  isCompareFrom: boolean;
  isCompareTo: boolean;
  showChanges: boolean;
  onSelect: () => void;
  onRestore?: () => void;
  onPreview?: () => void;
  onCompareSelect: () => void;
}

const VersionItem: React.FC<VersionItemProps> = ({
  version,
  isSelected,
  isCompareFrom,
  isCompareTo,
  showChanges,
  onSelect,
  onRestore,
  onPreview,
  onCompareSelect,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "relative border-l-2 pl-4 pb-6 ml-3",
        isSelected ? "border-primary" : "border-muted",
        version.isCurrent && "border-green-500"
      )}
    >
      {/* Timeline dot */}
      <div
        className={cn(
          "absolute -left-[9px] w-4 h-4 rounded-full border-2 bg-background",
          isSelected
            ? "border-primary bg-primary"
            : version.isCurrent
            ? "border-green-500"
            : "border-muted-foreground"
        )}
      >
        {version.isCurrent && (
          <div className="absolute inset-1 bg-green-500 rounded-full" />
        )}
      </div>

      <div
        className={cn(
          "group rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors",
          isSelected && "bg-muted/50 border-primary",
          isCompareFrom && "ring-2 ring-blue-500",
          isCompareTo && "ring-2 ring-orange-500"
        )}
        onClick={onSelect}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Author avatar */}
          {version.author.avatar ? (
            <img
              src={version.author.avatar}
              alt={version.author.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
              {version.author.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {version.author.name}
              </span>
              {version.isCurrent && (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                  Current
                </span>
              )}
              {version.isAutoSave && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  Auto-save
                </span>
              )}
            </div>
            {version.message && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {version.message}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(version.timestamp, { addSuffix: true })}
              </span>
              {version.number && (
                <span className="flex items-center gap-1">
                  <GitCommit className="h-3 w-3" />
                  v{version.number}
                </span>
              )}
              {version.changes && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {version.changes.length} change
                  {version.changes.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
            {onRestore && !version.isCurrent && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore();
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2",
                (isCompareFrom || isCompareTo) && "bg-muted"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onCompareSelect();
              }}
            >
              <GitBranch className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Changes */}
        {showChanges && version.changes && version.changes.length > 0 && (
          <div className="mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronRight
                className={cn(
                  "h-3 w-3 transition-transform",
                  expanded && "rotate-90"
                )}
              />
              {expanded ? "Hide" : "Show"} changes
            </button>

            {expanded && (
              <div className="mt-2 space-y-1">
                {version.changes.map((change, idx) => {
                  const config = changeTypeConfig[change.type];
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs py-1"
                    >
                      <span className={config.color}>{config.icon}</span>
                      <span className="truncate flex-1">{change.path}</span>
                      {(change.additions || change.deletions) && (
                        <span className="text-muted-foreground">
                          {change.additions && (
                            <span className="text-green-600 dark:text-green-400">
                              +{change.additions}
                            </span>
                          )}
                          {change.additions && change.deletions && " "}
                          {change.deletions && (
                            <span className="text-red-600 dark:text-red-400">
                              -{change.deletions}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const VersionHistory = React.forwardRef<HTMLDivElement, VersionHistoryProps>(
  (
    {
      versions,
      selectedVersion,
      onSelectVersion,
      onRestoreVersion,
      onPreviewVersion,
      onCompareVersions,
      showChanges = true,
      className,
    },
    ref
  ) => {
    const [compareFrom, setCompareFrom] = React.useState<string | null>(null);
    const [compareTo, setCompareTo] = React.useState<string | null>(null);

    const handleCompareSelect = (id: string) => {
      if (!compareFrom) {
        setCompareFrom(id);
      } else if (compareFrom === id) {
        setCompareFrom(null);
        setCompareTo(null);
      } else if (!compareTo) {
        setCompareTo(id);
      } else if (compareTo === id) {
        setCompareTo(null);
      } else {
        setCompareFrom(id);
        setCompareTo(null);
      }
    };

    const handleCompare = () => {
      if (compareFrom && compareTo) {
        onCompareVersions?.(compareFrom, compareTo);
      }
    };

    const clearCompare = () => {
      setCompareFrom(null);
      setCompareTo(null);
    };

    return (
      <div ref={ref} className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="font-medium text-sm">Version History</span>
            <span className="text-xs text-muted-foreground">
              ({versions.length})
            </span>
          </div>
        </div>

        {/* Compare bar */}
        {(compareFrom || compareTo) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b text-sm">
            <GitBranch className="h-4 w-4" />
            <span>
              {compareFrom && !compareTo
                ? "Select another version to compare"
                : "Comparing versions"}
            </span>
            {compareFrom && compareTo && (
              <Button size="sm" className="ml-auto" onClick={handleCompare}>
                Compare
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Cancel
            </Button>
          </div>
        )}

        {/* Versions list */}
        <div className="flex-1 overflow-auto p-4">
          {versions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No version history
            </div>
          ) : (
            <div className="space-y-0">
              {versions.map((version) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  isSelected={selectedVersion === version.id}
                  isCompareFrom={compareFrom === version.id}
                  isCompareTo={compareTo === version.id}
                  showChanges={showChanges}
                  onSelect={() => onSelectVersion?.(version.id)}
                  onRestore={() => onRestoreVersion?.(version.id)}
                  onPreview={() => onPreviewVersion?.(version.id)}
                  onCompareSelect={() => handleCompareSelect(version.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
VersionHistory.displayName = "VersionHistory";

export { VersionHistory };
