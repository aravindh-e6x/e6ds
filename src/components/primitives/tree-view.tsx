"use client";

import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../forms/checkbox";

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  data?: Record<string, unknown>;
}

export interface TreeViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  data: TreeNode[];
  selectedIds?: string[];
  expandedIds?: string[];
  onSelect?: (ids: string[]) => void;
  onExpand?: (ids: string[]) => void;
  onNodeClick?: (node: TreeNode) => void;
  showCheckboxes?: boolean;
  multiSelect?: boolean;
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  selectedIds: string[];
  expandedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onNodeClick?: (node: TreeNode) => void;
  showCheckboxes: boolean;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  selectedIds,
  expandedIds,
  onToggleSelect,
  onToggleExpand,
  onNodeClick,
  showCheckboxes,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedIds.includes(node.id);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer",
          isSelected && !showCheckboxes && "bg-muted",
          node.disabled && "opacity-50 pointer-events-none"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            onToggleExpand(node.id);
          }
          onNodeClick?.(node);
        }}
      >
        {hasChildren ? (
          <button
            className="p-0.5 hover:bg-muted rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        {showCheckboxes && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(node.id)}
            onClick={(e) => e.stopPropagation()}
            className="mr-1"
          />
        )}
        {node.icon && <span className="mr-2 text-muted-foreground">{node.icon}</span>}
        <span className="text-sm truncate">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggleSelect={onToggleSelect}
              onToggleExpand={onToggleExpand}
              onNodeClick={onNodeClick}
              showCheckboxes={showCheckboxes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      data,
      selectedIds: controlledSelectedIds,
      expandedIds: controlledExpandedIds,
      onSelect,
      onExpand,
      onNodeClick,
      showCheckboxes = false,
      multiSelect = true,
      ...props
    },
    ref
  ) => {
    const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>([]);
    const [internalExpandedIds, setInternalExpandedIds] = React.useState<string[]>([]);

    const selectedIds = controlledSelectedIds ?? internalSelectedIds;
    const expandedIds = controlledExpandedIds ?? internalExpandedIds;

    const handleToggleSelect = (id: string) => {
      let newSelected: string[];
      if (multiSelect) {
        newSelected = selectedIds.includes(id)
          ? selectedIds.filter((s) => s !== id)
          : [...selectedIds, id];
      } else {
        newSelected = selectedIds.includes(id) ? [] : [id];
      }
      setInternalSelectedIds(newSelected);
      onSelect?.(newSelected);
    };

    const handleToggleExpand = (id: string) => {
      const newExpanded = expandedIds.includes(id)
        ? expandedIds.filter((e) => e !== id)
        : [...expandedIds, id];
      setInternalExpandedIds(newExpanded);
      onExpand?.(newExpanded);
    };

    return (
      <div ref={ref} className={cn("py-2", className)} {...props}>
        {data.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            level={0}
            selectedIds={selectedIds}
            expandedIds={expandedIds}
            onToggleSelect={handleToggleSelect}
            onToggleExpand={handleToggleExpand}
            onNodeClick={onNodeClick}
            showCheckboxes={showCheckboxes}
          />
        ))}
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

export { TreeView };
