"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface VariableDropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const VariableDropdown = React.forwardRef<HTMLDivElement, VariableDropdownProps>(
  ({ className, label, value, options, onChange, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("inline-flex items-center gap-2", className)} {...props}>
        <span className="text-sm text-muted-foreground">{label}</span>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-8 w-auto min-w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
VariableDropdown.displayName = "VariableDropdown";

export { VariableDropdown };
