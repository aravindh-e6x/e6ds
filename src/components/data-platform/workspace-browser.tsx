"use client";

import * as React from "react";
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  Table,
  Database,
  Notebook,
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit,
  Download,
  Upload,
  ChevronRight,
  Star,
  Lock,
  Users,
  Globe,
  Home,
  ArrowLeft,
  Grid,
  List,
  SortAsc,
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

export type WorkspaceItemType = "folder" | "notebook" | "file" | "dashboard" | "query" | "table" | "library";
export type Permission = "private" | "shared" | "public";

export interface WorkspaceItem {
  id: string;
  name: string;
  type: WorkspaceItemType;
  path: string;
  permission: Permission;
  createdAt: Date;
  modifiedAt: Date;
  createdBy?: string;
  size?: number;
  starred?: boolean;
  children?: WorkspaceItem[];
  language?: string;
  description?: string;
}

export interface WorkspaceBrowserProps {
  /** Root items in the workspace */
  items: WorkspaceItem[];
  /** Current path */
  currentPath?: string;
  /** Currently selected item ID */
  selectedItemId?: string;
  /** View mode */
  viewMode?: "list" | "grid";
  /** Callback when item is selected */
  onItemSelect?: (item: WorkspaceItem) => void;
  /** Callback when item is opened */
  onItemOpen?: (item: WorkspaceItem) => void;
  /** Callback when path changes */
  onPathChange?: (path: string) => void;
  /** Callback when item is created */
  onItemCreate?: (type: WorkspaceItemType, path: string) => void;
  /** Callback when item is deleted */
  onItemDelete?: (itemId: string) => void;
  /** Callback when item is renamed */
  onItemRename?: (itemId: string, newName: string) => void;
  /** Callback when item is moved */
  onItemMove?: (itemId: string, newPath: string) => void;
  /** Callback when item is starred */
  onItemStar?: (itemId: string) => void;
  /** Additional className */
  className?: string;
}

const typeIcons: Record<WorkspaceItemType, React.ReactNode> = {
  folder: <Folder className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  notebook: <Notebook className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  file: <File className="h-4 w-4 text-gray-600 dark:text-gray-400" />,
  dashboard: <Grid className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  query: <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  table: <Table className="h-4 w-4 text-green-600 dark:text-green-400" />,
  library: <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
};

const permissionIcons: Record<Permission, React.ReactNode> = {
  private: <Lock className="h-3 w-3" />,
  shared: <Users className="h-3 w-3" />,
  public: <Globe className="h-3 w-3" />,
};

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

const WorkspaceBrowser = React.forwardRef<HTMLDivElement, WorkspaceBrowserProps>(
  (
    {
      items,
      currentPath = "/",
      selectedItemId,
      viewMode = "list",
      onItemSelect,
      onItemOpen,
      onPathChange,
      onItemCreate,
      onItemDelete,
      onItemStar,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [view, setView] = React.useState<"list" | "grid">(viewMode);
    const [sortBy, setSortBy] = React.useState<"name" | "modified" | "type">("name");

    // Get items at current path
    const getCurrentItems = (items: WorkspaceItem[], path: string): WorkspaceItem[] => {
      if (path === "/") return items;
      const parts = path.split("/").filter(Boolean);
      let current = items;
      for (const part of parts) {
        const folder = current.find((i) => i.name === part && i.type === "folder");
        if (folder?.children) {
          current = folder.children;
        } else {
          return [];
        }
      }
      return current;
    };

    const currentItems = getCurrentItems(items, currentPath);

    const filteredItems = currentItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
      // Folders first
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "modified":
          return b.modifiedAt.getTime() - a.modifiedAt.getTime();
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    const pathParts = currentPath.split("/").filter(Boolean);

    const handleItemDoubleClick = (item: WorkspaceItem) => {
      if (item.type === "folder") {
        onPathChange?.(`${currentPath}${currentPath.endsWith("/") ? "" : "/"}${item.name}`);
      } else {
        onItemOpen?.(item);
      }
    };

    const goBack = () => {
      const newPath = "/" + pathParts.slice(0, -1).join("/");
      onPathChange?.(newPath || "/");
    };

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-background", className)}>
        {/* Header */}
        <div className="px-4 py-3 border-b bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Workspace</h2>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onItemCreate?.("folder", currentPath)}>
                    <Folder className="h-4 w-4 mr-2 text-yellow-600" />
                    Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onItemCreate?.("notebook", currentPath)}>
                    <Notebook className="h-4 w-4 mr-2 text-orange-600" />
                    Notebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onItemCreate?.("query", currentPath)}>
                    <FileCode className="h-4 w-4 mr-2 text-purple-600" />
                    SQL Query
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onItemCreate?.("dashboard", currentPath)}>
                    <Grid className="h-4 w-4 mr-2 text-blue-600" />
                    Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm mb-3">
            <button
              onClick={() => onPathChange?.("/")}
              className="flex items-center gap-1 hover:text-primary"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </button>
            {pathParts.map((part, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <button
                  onClick={() => onPathChange?.("/" + pathParts.slice(0, i + 1).join("/"))}
                  className="hover:text-primary"
                >
                  {part}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3">
            {currentPath !== "/" && (
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 h-8 text-sm"
              />
            </div>

            <div className="flex items-center gap-1 border rounded-lg p-0.5">
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setView("list")}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setView("grid")}
              >
                <Grid className="h-3.5 w-3.5" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-3.5 w-3.5 mr-1" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name {sortBy === "name" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("modified")}>
                  Modified {sortBy === "modified" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("type")}>
                  Type {sortBy === "type" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Folder className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">This folder is empty</p>
              <p className="text-sm">Create a new item or import files</p>
            </div>
          ) : view === "list" ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Name</th>
                    <th className="text-left px-3 py-2 font-medium">Type</th>
                    <th className="text-left px-3 py-2 font-medium">Modified</th>
                    <th className="text-left px-3 py-2 font-medium">Owner</th>
                    <th className="text-left px-3 py-2 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedItems.map((item) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "hover:bg-muted/30 cursor-pointer",
                        item.id === selectedItemId && "bg-muted"
                      )}
                      onClick={() => onItemSelect?.(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {item.type === "folder" && item.children ? (
                            <FolderOpen className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            typeIcons[item.type]
                          )}
                          <span className="font-medium">{item.name}</span>
                          {item.starred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                          <span className="text-muted-foreground">
                            {permissionIcons[item.permission]}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 capitalize text-muted-foreground">{item.type}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {formatRelativeTime(item.modifiedAt)}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{item.createdBy || "-"}</td>
                      <td className="px-3 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onItemOpen?.(item)}>
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onItemStar?.(item.id)}>
                              <Star className="h-3.5 w-3.5 mr-2" />
                              {item.starred ? "Unstar" : "Star"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-3.5 w-3.5 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-3.5 w-3.5 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-3.5 w-3.5 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onItemDelete?.(item.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors",
                    item.id === selectedItemId && "border-primary ring-2 ring-primary/20"
                  )}
                  onClick={() => onItemSelect?.(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      {item.type === "folder" ? (
                        <Folder className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                      ) : item.type === "notebook" ? (
                        <Notebook className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      ) : item.type === "query" ? (
                        <FileCode className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <File className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    {item.starred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <h4 className="font-medium text-sm truncate mb-1">{item.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{item.type}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.modifiedAt)}</span>
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
WorkspaceBrowser.displayName = "WorkspaceBrowser";

export { WorkspaceBrowser };
