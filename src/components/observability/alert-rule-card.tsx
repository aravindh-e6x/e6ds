"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertStateIndicator, AlertState } from "../primitives/alert-state-indicator";

export interface AlertRuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  state: AlertState;
  query: string;
  lastEvaluation?: string;
  labels?: Record<string, string>;
}

const AlertRuleCard = React.forwardRef<HTMLDivElement, AlertRuleCardProps>(
  ({ className, name, state, query, lastEvaluation, labels, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border bg-card p-4", className)} {...props}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className="font-medium truncate">{name}</h4>
            <code className="text-xs text-muted-foreground block truncate">{query}</code>
          </div>
          <AlertStateIndicator state={state} />
        </div>
        {(lastEvaluation || labels) && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            {lastEvaluation && <span>Last: {lastEvaluation}</span>}
            {labels && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {Object.entries(labels).map(([k, v]) => (
                  <span key={k} className="px-1.5 py-0.5 bg-muted rounded">{k}={v}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
AlertRuleCard.displayName = "AlertRuleCard";

export { AlertRuleCard };
