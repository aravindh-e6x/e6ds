"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  /** Feature icon */
  icon?: LucideIcon;
  /** Custom icon element */
  iconElement?: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Visual variant */
  variant?: "default" | "outline" | "filled" | "ghost";
  /** Icon color/style */
  iconVariant?: "default" | "primary" | "gradient";
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      icon: Icon,
      iconElement,
      title,
      description,
      variant = "default",
      iconVariant = "default",
      clickable = false,
      onClick,
      className,
    },
    ref
  ) => {
    const baseClassName = cn(
      "flex flex-col p-6 rounded-xl text-left transition-all",
      variant === "default" && "bg-muted/30",
      variant === "outline" && "border border-border bg-background hover:border-primary/50",
      variant === "filled" && "bg-primary/5 hover:bg-primary/10",
      variant === "ghost" && "hover:bg-muted/50",
      clickable && "cursor-pointer",
      clickable && variant === "outline" && "hover:shadow-md",
      className
    );

    const content = (
      <>
        {(Icon || iconElement) && (
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              iconVariant === "default" && "bg-muted",
              iconVariant === "primary" && "bg-primary/10",
              iconVariant === "gradient" &&
                "bg-gradient-to-br from-primary/20 to-purple-500/20"
            )}
          >
            {iconElement || (
              Icon && (
                <Icon
                  className={cn(
                    "h-6 w-6",
                    iconVariant === "default" && "text-foreground",
                    iconVariant === "primary" && "text-primary",
                    iconVariant === "gradient" && "text-primary"
                  )}
                />
              )
            )}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </>
    );

    if (clickable) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          className={baseClassName}
        >
          {content}
        </button>
      );
    }

    return (
      <div ref={ref} className={baseClassName}>
        {content}
      </div>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

export interface FeatureGridProps {
  /** Array of features */
  features: FeatureCardProps[];
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Visual variant for all cards */
  variant?: FeatureCardProps["variant"];
  /** Icon variant for all cards */
  iconVariant?: FeatureCardProps["iconVariant"];
  /** Additional className */
  className?: string;
}

const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  (
    {
      features,
      columns = 3,
      variant = "outline",
      iconVariant = "primary",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-6",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
          className
        )}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            {...feature}
            variant={feature.variant || variant}
            iconVariant={feature.iconVariant || iconVariant}
          />
        ))}
      </div>
    );
  }
);
FeatureGrid.displayName = "FeatureGrid";

export { FeatureCard, FeatureGrid };
