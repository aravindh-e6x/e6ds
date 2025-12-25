"use client";

import * as React from "react";
import {
  Box,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  MoreHorizontal,
  Trash2,
  Download,
  Upload,
  Play,
  Archive,
  Star,
  GitBranch,
  ChevronDown,
  ChevronRight,
  FileCode,
  ExternalLink,
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

export type ModelStage = "None" | "Staging" | "Production" | "Archived";
export type ModelStatus = "READY" | "PENDING_REGISTRATION" | "FAILED_REGISTRATION";

export interface ModelVersion {
  version: number;
  stage: ModelStage;
  status: ModelStatus;
  createdAt: Date;
  lastUpdated: Date;
  createdBy?: string;
  description?: string;
  runId?: string;
  source?: string;
  tags?: Record<string, string>;
  signature?: {
    inputs: { name: string; type: string }[];
    outputs: { name: string; type: string }[];
  };
  metrics?: Record<string, number>;
}

export interface RegisteredModel {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  lastUpdated: Date;
  latestVersion?: number;
  versions: ModelVersion[];
  tags?: string[];
  owner?: string;
  permissionLevel?: "CAN_READ" | "CAN_EDIT" | "CAN_MANAGE";
}

export interface ModelRegistryProps {
  /** List of registered models */
  models: RegisteredModel[];
  /** Currently selected model ID */
  selectedModelId?: string;
  /** Currently selected version */
  selectedVersion?: number;
  /** Callback when model is selected */
  onModelSelect?: (modelId: string | null) => void;
  /** Callback when version is selected */
  onVersionSelect?: (modelId: string, version: number) => void;
  /** Callback when model is deployed */
  onModelDeploy?: (modelId: string, version: number, stage: ModelStage) => void;
  /** Callback when version is archived */
  onVersionArchive?: (modelId: string, version: number) => void;
  /** Callback when model is deleted */
  onModelDelete?: (modelId: string) => void;
  /** Callback when model is registered */
  onModelRegister?: () => void;
  /** Additional className */
  className?: string;
}

const stageConfig: Record<ModelStage, { color: string; bgColor: string }> = {
  None: { color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-800" },
  Staging: { color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
  Production: { color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/50" },
  Archived: { color: "text-gray-500 dark:text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-800" },
};

const statusIcons: Record<ModelStatus, React.ReactNode> = {
  READY: <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />,
  PENDING_REGISTRATION: <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />,
  FAILED_REGISTRATION: <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />,
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

const ModelRegistry = React.forwardRef<HTMLDivElement, ModelRegistryProps>(
  (
    {
      models,
      selectedModelId,
      selectedVersion,
      onModelSelect,
      onVersionSelect,
      onModelDeploy,
      onVersionArchive,
      onModelDelete,
      onModelRegister,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedModels, setExpandedModels] = React.useState<Set<string>>(
      new Set(selectedModelId ? [selectedModelId] : [])
    );

    const selectedModel = models.find((m) => m.id === selectedModelId);
    const selectedVersionData = selectedModel?.versions.find(
      (v) => v.version === selectedVersion
    );

    const filteredModels = models.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleModel = (id: string) => {
      const next = new Set(expandedModels);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setExpandedModels(next);
    };

    // Count by stage
    const stageCounts = models.reduce((acc, m) => {
      m.versions.forEach((v) => {
        acc[v.stage] = (acc[v.stage] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return (
      <div ref={ref} className={cn("flex h-full bg-background", className)}>
        {/* Model list */}
        <div className="w-80 border-r flex flex-col">
          <div className="px-3 py-2 border-b bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Model Registry</span>
              </div>
              <Button size="sm" variant="outline" onClick={onModelRegister}>
                <Upload className="h-3.5 w-3.5 mr-1" />
                Register
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="pl-8 h-8 text-sm"
              />
            </div>

            {/* Stage summary */}
            <div className="flex items-center gap-2 mt-2">
              {stageCounts["Production"] && (
                <Badge variant="outline" className="text-xs gap-1 text-green-600 dark:text-green-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                  {stageCounts["Production"]} Prod
                </Badge>
              )}
              {stageCounts["Staging"] && (
                <Badge variant="outline" className="text-xs gap-1 text-yellow-600 dark:text-yellow-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                  {stageCounts["Staging"]} Staging
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredModels.map((model) => (
              <div key={model.id} className="border-b">
                <div
                  className={cn(
                    "px-3 py-2 cursor-pointer hover:bg-muted/50 flex items-center gap-2",
                    model.id === selectedModelId && "bg-muted"
                  )}
                  onClick={() => {
                    onModelSelect?.(model.id);
                    toggleModel(model.id);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModel(model.id);
                    }}
                    className="p-0.5"
                  >
                    {expandedModels.has(model.id) ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <Box className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{model.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {model.versions.length} version{model.versions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {model.versions.some((v) => v.stage === "Production") && (
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>

                {expandedModels.has(model.id) && (
                  <div className="pl-8 pb-2">
                    {model.versions
                      .sort((a, b) => b.version - a.version)
                      .slice(0, 5)
                      .map((version) => (
                        <div
                          key={version.version}
                          className={cn(
                            "px-2 py-1.5 mx-2 rounded flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                            selectedModelId === model.id &&
                              selectedVersion === version.version &&
                              "bg-primary/10"
                          )}
                          onClick={() => onVersionSelect?.(model.id, version.version)}
                        >
                          {statusIcons[version.status]}
                          <span className="text-xs font-mono">v{version.version}</span>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", stageConfig[version.stage].color)}
                          >
                            {version.stage}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatRelativeTime(version.createdAt)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Version details */}
        <div className="flex-1 flex flex-col">
          {selectedModel && selectedVersionData ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h2 className="font-semibold">{selectedModel.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        Version {selectedVersionData.version}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        stageConfig[selectedVersionData.stage].bgColor,
                        stageConfig[selectedVersionData.stage].color
                      )}
                    >
                      {selectedVersionData.stage}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedVersionData.stage !== "Production" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          onModelDeploy?.(
                            selectedModel.id,
                            selectedVersionData.version,
                            "Production"
                          )
                        }
                      >
                        <Play className="h-3.5 w-3.5 mr-1" />
                        Deploy to Production
                      </Button>
                    )}
                    {selectedVersionData.stage !== "Staging" &&
                      selectedVersionData.stage !== "Production" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onModelDeploy?.(
                              selectedModel.id,
                              selectedVersionData.version,
                              "Staging"
                            )
                          }
                        >
                          <Play className="h-3.5 w-3.5 mr-1" />
                          Deploy to Staging
                        </Button>
                      )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-3.5 w-3.5 mr-2" />
                          Download Model
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-3.5 w-3.5 mr-2" />
                          Serve Endpoint
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            onVersionArchive?.(selectedModel.id, selectedVersionData.version)
                          }
                        >
                          <Archive className="h-3.5 w-3.5 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onModelDelete?.(selectedModel.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Model
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {selectedVersionData.createdBy && (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {selectedVersionData.createdBy}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Created {formatRelativeTime(selectedVersionData.createdAt)}
                  </span>
                  {selectedVersionData.runId && (
                    <span className="flex items-center gap-1 font-mono text-xs">
                      <GitBranch className="h-3.5 w-3.5" />
                      {selectedVersionData.runId.slice(0, 8)}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Description */}
                {selectedVersionData.description && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedVersionData.description}
                    </p>
                  </div>
                )}

                {/* Model Signature */}
                {selectedVersionData.signature && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Model Signature</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Inputs</p>
                        <div className="space-y-1">
                          {selectedVersionData.signature.inputs.map((input, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="font-mono text-xs">{input.name}</span>
                              <Badge variant="outline" className="text-xs font-mono">
                                {input.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Outputs</p>
                        <div className="space-y-1">
                          {selectedVersionData.signature.outputs.map((output, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="font-mono text-xs">{output.name}</span>
                              <Badge variant="outline" className="text-xs font-mono">
                                {output.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {selectedVersionData.metrics &&
                  Object.keys(selectedVersionData.metrics).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Metrics</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {Object.entries(selectedVersionData.metrics).map(([name, value]) => (
                          <div key={name} className="border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">{name}</p>
                            <p className="text-xl font-bold">{value.toFixed(4)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Tags */}
                {selectedVersionData.tags &&
                  Object.keys(selectedVersionData.tags).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Tags</h3>
                      <div className="border rounded-lg divide-y">
                        {Object.entries(selectedVersionData.tags).map(([key, value]) => (
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

                {/* Source */}
                {selectedVersionData.source && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Source</h3>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs truncate">
                        {selectedVersionData.source}
                      </span>
                    </div>
                  </div>
                )}

                {/* Version History */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Version History</h3>
                  <div className="border rounded-lg divide-y">
                    {selectedModel.versions
                      .sort((a, b) => b.version - a.version)
                      .map((v) => (
                        <div
                          key={v.version}
                          className={cn(
                            "flex items-center px-3 py-2 hover:bg-muted/30 cursor-pointer",
                            v.version === selectedVersionData.version && "bg-muted"
                          )}
                          onClick={() => onVersionSelect?.(selectedModel.id, v.version)}
                        >
                          {statusIcons[v.status]}
                          <span className="font-mono text-sm ml-2">v{v.version}</span>
                          <Badge
                            variant="outline"
                            className={cn("ml-2 text-xs", stageConfig[v.stage].color)}
                          >
                            {v.stage}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatRelativeTime(v.createdAt)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a model version</p>
                <p className="text-sm">Choose a model and version from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ModelRegistry.displayName = "ModelRegistry";

export { ModelRegistry };
