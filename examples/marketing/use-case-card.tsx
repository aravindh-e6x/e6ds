"use client";

import * as React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UseCaseCardProps {
  /** Use case icon */
  icon?: LucideIcon;
  /** Custom icon element */
  iconElement?: React.ReactNode;
  /** Use case title */
  title: string;
  /** Use case description */
  description: string;
  /** Link URL */
  href?: string;
  /** Link text */
  linkText?: string;
  /** Click handler */
  onClick?: () => void;
  /** Visual variant */
  variant?: "default" | "outline" | "filled";
  /** Additional className */
  className?: string;
}

const UseCaseCard = React.forwardRef<HTMLDivElement, UseCaseCardProps>(
  (
    {
      icon: Icon,
      iconElement,
      title,
      description,
      href,
      linkText = "Learn more",
      onClick,
      variant = "outline",
      className,
    },
    ref
  ) => {
    const content = (
      <>
        {/* Icon */}
        {(Icon || iconElement) && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 shrink-0">
            {iconElement || (Icon && <Icon className="h-5 w-5 text-primary" />)}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>

          {/* Link */}
          {(href || onClick) && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
              {linkText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </>
    );

    const baseClassName = cn(
      "group flex flex-col p-6 rounded-xl transition-all",
      variant === "default" && "bg-muted/30 hover:bg-muted/50",
      variant === "outline" &&
        "border border-border bg-background hover:border-primary/50 hover:shadow-md",
      variant === "filled" && "bg-primary/5 hover:bg-primary/10",
      (href || onClick) && "cursor-pointer",
      className
    );

    if (href) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={baseClassName}>
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={baseClassName}
        role={onClick ? "button" : undefined}
      >
        {content}
      </div>
    );
  }
);
UseCaseCard.displayName = "UseCaseCard";

export interface UseCaseGridProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of use cases */
  useCases: UseCaseCardProps[];
  /** Number of columns */
  columns?: 2 | 3;
  /** Visual variant for all cards */
  variant?: UseCaseCardProps["variant"];
  /** Additional className */
  className?: string;
}

const UseCaseGrid = React.forwardRef<HTMLDivElement, UseCaseGridProps>(
  (
    {
      heading,
      subheading,
      useCases,
      columns = 3,
      variant = "outline",
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
              "grid gap-6",
              columns === 2 && "grid-cols-1 md:grid-cols-2",
              columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {useCases.map((useCase, index) => (
              <UseCaseCard
                key={index}
                {...useCase}
                variant={useCase.variant || variant}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
UseCaseGrid.displayName = "UseCaseGrid";

export { UseCaseCard, UseCaseGrid };
