"use client";

import * as React from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  /** Unique value for this option */
  value: string;
  /** Display label */
  label: string;
}

export interface SearchableSelectProps {
  /** Array of options */
  options: SearchableSelectOption[];
  /** Currently selected value */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Additional CSS classes for container */
  className?: string;
  /** Disable the select */
  disabled?: boolean;
}

const SearchableSelect = React.forwardRef<HTMLDivElement, SearchableSelectProps>(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      className,
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    const filteredOptions = React.useMemo(
      () =>
        options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        ),
      [options, search]
    );

    const selectedOption = React.useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value]
    );

    // Reset highlighted index when filtered options change
    React.useEffect(() => {
      setHighlightedIndex(0);
    }, [search]);

    // Click outside handler
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(0);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    React.useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

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
      (optValue: string) => {
        onChange?.(optValue);
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(0);
        triggerRef.current?.focus();
      },
      [onChange]
    );

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.("");
      setSearch("");
    };

    const openDropdown = React.useCallback(() => {
      if (!disabled) {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
    }, [disabled]);

    const closeDropdown = React.useCallback(() => {
      setIsOpen(false);
      setSearch("");
      setHighlightedIndex(0);
    }, []);

    // Keyboard handler for the trigger button
    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          e.preventDefault();
          openDropdown();
          break;
        case "ArrowUp":
          e.preventDefault();
          openDropdown();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
      }
    };

    // Keyboard handler for the search input
    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          triggerRef.current?.focus();
          break;
        case "Tab":
          closeDropdown();
          break;
      }
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative", className)}
      >
        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          className={cn(
            "flex items-center justify-between w-full h-9 px-3 rounded-md border border-input bg-background text-sm transition-colors",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-muted-foreground cursor-pointer",
            isOpen && "border-primary ring-1 ring-primary"
          )}
        >
          <span
            className={cn(
              "truncate",
              selectedOption ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <X
                className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              />
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg">
            {/* Search Input */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 pl-8 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Options List */}
            <div ref={listRef} className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                filteredOptions.map((opt, index) => (
                  <button
                    key={opt.value}
                    type="button"
                    data-index={index}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors",
                      index === highlightedIndex && "bg-accent text-accent-foreground",
                      opt.value === value &&
                        index !== highlightedIndex &&
                        "bg-accent/50"
                    )}
                  >
                    <span className="truncate flex-1 mr-2">{opt.label}</span>
                    {opt.value === value && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
SearchableSelect.displayName = "SearchableSelect";

export { SearchableSelect };
