"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileCode,
  Database,
  Table,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
  Edit,
  Download,
  Star,
  StarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type FileType =
  | "folder"
  | "notebook"
  | "sql"
  | "python"
  | "file"
  | "table"
  | "database";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  children?: FileNode[];
  path?: string;
  isFavorite?: boolean;
  lastModified?: Date;
  size?: number;
  icon?: React.ReactNode;
}

export interface FileExplorerProps {
  /** Root nodes of the file tree */
  nodes: FileNode[];
  /** Currently selected node ID */
  selectedId?: string;
  /** Callback when a node is selected */
  onSelect?: (node: FileNode) => void;
  /** Callback when a node is double-clicked (open) */
  onOpen?: (node: FileNode) => void;
  /** Callback when a node is renamed */
  onRename?: (node: FileNode, newName: string) => void;
  /** Callback when a node is deleted */
  onDelete?: (node: FileNode) => void;
  /** Callback when a node is copied */
  onCopy?: (node: FileNode) => void;
  /** Callback when a new file/folder is created */
  onCreate?: (parentNode: FileNode | null, type: FileType) => void;
  /** Callback when favorite status changes */
  onFavoriteToggle?: (node: FileNode) => void;
  /** Callback when a node is downloaded */
  onDownload?: (node: FileNode) => void;
  /** Expanded node IDs (controlled) */
  expandedIds?: string[];
  /** Callback when expanded state changes */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Whether to show the context menu */
  showContextMenu?: boolean;
  /** Additional className */
  className?: string;
}

const fileTypeIcons: Record<FileType, React.ElementType> = {
  folder: Folder,
  notebook: FileCode,
  sql: Database,
  python: FileCode,
  file: File,
  table: Table,
  database: Database,
};

const fileTypeColors: Record<FileType, string> = {
  folder: "text-yellow-600 dark:text-yellow-400",
  notebook: "text-orange-600 dark:text-orange-400",
  sql: "text-blue-600 dark:text-blue-400",
  python: "text-green-600 dark:text-green-400",
  file: "text-muted-foreground",
  table: "text-purple-600 dark:text-purple-400",
  database: "text-blue-600 dark:text-blue-400",
};

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  selectedId?: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelect?: (node: FileNode) => void;
  onOpen?: (node: FileNode) => void;
  onRename?: (node: FileNode, newName: string) => void;
  onDelete?: (node: FileNode) => void;
  onCopy?: (node: FileNode) => void;
  onCreate?: (parentNode: FileNode | null, type: FileType) => void;
  onFavoriteToggle?: (node: FileNode) => void;
  onDownload?: (node: FileNode) => void;
  showContextMenu: boolean;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  depth,
  selectedId,
  expandedIds,
  onToggleExpand,
  onSelect,
  onOpen,
  onRename,
  onDelete,
  onCopy,
  onCreate,
  onFavoriteToggle,
  onDownload,
  showContextMenu,
}) => {
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(node.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === "folder" || node.type === "database";

  const IconComponent = node.icon ? null : fileTypeIcons[node.type];
  const iconColor = fileTypeColors[node.type];

  React.useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder && hasChildren) {
      onToggleExpand(node.id);
    }
    onSelect?.(node);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFolder) {
      onOpen?.(node);
    }
  };

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== node.name) {
      onRename?.(node, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setRenameValue(node.name);
      setIsRenaming(false);
    }
  };

  const contextMenuContent = (
    <DropdownMenuContent align="start" className="w-48">
      {isFolder && (
        <>
          <DropdownMenuItem onClick={() => onCreate?.(node, "folder")}>
            <Folder className="mr-2 h-4 w-4" />
            New Folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCreate?.(node, "notebook")}>
            <FileCode className="mr-2 h-4 w-4" />
            New Notebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCreate?.(node, "sql")}>
            <Database className="mr-2 h-4 w-4" />
            New SQL File
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem onClick={() => setIsRenaming(true)}>
        <Edit className="mr-2 h-4 w-4" />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onCopy?.(node)}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onFavoriteToggle?.(node)}>
        {node.isFavorite ? (
          <>
            <StarOff className="mr-2 h-4 w-4" />
            Remove from Favorites
          </>
        ) : (
          <>
            <Star className="mr-2 h-4 w-4" />
            Add to Favorites
          </>
        )}
      </DropdownMenuItem>
      {!isFolder && (
        <DropdownMenuItem onClick={() => onDownload?.(node)}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => onDelete?.(node)}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-accent",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Expand/collapse arrow */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {isFolder && hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : null}
        </span>

        {/* Icon */}
        <span className={cn("h-4 w-4 shrink-0", iconColor)}>
          {node.icon ? (
            node.icon
          ) : isFolder && isExpanded ? (
            <FolderOpen className="h-4 w-4" />
          ) : IconComponent ? (
            <IconComponent className="h-4 w-4" />
          ) : null}
        </span>

        {/* Name */}
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleRenameKeyDown}
            className="flex-1 bg-background border px-1 text-sm outline-none focus:ring-1 focus:ring-ring"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm truncate">{node.name}</span>
        )}

        {/* Favorite indicator */}
        {node.isFavorite && (
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
        )}

        {/* Context menu */}
        {showContextMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            {contextMenuContent}
          </DropdownMenu>
        )}
      </div>

      {/* Children */}
      {isFolder && isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onOpen={onOpen}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onCreate={onCreate}
              onFavoriteToggle={onFavoriteToggle}
              onDownload={onDownload}
              showContextMenu={showContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = React.forwardRef<HTMLDivElement, FileExplorerProps>(
  (
    {
      nodes,
      selectedId,
      onSelect,
      onOpen,
      onRename,
      onDelete,
      onCopy,
      onCreate,
      onFavoriteToggle,
      onDownload,
      expandedIds: controlledExpandedIds,
      onExpandedChange,
      showContextMenu = true,
      className,
    },
    ref
  ) => {
    const [internalExpandedIds, setInternalExpandedIds] = React.useState<
      Set<string>
    >(new Set());

    const isControlled = controlledExpandedIds !== undefined;
    const expandedIds = isControlled
      ? new Set(controlledExpandedIds)
      : internalExpandedIds;

    const handleToggleExpand = (id: string) => {
      const newExpanded = new Set(expandedIds);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }

      if (isControlled) {
        onExpandedChange?.(Array.from(newExpanded));
      } else {
        setInternalExpandedIds(newExpanded);
      }
    };

    return (
      <div ref={ref} className={cn("select-none", className)}>
        {/* Header with actions */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="text-sm font-medium">Files</span>
          {onCreate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-accent rounded">
                  <Plus className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCreate(null, "folder")}>
                  <Folder className="mr-2 h-4 w-4" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreate(null, "notebook")}>
                  <FileCode className="mr-2 h-4 w-4" />
                  New Notebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreate(null, "sql")}>
                  <Database className="mr-2 h-4 w-4" />
                  New SQL File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* File tree */}
        <div className="py-1">
          {nodes.map((node) => (
            <FileTreeNode
              key={node.id}
              node={node}
              depth={0}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
              onSelect={onSelect}
              onOpen={onOpen}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onCreate={onCreate}
              onFavoriteToggle={onFavoriteToggle}
              onDownload={onDownload}
              showContextMenu={showContextMenu}
            />
          ))}
        </div>
      </div>
    );
  }
);
FileExplorer.displayName = "FileExplorer";

export { FileExplorer };
