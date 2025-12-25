"use client";

import { XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceStatus {
  name: string;
  status: "healthy" | "unhealthy";
  error?: string;
}

export interface StatusBarProps {
  /** Array of service statuses to display */
  services?: ServiceStatus[];
  /** Whether the status is loading */
  loading?: boolean;
  /** Error message if status couldn't be fetched */
  error?: string | null;
  /** Custom class */
  className?: string;
}

export function StatusBar({
  services = [],
  loading = false,
  error = null,
  className,
}: StatusBarProps) {
  if (loading && services.length === 0) {
    return (
      <div
        className={cn(
          "h-12 border-b border-border bg-card flex items-center justify-center",
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-12 border-b border-border bg-card flex items-center justify-end px-6 gap-4",
        className
      )}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Services
      </span>
      <div className="flex items-center gap-3">
        {services.map((service) => (
          <div
            key={service.name}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5",
              service.status === "healthy"
                ? "bg-green-500/15 border border-green-500/40"
                : "bg-red-500/15 border border-red-500/40"
            )}
          >
            {service.status === "healthy" ? (
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                service.status === "healthy"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {service.name}
            </span>
          </div>
        ))}
      </div>
      {error && (
        <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
      )}
    </div>
  );
}
