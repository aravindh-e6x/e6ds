"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface TimeRangeOption {
  label: string;
  value: string;
}

export interface TimeRangeSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  options?: TimeRangeOption[];
}

const defaultOptions: TimeRangeOption[] = [
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const TimeRangeSelector = React.forwardRef<HTMLDivElement, TimeRangeSelectorProps>(
  ({ className, value, onChange, options = defaultOptions, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("inline-flex", className)} {...props}>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[160px]">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
TimeRangeSelector.displayName = "TimeRangeSelector";

export { TimeRangeSelector };
