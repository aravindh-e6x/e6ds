"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Badge } from "./badge";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[];
  /** Currently selected value(s) */
  value?: string | string[];
  /** Callback when selection changes */
  onValueChange?: (value: string | string[]) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Text shown when no results found */
  emptyText?: string;
  /** Whether multiple selections are allowed */
  multiple?: boolean;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Additional className for the trigger button */
  className?: string;
  /** Width of the popover content */
  popoverWidth?: string | number;
  /** Whether to allow clearing the selection */
  clearable?: boolean;
  /** Custom filter function */
  filterFn?: (option: ComboboxOption, search: string) => boolean;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      multiple = false,
      disabled = false,
      className,
      popoverWidth = "var(--radix-popover-trigger-width)",
      clearable = false,
      filterFn,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    // Normalize value to array for internal handling
    const selectedValues = React.useMemo(() => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    }, [value]);

    const defaultFilter = (option: ComboboxOption, search: string) => {
      const searchLower = search.toLowerCase();
      return (
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower) ||
        (option.description?.toLowerCase().includes(searchLower) ?? false)
      );
    };

    const filterFunction = filterFn || defaultFilter;

    const filteredOptions = React.useMemo(() => {
      if (!search) return options;
      return options.filter((option) => filterFunction(option, search));
    }, [options, search, filterFunction]);

    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onValueChange?.(newValues);
      } else {
        onValueChange?.(optionValue);
        setOpen(false);
      }
      setSearch("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.(multiple ? [] : "");
    };

    const handleRemoveTag = (e: React.MouseEvent, valueToRemove: string) => {
      e.stopPropagation();
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      onValueChange?.(multiple ? newValues : "");
    };

    const getSelectedLabels = () => {
      return selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[];
    };

    const displayValue = () => {
      const labels = getSelectedLabels();
      if (labels.length === 0) return placeholder;
      if (!multiple) return labels[0];
      return null; // Will render badges instead
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !selectedValues.length && "text-muted-foreground",
              className
            )}
          >
            <span className="flex flex-wrap gap-1 items-center overflow-hidden flex-1">
              {multiple && selectedValues.length > 0 ? (
                getSelectedLabels().map((label, index) => (
                  <Badge
                    key={selectedValues[index]}
                    variant="secondary"
                    className="mr-1 mb-0"
                  >
                    {label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => handleRemoveTag(e, selectedValues[index])}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="truncate">{displayValue()}</span>
              )}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {clearable && selectedValues.length > 0 && (
                <button
                  className="rounded-full p-0.5 hover:bg-accent"
                  onClick={handleClear}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <X className="h-4 w-4 opacity-50" />
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: popoverWidth }}
          align="start"
        >
          <div className="flex flex-col">
            {/* Search input */}
            <div className="flex items-center border-b px-3">
              <input
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        option.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                          !isSelected && "opacity-0"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                      {option.icon && (
                        <span className="mr-2 h-4 w-4 shrink-0">
                          {option.icon}
                        </span>
                      )}
                      <div className="flex flex-col items-start">
                        <span>{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
Combobox.displayName = "Combobox";

export { Combobox };
