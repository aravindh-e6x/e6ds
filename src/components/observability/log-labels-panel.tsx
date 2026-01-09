"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface LogLabel {
  key: string;
  values: string[];
}

export interface LogLabelsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  labels: LogLabel[];
  onLabelClick?: (key: string, value: string) => void;
}

const LogLabelsPanel = React.forwardRef<HTMLDivElement, LogLabelsPanelProps>(
  ({ className, labels, onLabelClick, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

    const toggle = (key: string) => {
      setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div ref={ref} className={cn("border bg-card p-3 space-y-2", className)} {...props}>
        <h4 className="text-sm font-medium">Labels</h4>
        {labels.map((label) => (
          <div key={label.key} className="text-sm">
            <button
              onClick={() => toggle(label.key)}
              className="flex items-center gap-1 w-full text-left hover:bg-muted px-1 py-0.5"
            >
              <ChevronDown
                className={cn("h-3 w-3 transition-transform", !expanded[label.key] && "-rotate-90")}
              />
              <span className="font-medium">{label.key}</span>
              <span className="text-muted-foreground ml-auto">{label.values.length}</span>
            </button>
            {expanded[label.key] && (
              <div className="pl-5 space-y-0.5">
                {label.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => onLabelClick?.(label.key, value)}
                    className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted px-1 py-0.5 truncate"
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);
LogLabelsPanel.displayName = "LogLabelsPanel";

export { LogLabelsPanel };
