"use client";

import * as React from "react";
import { X, Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  /** Array of suggested tag strings */
  options?: string[];
  /** Array of currently selected tags */
  value?: string[];
  /** Callback when tags change */
  onChange?: (tags: string[]) => void;
  /** Allow creating new tags not in options */
  allowCreate?: boolean;
  /** Placeholder text when no tags */
  placeholder?: string;
  /** Additional CSS classes for container */
  className?: string;
  /** Disable the input */
  disabled?: boolean;
}

const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      options = [],
      value = [],
      onChange,
      allowCreate = true,
      placeholder = "Add tags...",
      className,
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Filter suggestions based on input, excluding already selected
    const suggestions = React.useMemo(() => {
      const available = options.filter((tag) => !value.includes(tag));
      if (!inputValue.trim()) {
        return available;
      }
      const searchLower = inputValue.toLowerCase();
      return available.filter((tag) => tag.toLowerCase().includes(searchLower));
    }, [options, value, inputValue]);

    // Check if current input matches an existing option
    const isExistingTag = React.useMemo(() => {
      return options.some(
        (tag) => tag.toLowerCase() === inputValue.toLowerCase().trim()
      );
    }, [options, inputValue]);

    // Check if current input is already selected
    const isAlreadySelected = React.useMemo(() => {
      return value.some(
        (tag) => tag.toLowerCase() === inputValue.toLowerCase().trim()
      );
    }, [value, inputValue]);

    // Reset highlighted index when suggestions change
    React.useEffect(() => {
      setHighlightedIndex(0);
    }, [inputValue]);

    // Click outside handler
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setInputValue("");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (isOpen && listRef.current) {
        const highlightedEl = listRef.current.querySelector(
          `[data-index="${highlightedIndex}"]`
        );
        if (highlightedEl) {
          highlightedEl.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex, isOpen]);

    const handleSelect = React.useCallback(
      (tag: string) => {
        if (!value.includes(tag)) {
          onChange?.([...value, tag]);
        }
        setInputValue("");
        setHighlightedIndex(0);
        inputRef.current?.focus();
      },
      [value, onChange]
    );

    const handleRemove = (e: React.MouseEvent, tag: string) => {
      e.stopPropagation();
      onChange?.(value.filter((t) => t !== tag));
    };

    const handleClearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.([]);
      setInputValue("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsOpen(true);
    };

    const handleFocus = () => {
      if (!disabled) {
        setIsOpen(true);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      const hasCreateOption =
        allowCreate && inputValue.trim() && !isExistingTag && !isAlreadySelected;
      const totalItems = suggestions.length + (hasCreateOption ? 1 : 0);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (isOpen && totalItems > 0) {
            if (hasCreateOption && highlightedIndex === suggestions.length) {
              handleSelect(inputValue.trim());
            } else if (suggestions[highlightedIndex]) {
              handleSelect(suggestions[highlightedIndex]);
            }
          } else if (allowCreate && inputValue.trim() && !isAlreadySelected) {
            handleSelect(inputValue.trim());
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setInputValue("");
          break;
        case "Backspace":
          if (!inputValue && value.length > 0) {
            onChange?.(value.slice(0, -1));
          }
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    };

    const hasCreateOption =
      allowCreate && inputValue.trim() && !isExistingTag && !isAlreadySelected;

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative", className)}
      >
        {/* Input with tags */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-1 min-h-9 px-2 py-1.5 rounded-md border border-input bg-background text-sm transition-colors",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-muted-foreground cursor-text",
            isOpen && "border-primary ring-1 ring-primary"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <Tag className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent rounded text-xs max-w-[120px]"
            >
              <span className="truncate">{tag}</span>
              {!disabled && (
                <X
                  className="h-3 w-3 hover:text-destructive cursor-pointer shrink-0"
                  onClick={(e) => handleRemove(e, tag)}
                />
              )}
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[80px] h-6 bg-transparent outline-none text-sm"
          />
          {value.length > 0 && !disabled && (
            <X
              className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mr-1"
              onClick={handleClearAll}
            />
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (suggestions.length > 0 || hasCreateOption) && (
          <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg">
            <div ref={listRef} className="max-h-48 overflow-y-auto py-1">
              {suggestions.map((tag, index) => (
                <button
                  key={tag}
                  type="button"
                  data-index={index}
                  onClick={() => handleSelect(tag)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors",
                    index === highlightedIndex && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="truncate flex-1 mr-2">{tag}</span>
                  {value.includes(tag) && <Check className="h-4 w-4 shrink-0" />}
                </button>
              ))}
              {hasCreateOption && (
                <button
                  type="button"
                  data-index={suggestions.length}
                  onClick={() => handleSelect(inputValue.trim())}
                  onMouseEnter={() => setHighlightedIndex(suggestions.length)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors border-t border-border",
                    highlightedIndex === suggestions.length &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="text-primary font-medium truncate">
                    + Create "{inputValue.trim()}"
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    (new tag)
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
TagInput.displayName = "TagInput";

export { TagInput };
