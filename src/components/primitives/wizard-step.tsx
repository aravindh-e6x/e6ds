import * as React from "react";
import { ChevronDown, Check, Pencil } from "lucide-react";
import { cn } from "../../lib/utils";
import * as Collapsible from "@radix-ui/react-collapsible";

export type WizardStepStatus = "locked" | "active" | "done";

export interface WizardStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  status: WizardStepStatus;
  children: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}

const WizardStep = React.forwardRef<HTMLDivElement, WizardStepProps>(
  ({ stepNumber, title, description, status, children, onEdit, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(status === "active");

    React.useEffect(() => {
      setIsOpen(status === "active");
    }, [status]);

    const isLocked = status === "locked";
    const isDone = status === "done";
    const isActive = status === "active";

    return (
      <Collapsible.Root
        ref={ref}
        open={isOpen && !isLocked}
        onOpenChange={(open) => !isLocked && setIsOpen(open)}
        className={cn(
          "border border-border rounded-none",
          isLocked && "opacity-50",
          className
        )}
      >
        <Collapsible.Trigger
          className={cn(
            "flex items-center w-full p-4 text-left",
            !isLocked && "hover:bg-muted/50 cursor-pointer",
            isLocked && "cursor-not-allowed"
          )}
          disabled={isLocked}
        >
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-medium",
              isDone && "bg-brand-primary text-primary-foreground",
              isActive && "bg-brand-primary text-primary-foreground",
              isLocked && "bg-muted text-muted-foreground"
            )}
          >
            {isDone ? <Check className="w-4 h-4" /> : stepNumber}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isDone && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            {!isLocked && (
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </Collapsible.Trigger>
        <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
          <div className="p-4 pt-0 border-t border-border">{children}</div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }
);
WizardStep.displayName = "WizardStep";

export interface WizardProps {
  children: React.ReactNode;
  className?: string;
}

const Wizard = React.forwardRef<HTMLDivElement, WizardProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {children}
      </div>
    );
  }
);
Wizard.displayName = "Wizard";

export { Wizard, WizardStep };
