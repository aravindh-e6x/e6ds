"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";

export interface CtaSectionProps {
  /** Main heading */
  heading: string;
  /** Subheading/description */
  subheading?: string;
  /** Primary CTA button text */
  primaryCta: string;
  /** Primary CTA click handler */
  onPrimaryCta?: () => void;
  /** Secondary CTA button text */
  secondaryCta?: string;
  /** Secondary CTA click handler */
  onSecondaryCta?: () => void;
  /** Trust badge text (e.g., "Trusted by 1000+ teams") */
  trustBadge?: string;
  /** Visual variant */
  variant?: "default" | "gradient" | "dark" | "primary";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

const CtaSection = React.forwardRef<HTMLDivElement, CtaSectionProps>(
  (
    {
      heading,
      subheading,
      primaryCta,
      onPrimaryCta,
      secondaryCta,
      onSecondaryCta,
      trustBadge,
      variant = "gradient",
      size = "md",
      className,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          // Padding based on size
          size === "sm" && "py-12 px-4",
          size === "md" && "py-16 md:py-20 px-4",
          size === "lg" && "py-20 md:py-28 px-4",
          // Variants
          variant === "default" && "bg-muted/50",
          variant === "gradient" &&
            "bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10",
          variant === "dark" && "bg-foreground text-background",
          variant === "primary" && "bg-primary text-primary-foreground",
          className
        )}
      >
        {/* Background decoration for gradient variant */}
        {variant === "gradient" && (
          <>
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </>
        )}

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2
            className={cn(
              "font-bold mb-4",
              size === "sm" && "text-2xl md:text-3xl",
              size === "md" && "text-3xl md:text-4xl",
              size === "lg" && "text-4xl md:text-5xl"
            )}
          >
            {heading}
          </h2>

          {/* Subheading */}
          {subheading && (
            <p
              className={cn(
                "mb-8",
                variant === "dark" && "text-background/80",
                variant === "primary" && "text-primary-foreground/80",
                variant !== "dark" &&
                  variant !== "primary" &&
                  "text-muted-foreground",
                size === "sm" && "text-base",
                size === "md" && "text-lg",
                size === "lg" && "text-xl"
              )}
            >
              {subheading}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size={size === "sm" ? "default" : "lg"}
              variant={
                variant === "dark" || variant === "primary"
                  ? "secondary"
                  : "default"
              }
              onClick={onPrimaryCta}
              className="group"
            >
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            {secondaryCta && (
              <Button
                size={size === "sm" ? "default" : "lg"}
                variant={
                  variant === "dark" || variant === "primary"
                    ? "outline"
                    : "outline"
                }
                onClick={onSecondaryCta}
                className={cn(
                  (variant === "dark" || variant === "primary") &&
                    "border-current hover:bg-background/10"
                )}
              >
                {secondaryCta}
              </Button>
            )}
          </div>

          {/* Trust badge */}
          {trustBadge && (
            <p
              className={cn(
                "mt-6 text-sm",
                variant === "dark" && "text-background/60",
                variant === "primary" && "text-primary-foreground/60",
                variant !== "dark" &&
                  variant !== "primary" &&
                  "text-muted-foreground"
              )}
            >
              {trustBadge}
            </p>
          )}
        </div>
      </section>
    );
  }
);
CtaSection.displayName = "CtaSection";

export { CtaSection };
