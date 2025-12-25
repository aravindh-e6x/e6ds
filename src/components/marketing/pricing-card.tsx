"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";

export interface PricingFeature {
  /** Feature text */
  text: string;
  /** Whether feature is included */
  included: boolean;
  /** Optional tooltip/note */
  note?: string;
}

export interface PricingCardProps {
  /** Plan name */
  name: string;
  /** Plan description */
  description?: string;
  /** Price amount */
  price: string;
  /** Price period (e.g., "/month", "/year") */
  period?: string;
  /** Original price (for showing discount) */
  originalPrice?: string;
  /** Features list */
  features: PricingFeature[];
  /** CTA button text */
  ctaText?: string;
  /** CTA click handler */
  onCta?: () => void;
  /** Whether this is the highlighted/recommended plan */
  highlighted?: boolean;
  /** Badge text (e.g., "Most Popular", "Best Value") */
  badge?: string;
  /** Visual variant */
  variant?: "default" | "outline" | "filled";
  /** Additional className */
  className?: string;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      name,
      description,
      price,
      period = "/month",
      originalPrice,
      features,
      ctaText = "Get Started",
      onCta,
      highlighted = false,
      badge,
      variant = "outline",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col rounded-xl p-6",
          variant === "default" && "bg-muted/30",
          variant === "outline" && "border bg-background",
          variant === "filled" && "bg-primary/5",
          highlighted && "border-2 border-primary shadow-lg",
          className
        )}
      >
        {/* Badge */}
        {badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              {badge}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-4xl font-bold">{price}</span>
            {period && (
              <span className="text-muted-foreground">{period}</span>
            )}
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onCta}
          variant={highlighted ? "default" : "outline"}
          className="w-full mb-6"
        >
          {ctaText}
        </Button>

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground/50 shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground"
                )}
              >
                {feature.text}
                {feature.note && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({feature.note})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
PricingCard.displayName = "PricingCard";

export interface PricingGridProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of pricing plans */
  plans: PricingCardProps[];
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Additional className */
  className?: string;
}

const PricingGrid = React.forwardRef<HTMLDivElement, PricingGridProps>(
  (
    {
      heading,
      subheading,
      plans,
      columns = 3,
      className,
    },
    ref
  ) => {
    return (
      <section ref={ref} className={cn("py-16 px-4", className)}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {subheading}
                </p>
              )}
            </div>
          )}

          {/* Grid */}
          <div
            className={cn(
              "grid gap-6 items-stretch",
              columns === 2 && "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto",
              columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
PricingGrid.displayName = "PricingGrid";

export { PricingCard, PricingGrid };
