"use client";

import * as React from "react";
import {
  Play,
  Square,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  GripVertical,
  Check,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type CellType = "code" | "markdown" | "sql";
export type CellStatus = "idle" | "running" | "success" | "error" | "queued";

export interface CellOutput {
  type: "text" | "table" | "error" | "html" | "image" | "chart";
  data: unknown;
  executionTime?: number;
}

export interface NotebookCellProps {
  /** Unique cell identifier */
  id: string;
  /** Cell type */
  type: CellType;
  /** Cell content/source code */
  content: string;
  /** Execution status */
  status?: CellStatus;
  /** Cell outputs */
  outputs?: CellOutput[];
  /** Execution order number */
  executionCount?: number | null;
  /** Whether the cell is selected */
  isSelected?: boolean;
  /** Whether the cell is being edited */
  isEditing?: boolean;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Callback when content changes */
  onContentChange?: (content: string) => void;
  /** Callback when cell is run */
  onRun?: () => void;
  /** Callback when cell is stopped */
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
  /** Callback to move cell up */
  onMoveUp?: () => void;
  /** Callback to move cell down */
  onMoveDown?: () => void;
  /** Callback when cell is selected */
  onSelect?: () => void;
  /** Additional className */
  className?: string;
  /** Custom output renderer */
  renderOutput?: (output: CellOutput) => React.ReactNode;
}

const statusIcons: Record<CellStatus, React.ReactNode> = {
  idle: null,
  running: <Loader2 className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400" />,
  success: <Check className="h-4 w-4 text-green-500 dark:text-green-400" />,
  error: <AlertCircle className="h-4 w-4 text-destructive" />,
  queued: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const DefaultOutputRenderer: React.FC<{ output: CellOutput }> = ({ output }) => {
  switch (output.type) {
    case "text":
      return (
        <pre className="text-sm font-mono whitespace-pre-wrap p-2 bg-muted/50">
          {String(output.data)}
        </pre>
      );
    case "error":
      return (
        <div className="p-2 bg-destructive/10 border border-destructive/20">
          <pre className="text-sm font-mono text-destructive whitespace-pre-wrap">
            {String(output.data)}
          </pre>
        </div>
      );
    case "table":
      const tableData = output.data as { columns?: string[]; rows?: unknown[][] };
      if (!tableData?.columns || !tableData?.rows) {
        return (
          <pre className="text-sm font-mono p-2 text-muted-foreground">
            Invalid table data
          </pre>
        );
      }
      return (
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                {tableData.columns.map((col, i) => (
                  <th key={i} className="px-3 py-2 text-left font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  {Array.isArray(row) && row.map((cell, j) => (
                    <td key={j} className="px-3 py-2">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "html":
      return (
        <div
          className="p-2"
          dangerouslySetInnerHTML={{ __html: String(output.data) }}
        />
      );
    case "image":
      return (
        <div className="p-2">
          <img
            src={String(output.data)}
            alt="Cell output"
            className="max-w-full"
          />
        </div>
      );
    default:
      return (
        <pre className="text-sm font-mono p-2">
          {JSON.stringify(output.data, null, 2)}
        </pre>
      );
  }
};

const NotebookCell = React.forwardRef<HTMLDivElement, NotebookCellProps>(
  (
    {
      id: _id,
      type,
      content,
      status = "idle",
      outputs = [],
      executionCount,
      isSelected = false,
      isEditing = false,
      showLineNumbers = true,
      onContentChange,
      onRun,
      onStop,
      onTypeChange,
      onAddAbove,
      onAddBelow,
      onDelete,
      onCopy,
      onMoveUp,
      onMoveDown,
      onSelect,
      className,
      renderOutput,
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [localContent, setLocalContent] = React.useState(content || "");

    React.useEffect(() => {
      setLocalContent(content || "");
    }, [content]);

    React.useEffect(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [isEditing]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setLocalContent(newContent);
      onContentChange?.(newContent);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Shift+Enter to run cell
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        onRun?.();
      }
    };

    const lines = localContent.split("\n");

    return (
      <div
        ref={ref}
        className={cn(
          "group border-l-2 transition-colors",
          isSelected ? "border-l-primary" : "border-l-transparent",
          "hover:border-l-primary/50",
          className
        )}
        onClick={onSelect}
      >
        {/* Cell toolbar */}
        <div className="flex items-center gap-1 px-2 py-1 bg-muted/30 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Drag handle */}
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

          {/* Run/Stop button */}
          {status === "running" ? (
            <button
              onClick={onStop}
              className="p-1 hover:bg-muted rounded"
              title="Stop execution"
            >
              <Square className="h-4 w-4 text-destructive" />
            </button>
          ) : (
            <button
              onClick={onRun}
              className="p-1 hover:bg-muted rounded"
              title="Run cell (Shift+Enter)"
            >
              <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
            </button>
          )}

          {/* Cell type selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-2 py-1 text-xs hover:bg-muted rounded capitalize">
                {type}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onTypeChange?.("code")}>
                Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTypeChange?.("sql")}>
                SQL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTypeChange?.("markdown")}>
                Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          {/* Move buttons */}
          <button
            onClick={onMoveUp}
            className="p-1 hover:bg-muted rounded"
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            className="p-1 hover:bg-muted rounded"
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddAbove}>
                Add Cell Above
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddBelow}>
                Add Cell Below
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Cell content */}
        <div className="flex">
          {/* Execution count / status */}
          <div className="w-12 shrink-0 flex items-start justify-center pt-2 text-xs text-muted-foreground">
            {status !== "idle" ? (
              statusIcons[status]
            ) : executionCount !== null && executionCount !== undefined ? (
              <span>[{executionCount}]</span>
            ) : (
              <span>[ ]</span>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 min-w-0">
            <div className="relative border bg-muted/20">
              {showLineNumbers && (
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/30 border-r text-right pr-2 pt-2 text-xs text-muted-foreground font-mono select-none">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={localContent}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full min-h-[100px] p-2 bg-transparent font-mono text-sm resize-none outline-none",
                  showLineNumbers && "pl-12"
                )}
                style={{ lineHeight: "1.5rem" }}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Outputs */}
        {outputs.length > 0 && (
          <div className="ml-12 border-t">
            {outputs.map((output, index) => (
              <div key={index} className="border-b last:border-b-0">
                {renderOutput ? (
                  renderOutput(output)
                ) : (
                  <DefaultOutputRenderer output={output} />
                )}
                {output.executionTime !== undefined && (
                  <div className="px-2 py-1 text-xs text-muted-foreground border-t bg-muted/30">
                    Executed in {output.executionTime.toFixed(2)}s
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
NotebookCell.displayName = "NotebookCell";

export { NotebookCell };
