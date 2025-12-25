"use client";

import * as React from "react";
import {
  Table,
  Database,
  Columns,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  FunctionSquare,
  Variable as VariableIcon,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SuggestionType =
  | "table"
  | "column"
  | "database"
  | "schema"
  | "function"
  | "keyword"
  | "variable"
  | "snippet"
  | "recent";

export type ColumnDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "timestamp"
  | "array"
  | "object"
  | "unknown";

export interface AutocompleteSuggestion {
  /** Display label */
  label: string;
  /** Type of suggestion */
  type: SuggestionType;
  /** Secondary text (e.g., table name for columns) */
  detail?: string;
  /** Description or documentation */
  description?: string;
  /** Data type (for columns) */
  dataType?: ColumnDataType;
  /** Text to insert */
  insertText?: string;
  /** Icon override */
  icon?: React.ReactNode;
  /** Whether this is from AI */
  isAISuggestion?: boolean;
}

export interface AutocompletePopoverProps {
  /** List of suggestions */
  suggestions: AutocompleteSuggestion[];
  /** Currently selected index */
  selectedIndex?: number;
  /** Whether the popover is visible */
  isOpen?: boolean;
  /** Position of the popover */
  position?: { top: number; left: number };
  /** Callback when a suggestion is selected */
  onSelect?: (suggestion: AutocompleteSuggestion) => void;
  /** Callback when selection index changes */
  onSelectionChange?: (index: number) => void;
  /** Maximum height */
  maxHeight?: number;
  /** Whether to show descriptions */
  showDescriptions?: boolean;
  /** Additional className */
  className?: string;
}

const typeIcons: Record<SuggestionType, React.ReactNode> = {
  table: <Table className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  column: <Columns className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  database: <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  schema: <Database className="h-4 w-4 text-green-600 dark:text-green-400" />,
  function: <FunctionSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  keyword: <Type className="h-4 w-4 text-pink-600 dark:text-pink-400" />,
  variable: <VariableIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  snippet: <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
  recent: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const dataTypeIcons: Record<ColumnDataType, React.ReactNode> = {
  string: <Type className="h-3 w-3" />,
  number: <Hash className="h-3 w-3" />,
  boolean: <ToggleLeft className="h-3 w-3" />,
  date: <Calendar className="h-3 w-3" />,
  timestamp: <Calendar className="h-3 w-3" />,
  array: <VariableIcon className="h-3 w-3" />,
  object: <VariableIcon className="h-3 w-3" />,
  unknown: <VariableIcon className="h-3 w-3" />,
};

const AutocompletePopover = React.forwardRef<
  HTMLDivElement,
  AutocompletePopoverProps
>(
  (
    {
      suggestions,
      selectedIndex = 0,
      isOpen = true,
      position,
      onSelect,
      onSelectionChange,
      maxHeight = 300,
      showDescriptions = true,
      className,
    },
    ref
  ) => {
    const listRef = React.useRef<HTMLDivElement>(null);

    // Scroll selected item into view
    React.useEffect(() => {
      if (listRef.current) {
        const selectedItem = listRef.current.querySelector(
          `[data-index="${selectedIndex}"]`
        );
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest" });
        }
      }
    }, [selectedIndex]);

    // Keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            onSelectionChange?.(
              Math.min(selectedIndex + 1, suggestions.length - 1)
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            onSelectionChange?.(Math.max(selectedIndex - 1, 0));
            break;
          case "Enter":
          case "Tab":
            e.preventDefault();
            if (suggestions[selectedIndex]) {
              onSelect?.(suggestions[selectedIndex]);
            }
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, suggestions, onSelect, onSelectionChange]);

    if (!isOpen || suggestions.length === 0) {
      return null;
    }

    // Group suggestions by type
    const groupedSuggestions = React.useMemo(() => {
      const groups: Record<string, AutocompleteSuggestion[]> = {};
      suggestions.forEach((suggestion) => {
        const group = suggestion.type;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(suggestion);
      });
      return groups;
    }, [suggestions]);

    let currentIndex = 0;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 min-w-[280px] max-w-[400px] border bg-popover shadow-lg",
          className
        )}
        style={{
          top: position?.top,
          left: position?.left,
          maxHeight,
        }}
      >
        <div ref={listRef} className="overflow-auto" style={{ maxHeight }}>
          {Object.entries(groupedSuggestions).map(([type, items]) => (
            <div key={type}>
              {/* Group header */}
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground bg-muted/50 uppercase sticky top-0">
                {type}s
              </div>

              {/* Items */}
              {items.map((suggestion) => {
                const index = currentIndex++;
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={`${suggestion.type}-${suggestion.label}-${index}`}
                    data-index={index}
                    className={cn(
                      "flex items-start gap-2 px-2 py-1.5 cursor-pointer",
                      isSelected ? "bg-accent" : "hover:bg-muted/50"
                    )}
                    onClick={() => onSelect?.(suggestion)}
                    onMouseEnter={() => onSelectionChange?.(index)}
                  >
                    {/* Icon */}
                    <span className="shrink-0 mt-0.5">
                      {suggestion.icon || typeIcons[suggestion.type]}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {suggestion.label}
                        </span>

                        {/* Data type badge */}
                        {suggestion.dataType && (
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            {dataTypeIcons[suggestion.dataType]}
                            <span>{suggestion.dataType}</span>
                          </span>
                        )}

                        {/* AI badge */}
                        {suggestion.isAISuggestion && (
                          <span className="flex items-center gap-0.5 text-xs text-purple-600 dark:text-purple-400">
                            <Sparkles className="h-3 w-3" />
                            <span>AI</span>
                          </span>
                        )}
                      </div>

                      {/* Detail */}
                      {suggestion.detail && (
                        <div className="text-xs text-muted-foreground truncate">
                          {suggestion.detail}
                        </div>
                      )}

                      {/* Description */}
                      {showDescriptions && suggestion.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {suggestion.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-2 py-1 border-t bg-muted/30 text-xs text-muted-foreground flex items-center gap-4">
          <span>
            <kbd className="px-1 bg-muted rounded">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="px-1 bg-muted rounded">Tab</kbd> or{" "}
            <kbd className="px-1 bg-muted rounded">Enter</kbd> select
          </span>
          <span>
            <kbd className="px-1 bg-muted rounded">Esc</kbd> close
          </span>
        </div>
      </div>
    );
  }
);
AutocompletePopover.displayName = "AutocompletePopover";

export { AutocompletePopover };
