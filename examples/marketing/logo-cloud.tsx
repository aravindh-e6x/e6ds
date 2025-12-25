"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoItem {
  /** Logo image URL or SVG */
  logo: React.ReactNode;
  /** Company/brand name (for alt text) */
  name: string;
  /** Optional link URL */
  href?: string;
}

export interface LogoCloudProps {
  /** Section heading */
  heading?: string;
  /** Array of logos */
  logos: LogoItem[];
  /** Visual variant */
  variant?: "default" | "minimal" | "card";
  /** Size of logos */
  size?: "sm" | "md" | "lg";
  /** Whether to animate (marquee effect) */
  animated?: boolean;
  /** Additional className */
  className?: string;
}

const LogoCloud = React.forwardRef<HTMLDivElement, LogoCloudProps>(
  (
    {
      heading,
      logos,
      variant = "default",
      size = "md",
      animated = false,
      className,
    },
    ref
  ) => {
    const logoItems = animated ? [...logos, ...logos] : logos;

    return (
      <section
        ref={ref}
        className={cn(
          "py-12 px-4 overflow-hidden",
          variant === "card" && "bg-muted/30 rounded-xl",
          className
        )}
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          {heading && (
            <p className="text-center text-sm text-muted-foreground mb-8">
              {heading}
            </p>
          )}

          {/* Logo grid/row */}
          <div
            className={cn(
              "flex items-center justify-center gap-8 md:gap-12",
              animated && "animate-marquee",
              !animated && "flex-wrap"
            )}
          >
            {logoItems.map((item, index) => {
              const logoContent = (
                <div
                  className={cn(
                    "flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all",
                    size === "sm" && "h-6",
                    size === "md" && "h-8",
                    size === "lg" && "h-10"
                  )}
                >
                  {item.logo}
                </div>
              );

              if (item.href) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="shrink-0"
                  >
                    {logoContent}
                  </a>
                );
              }

              return (
                <div key={index} className="shrink-0" aria-label={item.name}>
                  {logoContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);
LogoCloud.displayName = "LogoCloud";

export { LogoCloud };
