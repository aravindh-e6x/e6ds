"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, Play } from "lucide-react";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";

export interface LogQueryInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  loading?: boolean;
}

const LogQueryInput = React.forwardRef<HTMLDivElement, LogQueryInputProps>(
  ({ className, value, onChange, onSubmit, placeholder = "Search logs...", loading, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") onSubmit();
    };

    return (
      <div ref={ref} className={cn("flex gap-2", className)} {...props}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-9 font-mono text-sm"
          />
        </div>
        <Button onClick={onSubmit} disabled={loading}>
          <Play className="h-4 w-4 mr-1" />
          Run
        </Button>
      </div>
    );
  }
);
LogQueryInput.displayName = "LogQueryInput";

export { LogQueryInput };
