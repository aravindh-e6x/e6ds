"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  /** Question text */
  question: string;
  /** Answer text or React node */
  answer: React.ReactNode;
}

export interface FaqSectionProps {
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of FAQ items */
  items: FaqItem[];
  /** Allow multiple items to be open */
  allowMultiple?: boolean;
  /** Default open item indices */
  defaultOpen?: number[];
  /** Visual variant */
  variant?: "default" | "cards" | "minimal";
  /** Additional className */
  className?: string;
}

interface FaqItemComponentProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  variant: FaqSectionProps["variant"];
}

const FaqItemComponent: React.FC<FaqItemComponentProps> = ({
  item,
  isOpen,
  onToggle,
  variant,
}) => {
  return (
    <div
      className={cn(
        "transition-colors",
        variant === "cards" && "rounded-lg border bg-background",
        variant === "default" && "border-b",
        variant === "minimal" && "border-b border-border/50"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between text-left transition-colors",
          variant === "cards" && "p-4 hover:bg-muted/50 rounded-lg",
          variant === "default" && "py-4 hover:text-primary",
          variant === "minimal" && "py-3 hover:text-primary"
        )}
      >
        <span
          className={cn(
            "font-medium pr-4",
            variant === "cards" && "text-base",
            variant === "default" && "text-base",
            variant === "minimal" && "text-sm"
          )}
        >
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "text-muted-foreground",
            variant === "cards" && "px-4 pb-4 text-sm",
            variant === "default" && "pb-4 text-sm",
            variant === "minimal" && "pb-3 text-sm"
          )}
        >
          {item.answer}
        </div>
      </div>
    </div>
  );
};

const FaqSection = React.forwardRef<HTMLDivElement, FaqSectionProps>(
  (
    {
      heading,
      subheading,
      items,
      allowMultiple = false,
      defaultOpen = [],
      variant = "default",
      className,
    },
    ref
  ) => {
    const [openItems, setOpenItems] = React.useState<Set<number>>(
      new Set(defaultOpen)
    );

    const handleToggle = (index: number) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(index);
        }
        return next;
      });
    };

    return (
      <section ref={ref} className={cn("py-16 px-4", className)}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="text-lg text-muted-foreground">{subheading}</p>
              )}
            </div>
          )}

          {/* FAQ items */}
          <div
            className={cn(
              variant === "cards" && "space-y-3",
              variant === "default" && "divide-y-0",
              variant === "minimal" && "divide-y-0"
            )}
          >
            {items.map((item, index) => (
              <FaqItemComponent
                key={index}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => handleToggle(index)}
                variant={variant}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
FaqSection.displayName = "FaqSection";

export { FaqSection };
