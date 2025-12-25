"use client";

import * as React from "react";
import { WifiOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConnectionBannerProps {
  /** Whether the connection is disconnected */
  isDisconnected: boolean;
  /** Message to display when disconnected */
  message?: string;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Custom class */
  className?: string;
}

export function ConnectionBanner({
  isDisconnected,
  message = "Unable to connect to the backend. Please ensure the server is running.",
  onDismiss,
  className,
}: ConnectionBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);

  React.useEffect(() => {
    // Reset dismissed state when connection status changes
    if (!isDisconnected) {
      setIsDismissed(false);
    }
  }, [isDisconnected]);

  if (!isDisconnected || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
