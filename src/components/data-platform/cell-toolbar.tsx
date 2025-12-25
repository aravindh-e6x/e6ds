"use client";

import * as React from "react";
import {
  Play,
  Square,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Code,
  FileText,
  Database,
  MoreHorizontal,
  Scissors,
  ClipboardPaste,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";

export type CellType = "code" | "markdown" | "sql";

export interface CellToolbarProps {
  /** Currently selected cell type */
  cellType: CellType;
  /** Whether the cell is currently running */
  isRunning?: boolean;
  /** Whether there's content in clipboard */
  hasClipboard?: boolean;
  /** Callback when run is clicked */
  onRun?: () => void;
  /** Callback when stop is clicked */
  onStop?: () => void;
  /** Callback when cell type changes */
  onTypeChange?: (type: CellType) => void;
  /** Callback to add cell above */
  onAddAbove?: () => void;
  /** Callback to add cell below */
  onAddBelow?: () => void;
  /** Callback to delete cell */
  onDelete?: () => void;
  /** Callback to copy cell */
  onCopy?: () => void;
  /** Callback to cut cell */
  onCut?: () => void;
  /** Callback to paste cell */
  onPaste?: () => void;
  /** Callback to move cell up */
  onMoveUp?: () => void;
  /** Callback to move cell down */
  onMoveDown?: () => void;
  /** Callback to clear outputs */
  onClearOutputs?: () => void;
  /** Callback to restart kernel */
  onRestartKernel?: () => void;
  /** Callback to run all cells */
  onRunAll?: () => void;
  /** Callback to run cells above */
  onRunAbove?: () => void;
  /** Callback to run cells below */
  onRunBelow?: () => void;
  /** Additional className */
  className?: string;
}

const cellTypeIcons: Record<CellType, React.ReactNode> = {
  code: <Code className="h-4 w-4" />,
  markdown: <FileText className="h-4 w-4" />,
  sql: <Database className="h-4 w-4" />,
};

const cellTypeLabels: Record<CellType, string> = {
  code: "Code",
  markdown: "Markdown",
  sql: "SQL",
};

const CellToolbar = React.forwardRef<HTMLDivElement, CellToolbarProps>(
  (
    {
      cellType,
      isRunning = false,
      hasClipboard = false,
      onRun,
      onStop,
      onTypeChange,
      onAddAbove,
      onAddBelow,
      onDelete,
      onCopy,
      onCut,
      onPaste,
      onMoveUp,
      onMoveDown,
      onClearOutputs,
      onRestartKernel,
      onRunAll,
      onRunAbove,
      onRunBelow,
      className,
    },
    ref
  ) => {
    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-1 px-2 py-1 border-b bg-muted/50",
            className
          )}
        >
          {/* Run controls */}
          <div className="flex items-center gap-1 pr-2 border-r">
            {isRunning ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onStop}
                    className="p-1.5 hover:bg-muted rounded text-destructive"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Stop execution</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onRun}
                    className="p-1.5 hover:bg-muted rounded text-green-600"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Run cell (Shift+Enter)</TooltipContent>
              </Tooltip>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-muted rounded text-xs">
                  ▾
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onRunAll}>
                  <Play className="mr-2 h-4 w-4" />
                  Run All Cells
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRunAbove}>
                  Run Cells Above
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRunBelow}>
                  Run Cells Below
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRestartKernel}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart Kernel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cell type selector */}
          <div className="flex items-center gap-1 px-2 border-r">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded text-sm">
                  {cellTypeIcons[cellType]}
                  <span>{cellTypeLabels[cellType]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onTypeChange?.("code")}>
                  <Code className="mr-2 h-4 w-4" />
                  Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTypeChange?.("sql")}>
                  <Database className="mr-2 h-4 w-4" />
                  SQL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTypeChange?.("markdown")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Add cell buttons */}
          <div className="flex items-center gap-1 px-2 border-r">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAddAbove}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <Plus className="h-4 w-4" />
                  <ChevronUp className="h-3 w-3 -ml-1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Add cell above</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAddBelow}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <Plus className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 -ml-1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Add cell below</TooltipContent>
            </Tooltip>
          </div>

          {/* Move cell buttons */}
          <div className="flex items-center gap-1 px-2 border-r">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onMoveUp}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Move cell up</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onMoveDown}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Move cell down</TooltipContent>
            </Tooltip>
          </div>

          {/* Edit actions */}
          <div className="flex items-center gap-1 px-2 border-r">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onCopy}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy cell</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onCut}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <Scissors className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Cut cell</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onPaste}
                  disabled={!hasClipboard}
                  className={cn(
                    "p-1.5 hover:bg-muted rounded",
                    !hasClipboard && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ClipboardPaste className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Paste cell</TooltipContent>
            </Tooltip>
          </div>

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-muted rounded text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete cell</TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClearOutputs}>
                Clear Outputs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRestartKernel}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Kernel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    );
  }
);
CellToolbar.displayName = "CellToolbar";

export { CellToolbar };
