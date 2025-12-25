"use client";

import * as React from "react";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  /** Testimonial quote */
  quote: string;
  /** Author name */
  author: string;
  /** Author role/title */
  role?: string;
  /** Author company */
  company?: string;
  /** Author avatar URL */
  avatar?: string;
  /** Company logo URL */
  companyLogo?: string;
  /** Rating (1-5) */
  rating?: number;
  /** Visual variant */
  variant?: "default" | "outline" | "filled" | "minimal";
  /** Additional className */
  className?: string;
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  (
    {
      quote,
      author,
      role,
      company,
      avatar,
      companyLogo,
      rating,
      variant = "default",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-6 rounded-xl",
          variant === "default" && "bg-muted/30",
          variant === "outline" && "border border-border bg-background",
          variant === "filled" && "bg-primary/5",
          variant === "minimal" && "p-0",
          className
        )}
      >
        {/* Rating */}
        {rating && (
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}

        {/* Quote icon */}
        {variant !== "minimal" && (
          <Quote className="h-8 w-8 text-primary/20 mb-3" />
        )}

        {/* Quote */}
        <blockquote className="text-base leading-relaxed mb-4 flex-1">
          "{quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              {author.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{author}</div>
            {(role || company) && (
              <div className="text-xs text-muted-foreground">
                {role}
                {role && company && " at "}
                {company}
              </div>
            )}
          </div>
          {companyLogo && (
            <img
              src={companyLogo}
              alt={company}
              className="h-6 opacity-50"
            />
          )}
        </div>
      </div>
    );
  }
);
TestimonialCard.displayName = "TestimonialCard";

export interface TestimonialGridProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of testimonials */
  testimonials: TestimonialCardProps[];
  /** Number of columns */
  columns?: 2 | 3;
  /** Visual variant for all cards */
  variant?: TestimonialCardProps["variant"];
  /** Additional className */
  className?: string;
}

const TestimonialGrid = React.forwardRef<HTMLDivElement, TestimonialGridProps>(
  (
    {
      heading,
      subheading,
      testimonials,
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
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                variant={testimonial.variant || variant}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
TestimonialGrid.displayName = "TestimonialGrid";

export { TestimonialCard, TestimonialGrid };
