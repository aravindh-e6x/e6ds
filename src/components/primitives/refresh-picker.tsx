"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface RefreshPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const options = [
  { label: "Off", value: "off" },
  { label: "5s", value: "5s" },
  { label: "10s", value: "10s" },
  { label: "30s", value: "30s" },
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
];

const RefreshPicker = React.forwardRef<HTMLDivElement, RefreshPickerProps>(
  ({ className, value, onChange, onRefresh, loading, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("inline-flex items-center gap-1", className)} {...props}>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-muted rounded disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[80px]">
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
RefreshPicker.displayName = "RefreshPicker";

export { RefreshPicker };
