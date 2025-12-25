"use client";

import * as React from "react";
import {
  Table,
  FileCode,
  Database,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";

export type LineageNodeType = "table" | "view" | "query" | "source" | "sink";

export interface LineageNode {
  id: string;
  name: string;
  type: LineageNodeType;
  schema?: string;
  catalog?: string;
  description?: string;
  columns?: string[];
  x?: number;
  y?: number;
}

export interface LineageEdge {
  source: string;
  target: string;
  columns?: Array<{
    source: string;
    target: string;
  }>;
}

export interface LineageGraphProps {
  /** Current node (center of the graph) */
  currentNodeId?: string;
  /** All nodes */
  nodes: LineageNode[];
  /** Edges between nodes */
  edges: LineageEdge[];
  /** Callback when a node is clicked */
  onNodeClick?: (node: LineageNode) => void;
  /** Callback when a node is double-clicked */
  onNodeDoubleClick?: (node: LineageNode) => void;
  /** Whether to show column-level lineage */
  showColumnLineage?: boolean;
  /** Additional className */
  className?: string;
}

const nodeTypeIcons: Record<LineageNodeType, React.ReactNode> = {
  table: <Table className="h-4 w-4" />,
  view: <FileCode className="h-4 w-4" />,
  query: <FileCode className="h-4 w-4" />,
  source: <Database className="h-4 w-4" />,
  sink: <Database className="h-4 w-4" />,
};

const nodeTypeColors: Record<LineageNodeType, string> = {
  table: "border-blue-500 bg-blue-50 dark:bg-blue-950",
  view: "border-purple-500 bg-purple-50 dark:bg-purple-950",
  query: "border-orange-500 bg-orange-50 dark:bg-orange-950",
  source: "border-green-500 bg-green-50 dark:bg-green-950",
  sink: "border-red-500 bg-red-50 dark:bg-red-950",
};

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 40;

const LineageGraph = React.forwardRef<HTMLDivElement, LineageGraphProps>(
  (
    {
      currentNodeId,
      nodes,
      edges,
      onNodeClick,
      onNodeDoubleClick,
      showColumnLineage: _showColumnLineage = false,
      className,
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(
      null
    );

    // Calculate node positions using a simple layered layout
    const positionedNodes = React.useMemo(() => {
      if (nodes.length === 0) return [];

      // Build adjacency lists
      const incoming = new Map<string, string[]>();
      const outgoing = new Map<string, string[]>();

      nodes.forEach((n) => {
        incoming.set(n.id, []);
        outgoing.set(n.id, []);
      });

      edges.forEach((e) => {
        outgoing.get(e.source)?.push(e.target);
        incoming.get(e.target)?.push(e.source);
      });

      // Assign layers (upstream -> current -> downstream)
      const layers = new Map<string, number>();
      const visited = new Set<string>();

      // BFS from current node to find layers
      if (currentNodeId) {
        layers.set(currentNodeId, 0);
        visited.add(currentNodeId);

        // Upstream (negative layers)
        const upstreamQueue = [...(incoming.get(currentNodeId) || [])];
        let upstreamLayer = -1;
        while (upstreamQueue.length > 0) {
          const levelSize = upstreamQueue.length;
          for (let i = 0; i < levelSize; i++) {
            const nodeId = upstreamQueue.shift()!;
            if (!visited.has(nodeId)) {
              visited.add(nodeId);
              layers.set(nodeId, upstreamLayer);
              upstreamQueue.push(...(incoming.get(nodeId) || []));
            }
          }
          upstreamLayer--;
        }

        // Downstream (positive layers)
        const downstreamQueue = [...(outgoing.get(currentNodeId) || [])];
        let downstreamLayer = 1;
        while (downstreamQueue.length > 0) {
          const levelSize = downstreamQueue.length;
          for (let i = 0; i < levelSize; i++) {
            const nodeId = downstreamQueue.shift()!;
            if (!visited.has(nodeId)) {
              visited.add(nodeId);
              layers.set(nodeId, downstreamLayer);
              downstreamQueue.push(...(outgoing.get(nodeId) || []));
            }
          }
          downstreamLayer++;
        }
      } else {
        // If no current node, just use topological sort
        nodes.forEach((n, i) => layers.set(n.id, i));
      }

      // Group by layer
      const layerGroups = new Map<number, LineageNode[]>();
      nodes.forEach((node) => {
        const layer = layers.get(node.id) || 0;
        if (!layerGroups.has(layer)) {
          layerGroups.set(layer, []);
        }
        layerGroups.get(layer)!.push(node);
      });

      // Calculate positions
      const sortedLayers = Array.from(layerGroups.keys()).sort((a, b) => a - b);
      const centerY = 200;

      return nodes.map((node) => {
        const layer = layers.get(node.id) || 0;
        const layerNodes = layerGroups.get(layer) || [];
        const indexInLayer = layerNodes.indexOf(node);
        const layerIndex = sortedLayers.indexOf(layer);

        const x = layerIndex * (NODE_WIDTH + HORIZONTAL_SPACING) + 50;
        const totalHeight =
          layerNodes.length * NODE_HEIGHT +
          (layerNodes.length - 1) * VERTICAL_SPACING;
        const y =
          centerY -
          totalHeight / 2 +
          indexInLayer * (NODE_HEIGHT + VERTICAL_SPACING);

        return { ...node, x, y };
      });
    }, [nodes, edges, currentNodeId]);

    // Calculate SVG paths for edges
    const edgePaths = React.useMemo(() => {
      return edges.map((edge) => {
        const sourceNode = positionedNodes.find((n) => n.id === edge.source);
        const targetNode = positionedNodes.find((n) => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        const x1 = (sourceNode.x || 0) + NODE_WIDTH;
        const y1 = (sourceNode.y || 0) + NODE_HEIGHT / 2;
        const x2 = targetNode.x || 0;
        const y2 = (targetNode.y || 0) + NODE_HEIGHT / 2;

        // Bezier curve
        const midX = (x1 + x2) / 2;
        const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

        return { ...edge, path, x1, y1, x2, y2 };
      });
    }, [positionedNodes, edges]);

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
        setOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 2));
    const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
    const handleReset = () => {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    };

    return (
      <TooltipProvider>
        <div ref={ref} className={cn("relative border bg-card", className)}>
          {/* Toolbar */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur border rounded p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-3 text-xs bg-background/80 backdrop-blur border rounded px-2 py-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50" />
              <span>Table</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-purple-500 bg-purple-50" />
              <span>View</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-green-500 bg-green-50" />
              <span>Source</span>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={containerRef}
            className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ minHeight: 400 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              width="100%"
              height="100%"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              {/* Edges */}
              <g>
                {edgePaths.map(
                  (edge, i) =>
                    edge && (
                      <g key={i}>
                        <path
                          d={edge.path}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="text-muted-foreground/50"
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    )
                )}
              </g>

              {/* Arrowhead marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    className="fill-muted-foreground/50"
                  />
                </marker>
              </defs>

              {/* Nodes */}
              <g>
                {positionedNodes.map((node) => (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 0}, ${node.y || 0})`}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      onNodeClick?.(node);
                    }}
                    onDoubleClick={() => onNodeDoubleClick?.(node)}
                    className="cursor-pointer"
                  >
                    <rect
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      rx={0}
                      className={cn(
                        "fill-background stroke-2",
                        nodeTypeColors[node.type],
                        node.id === currentNodeId && "stroke-primary stroke-[3]",
                        selectedNodeId === node.id &&
                          "stroke-ring stroke-[3]"
                      )}
                    />
                    <foreignObject
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      className="pointer-events-none"
                    >
                      <div className="h-full flex items-center gap-2 px-3">
                        <span className="shrink-0 text-muted-foreground">
                          {nodeTypeIcons[node.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {node.name}
                          </div>
                          {node.schema && (
                            <div className="text-xs text-muted-foreground truncate">
                              {node.schema}
                            </div>
                          )}
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </TooltipProvider>
    );
  }
);
LineageGraph.displayName = "LineageGraph";

export { LineageGraph };
