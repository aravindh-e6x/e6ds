"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import type { DateRange as DayPickerDateRange } from "react-day-picker";

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface DateRangePreset {
  label: string;
  value: string;
  getRange: () => DateRange;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: DateRangePreset[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showPresets?: boolean;
}

const defaultPresets: DateRangePreset[] = [
  {
    label: "Last 7 days",
    value: "7d",
    getRange: () => ({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "Last 14 days",
    value: "14d",
    getRange: () => ({
      from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    value: "30d",
    getRange: () => ({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "Last 90 days",
    value: "90d",
    getRange: () => ({
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
];

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      presets = defaultPresets,
      placeholder = "Select date range",
      className,
      disabled,
      showPresets = true,
    },
    ref
  ) => {
    const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);

    const handlePresetClick = (preset: DateRangePreset) => {
      setSelectedPreset(preset.value);
      onChange?.(preset.getRange());
    };

    const handleCalendarSelect = (range: DayPickerDateRange | undefined) => {
      setSelectedPreset(null);
      onChange?.(range as DateRange | undefined);
    };

    const formatDateRange = () => {
      if (!value?.from) return placeholder;
      if (!value.to) return format(value.from, "MMM d, yyyy");
      return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`;
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedPreset
              ? presets.find((p) => p.value === selectedPreset)?.label
              : formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {showPresets && (
            <div className="border-b p-2">
              <div className="grid grid-cols-2 gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={selectedPreset === preset.value ? "default" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Calendar
            mode="range"
            selected={value as DayPickerDateRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            defaultMonth={value?.from}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker, defaultPresets };
