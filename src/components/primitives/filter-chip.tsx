"use client";

import * as React from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ActiveFilter {
  field: string;
  fieldLabel: string;
  operator?: string;
  value: string;
  valueLabel?: string;
}

export interface FilterChipProps extends React.HTMLAttributes<HTMLDivElement> {
  filter: ActiveFilter;
  onRemove?: () => void;
  onClick?: () => void;
}

const FilterChip = React.forwardRef<HTMLDivElement, FilterChipProps>(
  ({ className, filter, onRemove, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 h-7 px-2 text-sm bg-muted border rounded-sm",
          onClick && "cursor-pointer hover:bg-muted/80",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <span className="text-muted-foreground">{filter.fieldLabel}:</span>
        <span className="font-medium">{filter.valueLabel || filter.value}</span>
        {onRemove && (
          <button
            className="ml-1 p-0.5 hover:bg-background rounded"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);
FilterChip.displayName = "FilterChip";

export interface AddFilterButtonProps {
  options: FilterOption[];
  onSelect: (option: FilterOption) => void;
  label?: string;
  className?: string;
}

const AddFilterButton = React.forwardRef<HTMLButtonElement, AddFilterButtonProps>(
  ({ options, onSelect, label = "Add filter", className }, ref) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button ref={ref} variant="outline" size="sm" className={cn("gap-1", className)}>
            <Plus className="h-4 w-4" />
            {label}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option)}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
AddFilterButton.displayName = "AddFilterButton";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: ActiveFilter[];
  filterOptions: FilterOption[];
  onAddFilter: (option: FilterOption) => void;
  onRemoveFilter: (index: number) => void;
  onFilterClick?: (filter: ActiveFilter, index: number) => void;
}

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      className,
      filters,
      filterOptions,
      onAddFilter,
      onRemoveFilter,
      onFilterClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 flex-wrap", className)}
        {...props}
      >
        {filters.map((filter, index) => (
          <FilterChip
            key={`${filter.field}-${index}`}
            filter={filter}
            onRemove={() => onRemoveFilter(index)}
            onClick={onFilterClick ? () => onFilterClick(filter, index) : undefined}
          />
        ))}
        <AddFilterButton options={filterOptions} onSelect={onAddFilter} />
      </div>
    );
  }
);
FilterBar.displayName = "FilterBar";

export { FilterChip, AddFilterButton, FilterBar };
