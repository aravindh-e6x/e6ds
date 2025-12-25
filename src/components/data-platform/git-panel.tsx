"use client";

import * as React from "react";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Plus,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  FilePlus,
  FileMinus,
  FileEdit,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export type FileChangeType = "added" | "modified" | "deleted" | "renamed";

export interface FileChange {
  path: string;
  type: FileChangeType;
  staged: boolean;
  additions?: number;
  deletions?: number;
}

export interface GitCommitInfo {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  authorEmail?: string;
  date: Date;
  branch?: string;
}

export interface GitBranch {
  name: string;
  isRemote: boolean;
  isCurrent: boolean;
  ahead?: number;
  behind?: number;
  lastCommit?: GitCommitInfo;
}

export interface GitPanelProps {
  /** Current branch name */
  currentBranch: string;
  /** List of branches */
  branches: GitBranch[];
  /** Uncommitted changes */
  changes: FileChange[];
  /** Recent commits */
  commits: GitCommitInfo[];
  /** Whether there are conflicts */
  hasConflicts?: boolean;
  /** Callback when branch is changed */
  onBranchChange?: (branch: string) => void;
  /** Callback when new branch is created */
  onCreateBranch?: (name: string) => void;
  /** Callback when file is staged */
  onStageFile?: (path: string) => void;
  /** Callback when file is unstaged */
  onUnstageFile?: (path: string) => void;
  /** Callback when all files are staged */
  onStageAll?: () => void;
  /** Callback when commit is made */
  onCommit?: (message: string) => void;
  /** Callback when push is clicked */
  onPush?: () => void;
  /** Callback when pull is clicked */
  onPull?: () => void;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Callback when file is clicked */
  onFileClick?: (path: string) => void;
  /** Callback when commit is clicked */
  onCommitClick?: (hash: string) => void;
  /** Additional className */
  className?: string;
}

const fileChangeIcons: Record<FileChangeType, React.ReactNode> = {
  added: <FilePlus className="h-4 w-4 text-green-600 dark:text-green-400" />,
  modified: <FileEdit className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  deleted: <FileMinus className="h-4 w-4 text-red-600 dark:text-red-400" />,
  renamed: <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
};

const GitPanel = React.forwardRef<HTMLDivElement, GitPanelProps>(
  (
    {
      currentBranch,
      branches,
      changes,
      commits,
      hasConflicts = false,
      onBranchChange,
      onCreateBranch,
      onStageFile,
      onUnstageFile,
      onStageAll,
      onCommit,
      onPush,
      onPull,
      onRefresh,
      onFileClick,
      onCommitClick,
      className,
    },
    ref
  ) => {
    const [commitMessage, setCommitMessage] = React.useState("");
    const [newBranchName, setNewBranchName] = React.useState("");
    const [showNewBranch, setShowNewBranch] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<"changes" | "history">("changes");

    const stagedChanges = changes.filter((c) => c.staged);
    const unstagedChanges = changes.filter((c) => !c.staged);

    const currentBranchInfo = branches.find((b) => b.isCurrent);

    const handleCommit = () => {
      if (commitMessage.trim() && onCommit) {
        onCommit(commitMessage);
        setCommitMessage("");
      }
    };

    const handleCreateBranch = () => {
      if (newBranchName.trim() && onCreateBranch) {
        onCreateBranch(newBranchName);
        setNewBranchName("");
        setShowNewBranch(false);
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-card border", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Source Control</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onRefresh} className="h-7 w-7 p-0">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Branch selector */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span className="truncate">{currentBranch}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5">
                  <Input
                    placeholder="Search branches..."
                    className="h-7 text-xs"
                  />
                </div>
                <DropdownMenuSeparator />
                {branches.filter((b) => !b.isRemote).map((branch) => (
                  <DropdownMenuItem
                    key={branch.name}
                    onClick={() => onBranchChange?.(branch.name)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {branch.isCurrent && <Check className="h-3.5 w-3.5" />}
                      {!branch.isCurrent && <div className="w-3.5" />}
                      <span className="truncate">{branch.name}</span>
                    </div>
                    {(branch.ahead || branch.behind) && (
                      <span className="text-xs text-muted-foreground">
                        {branch.ahead ? `↑${branch.ahead}` : ""}
                        {branch.behind ? `↓${branch.behind}` : ""}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowNewBranch(true)}>
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Create new branch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={onPull} className="h-8">
              <GitMerge className="h-3.5 w-3.5 mr-1" />
              Pull
            </Button>
            <Button variant="outline" size="sm" onClick={onPush} className="h-8">
              <GitPullRequest className="h-3.5 w-3.5 mr-1" />
              Push
            </Button>
          </div>

          {showNewBranch && (
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="Branch name"
                className="h-7 text-xs"
              />
              <Button size="sm" onClick={handleCreateBranch} className="h-7">
                Create
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewBranch(false)}
                className="h-7 w-7 p-0"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {currentBranchInfo && (currentBranchInfo.ahead || currentBranchInfo.behind) && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              {currentBranchInfo.ahead && (
                <span className="text-green-600 dark:text-green-400">↑ {currentBranchInfo.ahead} ahead</span>
              )}
              {currentBranchInfo.behind && (
                <span className="text-orange-600 dark:text-orange-400">↓ {currentBranchInfo.behind} behind</span>
              )}
            </div>
          )}
        </div>

        {/* Conflicts warning */}
        {hasConflicts && (
          <div className="px-3 py-2 bg-destructive/10 border-b flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Merge conflicts detected</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "changes"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("changes")}
          >
            Changes
            {changes.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {changes.length}
              </Badge>
            )}
          </button>
          <button
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "history"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "changes" ? (
            <div className="p-3 space-y-4">
              {/* Commit message */}
              <div className="space-y-2">
                <Input
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Commit message"
                  className="text-sm"
                />
                <Button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || stagedChanges.length === 0}
                  className="w-full"
                  size="sm"
                >
                  <GitCommit className="h-3.5 w-3.5 mr-2" />
                  Commit ({stagedChanges.length} file{stagedChanges.length !== 1 ? "s" : ""})
                </Button>
              </div>

              {/* Staged changes */}
              {stagedChanges.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      Staged Changes
                    </span>
                    <span className="text-xs text-muted-foreground">{stagedChanges.length}</span>
                  </div>
                  <div className="space-y-1">
                    {stagedChanges.map((change) => (
                      <div
                        key={change.path}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50 cursor-pointer group"
                        onClick={() => onFileClick?.(change.path)}
                      >
                        {fileChangeIcons[change.type]}
                        <span className="flex-1 text-sm truncate">{change.path}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnstageFile?.(change.path);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unstaged changes */}
              {unstagedChanges.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      Changes
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={onStageAll}
                    >
                      Stage All
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {unstagedChanges.map((change) => (
                      <div
                        key={change.path}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50 cursor-pointer group"
                        onClick={() => onFileClick?.(change.path)}
                      >
                        {fileChangeIcons[change.type]}
                        <span className="flex-1 text-sm truncate">{change.path}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStageFile?.(change.path);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {changes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No changes to commit
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {commits.map((commit) => (
                <div
                  key={commit.hash}
                  className="px-3 py-2 hover:bg-muted/50 cursor-pointer"
                  onClick={() => onCommitClick?.(commit.hash)}
                >
                  <div className="flex items-start gap-2">
                    <GitCommit className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{commit.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">{commit.shortHash}</span>
                        <span>•</span>
                        <span>{commit.author}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(commit.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
GitPanel.displayName = "GitPanel";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export { GitPanel };
