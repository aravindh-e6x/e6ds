"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";

export interface HeroSectionProps {
  /** Main headline text */
  headline: string;
  /** Optional highlighted/gradient portion of headline */
  highlightedText?: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Primary CTA button text */
  primaryCta?: string;
  /** Primary CTA click handler */
  onPrimaryCta?: () => void;
  /** Secondary CTA button text */
  secondaryCta?: string;
  /** Secondary CTA click handler */
  onSecondaryCta?: () => void;
  /** Optional badge/tag above headline */
  badge?: string;
  /** Background variant */
  variant?: "default" | "gradient" | "dark";
  /** Text alignment */
  align?: "left" | "center";
  /** Additional className */
  className?: string;
  /** Children for custom content below CTAs */
  children?: React.ReactNode;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      headline,
      highlightedText,
      subtitle,
      primaryCta,
      onPrimaryCta,
      secondaryCta,
      onSecondaryCta,
      badge,
      variant = "default",
      align = "center",
      className,
      children,
    },
    ref
  ) => {
    // Split headline to insert highlighted text
    const renderHeadline = () => {
      if (!highlightedText) {
        return headline;
      }

      const parts = headline.split(highlightedText);
      if (parts.length === 1) {
        return (
          <>
            {headline}{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {highlightedText}
            </span>
          </>
        );
      }

      return (
        <>
          {parts[0]}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {highlightedText}
          </span>
          {parts[1]}
        </>
      );
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden",
          variant === "gradient" &&
            "bg-gradient-to-br from-background via-background to-primary/5",
          variant === "dark" && "bg-foreground text-background",
          className
        )}
      >
        {/* Background decoration */}
        {variant === "gradient" && (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </>
        )}

        <div
          className={cn(
            "relative max-w-5xl mx-auto",
            align === "center" && "text-center",
            align === "left" && "text-left"
          )}
        >
          {/* Badge */}
          {badge && (
            <div
              className={cn(
                "inline-flex items-center mb-6",
                align === "center" && "justify-center"
              )}
            >
              <span className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                {badge}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {renderHeadline()}
          </h1>

          {/* Subtitle */}
          <p
            className={cn(
              "text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div
              className={cn(
                "flex flex-wrap gap-4",
                align === "center" && "justify-center",
                align === "left" && "justify-start"
              )}
            >
              {primaryCta && (
                <Button size="lg" onClick={onPrimaryCta} className="group">
                  {primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
              {secondaryCta && (
                <Button size="lg" variant="outline" onClick={onSecondaryCta}>
                  {secondaryCta}
                </Button>
              )}
            </div>
          )}

          {/* Custom children content */}
          {children && <div className="mt-12">{children}</div>}
        </div>
      </section>
    );
  }
);
HeroSection.displayName = "HeroSection";

export { HeroSection };
