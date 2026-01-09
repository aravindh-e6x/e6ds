"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertStateIndicator, AlertState } from "../primitives/alert-state-indicator";

export interface Alert {
  id: string;
  name: string;
  state: AlertState;
  message?: string;
  timestamp: string;
}

export interface AlertListProps extends React.HTMLAttributes<HTMLDivElement> {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

const AlertList = React.forwardRef<HTMLDivElement, AlertListProps>(
  ({ className, alerts, onAlertClick, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border bg-card divide-y", className)} {...props}>
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">No alerts</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onAlertClick?.(alert)}
              className={cn(
                "p-3 flex items-center gap-3",
                onAlertClick && "cursor-pointer hover:bg-muted/50"
              )}
            >
              <AlertStateIndicator state={alert.state} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{alert.name}</div>
                {alert.message && (
                  <div className="text-xs text-muted-foreground truncate">{alert.message}</div>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{alert.timestamp}</span>
            </div>
          ))
        )}
      </div>
    );
  }
);
AlertList.displayName = "AlertList";

export { AlertList };
