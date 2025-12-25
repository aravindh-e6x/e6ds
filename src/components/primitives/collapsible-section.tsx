import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import * as Collapsible from "@radix-ui/react-collapsible";

export interface CollapsibleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const CollapsibleSection = React.forwardRef<HTMLDivElement, CollapsibleSectionProps>(
  ({ title, defaultOpen = false, open, onOpenChange, children, className, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const handleOpenChange = (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    return (
      <Collapsible.Root
        ref={ref}
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn("border-b border-border", className)}
        {...props}
      >
        <Collapsible.Trigger className="flex items-center w-full py-3 text-left hover:bg-muted/50 transition-colors">
          <ChevronRight
            className={cn(
              "w-4 h-4 mr-2 text-muted-foreground transition-transform",
              isOpen && "rotate-90"
            )}
          />
          <span className="font-medium">{title}</span>
        </Collapsible.Trigger>
        <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
          <div className="pb-4 pl-6">{children}</div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }
);
CollapsibleSection.displayName = "CollapsibleSection";

export { CollapsibleSection };
