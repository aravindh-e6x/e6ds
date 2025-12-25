"use client";

import * as React from "react";
import { Label } from "@/components/primitives/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, description, error, required, children, className, id }, ref) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(error && "text-destructive")}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>, {
              id: fieldId,
              "aria-describedby": description || error ? `${fieldId}-description` : undefined,
              "aria-invalid": !!error,
            })
          : children}
        {(description || error) && (
          <p
            id={`${fieldId}-description`}
            className={cn(
              "text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || description}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
