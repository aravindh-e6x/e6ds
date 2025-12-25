"use client";

import * as React from "react";
import {
  Play,
  Square,
  Plus,
  Trash2,
  Settings,
  Database,
  FileCode,
  Zap,
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Copy,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export type NodeType = "source" | "transform" | "sink" | "branch" | "join" | "custom";
export type NodeStatus = "idle" | "running" | "success" | "failed" | "pending";

export interface PipelineNode {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  status: NodeStatus;
  config?: Record<string, unknown>;
  position: { x: number; y: number };
  inputs?: string[];
  outputs?: string[];
  duration?: number;
  error?: string;
}

export interface PipelineConnection {
  id: string;
  from: string;
  to: string;
  fromPort?: string;
  toPort?: string;
}

export interface PipelineBuilderProps {
  /** Pipeline name */
  name: string;
  /** Pipeline nodes */
  nodes: PipelineNode[];
  /** Connections between nodes */
  connections: PipelineConnection[];
  /** Currently selected node ID */
  selectedNodeId?: string;
  /** Whether the pipeline is running */
  isRunning?: boolean;
  /** Whether the pipeline is read-only */
  readOnly?: boolean;
  /** Callback when node is selected */
  onNodeSelect?: (nodeId: string | null) => void;
  /** Callback when node is added */
  onNodeAdd?: (type: NodeType, position: { x: number; y: number }) => void;
  /** Callback when node is deleted */
  onNodeDelete?: (nodeId: string) => void;
  /** Callback when node is moved */
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  /** Callback when connection is added */
  onConnectionAdd?: (from: string, to: string) => void;
  /** Callback when connection is deleted */
  onConnectionDelete?: (connectionId: string) => void;
  /** Callback when run is clicked */
  onRun?: () => void;
  /** Callback when stop is clicked */
  onStop?: () => void;
  /** Callback when node settings is clicked */
  onNodeSettings?: (nodeId: string) => void;
  /** Additional className */
  className?: string;
}

const nodeTypeConfig: Record<NodeType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  source: {
    icon: <Database className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  transform: {
    icon: <Zap className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
  },
  sink: {
    icon: <Database className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  branch: {
    icon: <GitBranch className="h-4 w-4" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
  },
  join: {
    icon: <Link2 className="h-4 w-4" />,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/50",
  },
  custom: {
    icon: <FileCode className="h-4 w-4" />,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/50",
  },
};

const statusIcons: Record<NodeStatus, React.ReactNode> = {
  idle: null,
  running: <Loader2 className="h-3 w-3 animate-spin text-blue-500 dark:text-blue-400" />,
  success: <CheckCircle2 className="h-3 w-3 text-green-500 dark:text-green-400" />,
  failed: <XCircle className="h-3 w-3 text-destructive" />,
  pending: <Clock className="h-3 w-3 text-muted-foreground" />,
};

const PipelineNode: React.FC<{
  node: PipelineNode;
  isSelected: boolean;
  readOnly: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onSettings: () => void;
}> = ({ node, isSelected, readOnly, onSelect, onDelete, onSettings }) => {
  const config = nodeTypeConfig[node.type];

  return (
    <div
      className={cn(
        "absolute w-48 bg-card border-2 rounded-lg shadow-sm cursor-pointer transition-all",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
        node.status === "running" && "ring-2 ring-blue-500/30"
      )}
      style={{ left: node.position.x, top: node.position.y }}
      onClick={onSelect}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-t-md", config.bgColor)}>
        <span className={config.color}>{config.icon}</span>
        <span className="font-medium text-sm truncate flex-1">{node.name}</span>
        {statusIcons[node.status]}
        {!readOnly && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-0.5 hover:bg-black/10 rounded">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-3.5 w-3.5 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-3.5 w-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        {node.description && (
          <p className="text-xs text-muted-foreground truncate">{node.description}</p>
        )}
        {node.duration !== undefined && node.status === "success" && (
          <p className="text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3 inline mr-1" />
            {node.duration}s
          </p>
        )}
        {node.error && (
          <p className="text-xs text-destructive mt-1 truncate" title={node.error}>
            <AlertCircle className="h-3 w-3 inline mr-1" />
            {node.error}
          </p>
        )}
      </div>

      {/* Connection points */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-card border-2 border-border rounded-full" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-card border-2 border-border rounded-full" />
    </div>
  );
};

const PipelineBuilder = React.forwardRef<HTMLDivElement, PipelineBuilderProps>(
  (
    {
      name,
      nodes,
      connections,
      selectedNodeId,
      isRunning = false,
      readOnly = false,
      onNodeSelect,
      onNodeAdd,
      onNodeDelete,
      onConnectionDelete,
      onRun,
      onStop,
      onNodeSettings,
      className,
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLDivElement>(null);

    const handleCanvasClick = (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onNodeSelect?.(null);
      }
    };

    const renderConnections = () => {
      return connections.map((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return null;

        const x1 = fromNode.position.x + 192; // node width
        const y1 = fromNode.position.y + 40; // half node height
        const x2 = toNode.position.x;
        const y2 = toNode.position.y + 40;

        const midX = (x1 + x2) / 2;

        return (
          <svg
            key={conn.id}
            className="absolute inset-0 pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <path
              d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="pointer-events-auto cursor-pointer hover:stroke-primary"
              onClick={() => !readOnly && onConnectionDelete?.(conn.id)}
            />
          </svg>
        );
      });
    };

    return (
      <div ref={ref} className={cn("flex flex-col h-full bg-background", className)}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">{name}</h2>
            {isRunning && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Running
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!readOnly && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Node
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onNodeAdd?.("source", { x: 100, y: 100 })}>
                    <Database className="h-4 w-4 mr-2 text-blue-600" />
                    Source
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNodeAdd?.("transform", { x: 100, y: 100 })}>
                    <Zap className="h-4 w-4 mr-2 text-purple-600" />
                    Transform
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNodeAdd?.("sink", { x: 100, y: 100 })}>
                    <Database className="h-4 w-4 mr-2 text-green-600" />
                    Sink
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNodeAdd?.("branch", { x: 100, y: 100 })}>
                    <GitBranch className="h-4 w-4 mr-2 text-orange-600" />
                    Branch
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNodeAdd?.("join", { x: 100, y: 100 })}>
                    <Link2 className="h-4 w-4 mr-2 text-cyan-600" />
                    Join
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNodeAdd?.("custom", { x: 100, y: 100 })}>
                    <FileCode className="h-4 w-4 mr-2 text-gray-600" />
                    Custom Code
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isRunning ? (
              <Button variant="destructive" size="sm" onClick={onStop}>
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            ) : (
              <Button size="sm" onClick={onRun}>
                <Play className="h-4 w-4 mr-1" />
                Run Pipeline
              </Button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-auto bg-muted/30"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
          onClick={handleCanvasClick}
        >
          {renderConnections()}
          {nodes.map((node) => (
            <PipelineNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              readOnly={readOnly}
              onSelect={() => onNodeSelect?.(node.id)}
              onDelete={() => onNodeDelete?.(node.id)}
              onSettings={() => onNodeSettings?.(node.id)}
            />
          ))}

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">No nodes in this pipeline</p>
                {!readOnly && (
                  <Button variant="outline" size="sm" onClick={() => onNodeAdd?.("source", { x: 100, y: 100 })}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add first node
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
PipelineBuilder.displayName = "PipelineBuilder";

export { PipelineBuilder };
