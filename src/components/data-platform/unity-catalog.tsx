"use client";

import * as React from "react";
import {
  Database,
  Table,
  Folder,
  FolderOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
  Key,
  FileCode,
  Box,
  Layers,
  RefreshCw,
  Filter,
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

export type CatalogObjectType = "catalog" | "schema" | "table" | "view" | "function" | "model" | "volume";
export type TableType = "MANAGED" | "EXTERNAL" | "VIEW";
export type DataSourceFormat = "DELTA" | "PARQUET" | "CSV" | "JSON" | "AVRO" | "ORC";

export interface CatalogColumn {
  name: string;
  type: string;
  nullable: boolean;
  comment?: string;
  partitionIndex?: number;
}

export interface CatalogObject {
  id: string;
  name: string;
  type: CatalogObjectType;
  fullName: string;
  owner?: string;
  createdAt: Date;
  updatedAt: Date;
  comment?: string;
  children?: CatalogObject[];
  // Table-specific
  tableType?: TableType;
  dataSourceFormat?: DataSourceFormat;
  storageLocation?: string;
  columns?: CatalogColumn[];
  properties?: Record<string, string>;
}

export interface PermissionGrant {
  principal: string;
  principalType: "user" | "group" | "service_principal";
  privileges: string[];
}

export interface UnityCatalogProps {
  /** Root catalogs */
  catalogs: CatalogObject[];
  /** Currently selected object ID */
  selectedObjectId?: string;
  /** Callback when object is selected */
  onObjectSelect?: (object: CatalogObject | null) => void;
  /** Callback when object is previewed */
  onObjectPreview?: (objectId: string) => void;
  /** Callback when object is created */
  onObjectCreate?: (type: CatalogObjectType, parentId?: string) => void;
  /** Callback when object is deleted */
  onObjectDelete?: (objectId: string) => void;
  /** Callback when permissions are edited */
  onEditPermissions?: (objectId: string) => void;
  /** Additional className */
  className?: string;
}

const typeIcons: Record<CatalogObjectType, React.ReactNode> = {
  catalog: <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  schema: <Folder className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  table: <Table className="h-4 w-4 text-green-600 dark:text-green-400" />,
  view: <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  function: <FileCode className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  model: <Box className="h-4 w-4 text-pink-600 dark:text-pink-400" />,
  volume: <Layers className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
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

const UnityCatalog = React.forwardRef<HTMLDivElement, UnityCatalogProps>(
  (
    {
      catalogs,
      selectedObjectId,
      onObjectSelect,
      onObjectPreview,
      onObjectCreate,
      onObjectDelete,
      onEditPermissions,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());
    const [filterType, setFilterType] = React.useState<CatalogObjectType | "all">("all");

    const findObject = (objects: CatalogObject[], id: string): CatalogObject | undefined => {
      for (const obj of objects) {
        if (obj.id === id) return obj;
        if (obj.children) {
          const found = findObject(obj.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const selectedObject = selectedObjectId ? findObject(catalogs, selectedObjectId) : undefined;

    const toggleNode = (id: string) => {
      const next = new Set(expandedNodes);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setExpandedNodes(next);
    };

    const countObjects = (objects: CatalogObject[]): number => {
      return objects.reduce((acc, obj) => {
        return acc + 1 + (obj.children ? countObjects(obj.children) : 0);
      }, 0);
    };

    const renderTreeNode = (object: CatalogObject, depth: number = 0) => {
      const hasChildren = object.children && object.children.length > 0;
      const isExpanded = expandedNodes.has(object.id);
      const isSelected = object.id === selectedObjectId;

      // Filter by search
      const matchesSearch =
        searchQuery === "" ||
        object.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        object.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by type
      const matchesType = filterType === "all" || object.type === filterType;

      if (!matchesSearch && !matchesType) {
        // Check if any children match
        const hasMatchingChildren = object.children?.some((child) => {
          const childMatchesSearch = child.name.toLowerCase().includes(searchQuery.toLowerCase());
          const childMatchesType = (filterType as string) === "all" || child.type === filterType;
          return childMatchesSearch || childMatchesType;
        });
        if (!hasMatchingChildren) return null;
      }

      return (
        <div key={object.id}>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-muted/50 rounded-sm",
              isSelected && "bg-muted"
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => onObjectSelect?.(object)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(object.id);
                }}
                className="p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
            {object.type === "schema" && isExpanded ? (
              <FolderOpen className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            ) : (
              typeIcons[object.type]
            )}
            <span className="text-sm truncate flex-1">{object.name}</span>
            {object.tableType && (
              <Badge variant="outline" className="text-xs h-5">
                {object.tableType}
              </Badge>
            )}
          </div>
          {hasChildren && isExpanded && (
            <div>
              {object.children!.map((child) => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn("flex h-full bg-background", className)}>
        {/* Tree panel */}
        <div className="w-80 border-r flex flex-col">
          <div className="px-3 py-2 border-b bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Unity Catalog</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onObjectCreate?.("catalog")}>
                    <Database className="h-4 w-4 mr-2 text-blue-600" />
                    Catalog
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onObjectCreate?.("schema", selectedObjectId)}>
                    <Folder className="h-4 w-4 mr-2 text-yellow-600" />
                    Schema
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onObjectCreate?.("table", selectedObjectId)}>
                    <Table className="h-4 w-4 mr-2 text-green-600" />
                    Table
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onObjectCreate?.("view", selectedObjectId)}>
                    <Eye className="h-4 w-4 mr-2 text-purple-600" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onObjectCreate?.("function", selectedObjectId)}>
                    <FileCode className="h-4 w-4 mr-2 text-orange-600" />
                    Function
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="pl-8 h-8 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    {filterType === "all" ? "All Types" : filterType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {(["catalog", "schema", "table", "view", "function", "model"] as const).map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                      {typeIcons[type]}
                      <span className="ml-2 capitalize">{type}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-xs text-muted-foreground">
                {countObjects(catalogs)} objects
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-auto py-1">
            {catalogs.map((catalog) => renderTreeNode(catalog))}
          </div>
        </div>

        {/* Details panel */}
        <div className="flex-1 flex flex-col">
          {selectedObject ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {typeIcons[selectedObject.type]}
                    <div>
                      <h2 className="font-semibold">{selectedObject.name}</h2>
                      <p className="text-xs text-muted-foreground font-mono">
                        {selectedObject.fullName}
                      </p>
                    </div>
                    {selectedObject.tableType && (
                      <Badge variant="outline">{selectedObject.tableType}</Badge>
                    )}
                    {selectedObject.dataSourceFormat && (
                      <Badge variant="secondary">{selectedObject.dataSourceFormat}</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(selectedObject.type === "table" || selectedObject.type === "view") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onObjectPreview?.(selectedObject.id)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPermissions?.(selectedObject.id)}
                    >
                      <Key className="h-3.5 w-3.5 mr-1" />
                      Permissions
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Copy Name
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="h-3.5 w-3.5 mr-2" />
                          Refresh
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onObjectDelete?.(selectedObject.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {selectedObject.owner && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {selectedObject.owner}
                    </span>
                  )}
                  <span>Updated {formatRelativeTime(selectedObject.updatedAt)}</span>
                </div>

                {selectedObject.comment && (
                  <p className="text-sm text-muted-foreground mt-2">{selectedObject.comment}</p>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Storage location */}
                {selectedObject.storageLocation && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Storage Location</h3>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs truncate">
                        {selectedObject.storageLocation}
                      </span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Columns / Schema */}
                {selectedObject.columns && selectedObject.columns.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Schema ({selectedObject.columns.length} columns)
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium">Column</th>
                            <th className="text-left px-3 py-2 font-medium">Type</th>
                            <th className="text-left px-3 py-2 font-medium">Nullable</th>
                            <th className="text-left px-3 py-2 font-medium">Partition</th>
                            <th className="text-left px-3 py-2 font-medium">Comment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedObject.columns.map((col) => (
                            <tr key={col.name} className="hover:bg-muted/30">
                              <td className="px-3 py-2 font-mono text-xs">{col.name}</td>
                              <td className="px-3 py-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {col.type}
                                </Badge>
                              </td>
                              <td className="px-3 py-2">{col.nullable ? "Yes" : "No"}</td>
                              <td className="px-3 py-2">
                                {col.partitionIndex !== undefined && (
                                  <Badge variant="secondary" className="text-xs">
                                    #{col.partitionIndex + 1}
                                  </Badge>
                                )}
                              </td>
                              <td className="px-3 py-2 text-muted-foreground text-xs">
                                {col.comment || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Properties */}
                {selectedObject.properties && Object.keys(selectedObject.properties).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Properties</h3>
                    <div className="border rounded-lg divide-y">
                      {Object.entries(selectedObject.properties).map(([key, value]) => (
                        <div key={key} className="flex items-center px-3 py-2 text-sm">
                          <span className="font-mono text-xs text-muted-foreground w-48 shrink-0">
                            {key}
                          </span>
                          <span className="truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Children preview */}
                {selectedObject.children && selectedObject.children.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Contents ({selectedObject.children.length})
                    </h3>
                    <div className="border rounded-lg divide-y">
                      {selectedObject.children.slice(0, 10).map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-muted/30 cursor-pointer"
                          onClick={() => {
                            toggleNode(selectedObject.id);
                            onObjectSelect?.(child);
                          }}
                        >
                          {typeIcons[child.type]}
                          <span className="text-sm">{child.name}</span>
                          <span className="text-xs text-muted-foreground capitalize ml-auto">
                            {child.type}
                          </span>
                        </div>
                      ))}
                      {selectedObject.children.length > 10 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          +{selectedObject.children.length - 10} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select an object</p>
                <p className="text-sm">Choose a catalog, schema, or table from the tree</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
UnityCatalog.displayName = "UnityCatalog";

export { UnityCatalog };
