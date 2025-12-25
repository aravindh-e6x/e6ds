"use client";

import * as React from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  iconSize?: number;
}

const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  (
    {
      className,
      children,
      showIcon = true,
      iconPosition = "right",
      iconSize = 14,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1 text-primary hover:underline underline-offset-4",
          className
        )}
        {...props}
      >
        {showIcon && iconPosition === "left" && (
          <ExternalLinkIcon style={{ width: iconSize, height: iconSize }} />
        )}
        {children}
        {showIcon && iconPosition === "right" && (
          <ExternalLinkIcon style={{ width: iconSize, height: iconSize }} />
        )}
      </a>
    );
  }
);
ExternalLink.displayName = "ExternalLink";

export { ExternalLink };
