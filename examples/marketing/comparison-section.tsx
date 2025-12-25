"use client";

import * as React from "react";
import { Check, X, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComparisonItem {
  /** Item label */
  label: string;
  /** Optional description */
  description?: string;
}

export interface ComparisonColumnProps {
  /** Column title */
  title: string;
  /** Whether this is the highlighted/preferred option */
  highlighted?: boolean;
  /** Items in the column */
  items: ComparisonItem[];
  /** Visual style */
  variant?: "positive" | "negative" | "neutral";
}

export interface ComparisonSectionProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Left column (typically "without" or competitor) */
  leftColumn: ComparisonColumnProps;
  /** Right column (typically "with" or your product) */
  rightColumn: ComparisonColumnProps;
  /** Additional className */
  className?: string;
}

const ComparisonColumn: React.FC<
  ComparisonColumnProps & { className?: string }
> = ({ title, highlighted = false, items, variant = "neutral", className }) => {
  const getIcon = () => {
    switch (variant) {
      case "positive":
        return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "negative":
        return <X className="h-4 w-4 text-red-500 dark:text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6",
        highlighted
          ? "bg-primary/5 border-2 border-primary"
          : "bg-muted/30 border border-border",
        className
      )}
    >
      <h3
        className={cn(
          "text-lg font-semibold mb-4",
          highlighted && "text-primary"
        )}
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0">{getIcon()}</span>
            <div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ComparisonSection = React.forwardRef<
  HTMLDivElement,
  ComparisonSectionProps
>(({ heading, subheading, leftColumn, rightColumn, className }, ref) => {
  return (
    <section ref={ref} className={cn("py-16 px-4", className)}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Comparison columns */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <ComparisonColumn {...leftColumn} />
          <ComparisonColumn {...rightColumn} highlighted />
        </div>
      </div>
    </section>
  );
});
ComparisonSection.displayName = "ComparisonSection";

// Pipeline comparison (visual flow comparison like on Laminar)
export interface PipelineStep {
  /** Step label */
  label: string;
  /** Optional sublabel */
  sublabel?: string;
}

export interface PipelineComparisonProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Left pipeline title */
  leftTitle: string;
  /** Left pipeline steps */
  leftSteps: PipelineStep[];
  /** Left pipeline summary items */
  leftSummary?: string[];
  /** Right pipeline title */
  rightTitle: string;
  /** Right pipeline steps */
  rightSteps: PipelineStep[];
  /** Right pipeline summary items */
  rightSummary?: string[];
  /** Additional className */
  className?: string;
}

const PipelineComparison = React.forwardRef<
  HTMLDivElement,
  PipelineComparisonProps
>(
  (
    {
      heading,
      subheading,
      leftTitle,
      leftSteps,
      leftSummary,
      rightTitle,
      rightSteps,
      rightSummary,
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

          {/* Pipeline comparison */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left pipeline */}
            <div className="rounded-xl border bg-muted/20 p-6">
              <h3 className="text-lg font-semibold mb-6 text-muted-foreground">
                {leftTitle}
              </h3>
              <div className="flex flex-col items-center gap-2">
                {leftSteps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="w-full px-4 py-3 bg-background border rounded-lg text-center">
                      <div className="text-sm font-medium">{step.label}</div>
                      {step.sublabel && (
                        <div className="text-xs text-muted-foreground">
                          {step.sublabel}
                        </div>
                      )}
                    </div>
                    {index < leftSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {leftSummary && leftSummary.length > 0 && (
                <div className="mt-6 pt-4 border-t space-y-1">
                  {leftSummary.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <X className="h-3 w-3 text-red-500 dark:text-red-400" />
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right pipeline */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
              <h3 className="text-lg font-semibold mb-6 text-primary">
                {rightTitle}
              </h3>
              <div className="flex flex-col items-center gap-2">
                {rightSteps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={cn(
                        "w-full px-4 py-3 rounded-lg text-center",
                        index === Math.floor(rightSteps.length / 2)
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border"
                      )}
                    >
                      <div className="text-sm font-medium">{step.label}</div>
                      {step.sublabel && (
                        <div
                          className={cn(
                            "text-xs",
                            index === Math.floor(rightSteps.length / 2)
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.sublabel}
                        </div>
                      )}
                    </div>
                    {index < rightSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-primary rotate-90" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {rightSummary && rightSummary.length > 0 && (
                <div className="mt-6 pt-4 border-t border-primary/20 space-y-1">
                  {rightSummary.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
);
PipelineComparison.displayName = "PipelineComparison";

export { ComparisonSection, ComparisonColumn, PipelineComparison };
