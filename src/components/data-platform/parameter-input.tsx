"use client";

import * as React from "react";
import {
  Variable,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  List,
  ChevronDown,
  X,
  Plus,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type ParameterType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "select"
  | "multiselect";

export interface ParameterOption {
  value: string;
  label: string;
}

export interface Parameter {
  id: string;
  name: string;
  type: ParameterType;
  value: unknown;
  defaultValue?: unknown;
  description?: string;
  required?: boolean;
  options?: ParameterOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface ParameterInputProps {
  /** Parameter definition */
  parameter: Parameter;
  /** Current value */
  value?: unknown;
  /** Callback when value changes */
  onChange?: (value: unknown) => void;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether to show label */
  showLabel?: boolean;
  /** Error message */
  error?: string;
  /** Additional className */
  className?: string;
}

const typeIcons: Record<ParameterType, React.ReactNode> = {
  string: <Type className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  boolean: <ToggleLeft className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  datetime: <Calendar className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  multiselect: <List className="h-4 w-4" />,
};

const ParameterInput = React.forwardRef<HTMLDivElement, ParameterInputProps>(
  (
    {
      parameter,
      value,
      onChange,
      disabled = false,
      showLabel = true,
      error,
      className,
    },
    ref
  ) => {
    const currentValue = value ?? parameter.value ?? parameter.defaultValue;

    const renderInput = () => {
      switch (parameter.type) {
        case "string":
          return (
            <input
              type="text"
              value={(currentValue as string) || ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={parameter.placeholder || `Enter ${parameter.name}`}
              disabled={disabled}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-destructive"
              )}
            />
          );

        case "number":
          return (
            <input
              type="number"
              value={(currentValue as number) ?? ""}
              onChange={(e) =>
                onChange?.(e.target.value ? Number(e.target.value) : undefined)
              }
              min={parameter.min}
              max={parameter.max}
              placeholder={parameter.placeholder || `Enter ${parameter.name}`}
              disabled={disabled}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-destructive"
              )}
            />
          );

        case "boolean":
          return (
            <button
              type="button"
              onClick={() => onChange?.(!currentValue)}
              disabled={disabled}
              className={cn(
                "relative w-10 h-6 rounded-full transition-colors",
                currentValue ? "bg-primary" : "bg-muted",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                  currentValue ? "left-5" : "left-1"
                )}
              />
            </button>
          );

        case "date":
          return (
            <input
              type="date"
              value={(currentValue as string) || ""}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-destructive"
              )}
            />
          );

        case "datetime":
          return (
            <input
              type="datetime-local"
              value={(currentValue as string) || ""}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-destructive"
              )}
            />
          );

        case "select":
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    error && "border-destructive"
                  )}
                  disabled={disabled}
                >
                  {parameter.options?.find((o) => o.value === currentValue)
                    ?.label ||
                    parameter.placeholder ||
                    "Select..."}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-48">
                {parameter.options?.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onChange?.(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );

        case "multiselect": {
          const selectedValues = (currentValue as string[]) || [];
          return (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val) => {
                  const option = parameter.options?.find(
                    (o) => o.value === val
                  );
                  return (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                    >
                      {option?.label || val}
                      <button
                        type="button"
                        onClick={() =>
                          onChange?.(selectedValues.filter((v) => v !== val))
                        }
                        disabled={disabled}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className={error ? "border-destructive" : ""}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {parameter.options
                    ?.filter((o) => !selectedValues.includes(o.value))
                    .map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() =>
                          onChange?.([...selectedValues, option.value])
                        }
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }

        default:
          return null;
      }
    };

    return (
      <div ref={ref} className={cn("space-y-1.5", className)}>
        {showLabel && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {typeIcons[parameter.type]}
            </span>
            <label className="text-sm font-medium">
              {parameter.name}
              {parameter.required && (
                <span className="text-destructive ml-0.5">*</span>
              )}
            </label>
            {parameter.description && (
              <span className="text-muted-foreground" title={parameter.description}>
                <Info className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        )}
        {renderInput()}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
ParameterInput.displayName = "ParameterInput";

// Parameter panel for multiple parameters
export interface ParameterPanelProps {
  parameters: Parameter[];
  values: Record<string, unknown>;
  onChange?: (values: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  className?: string;
}

const ParameterPanel = React.forwardRef<HTMLDivElement, ParameterPanelProps>(
  ({ parameters, values, onChange, errors = {}, disabled = false, className }, ref) => {
    const handleChange = (id: string, value: unknown) => {
      onChange?.({ ...values, [id]: value });
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Variable className="h-4 w-4" />
          Parameters
        </div>
        {parameters.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No parameters defined
          </div>
        ) : (
          <div className="space-y-4">
            {parameters.map((param) => (
              <ParameterInput
                key={param.id}
                parameter={param}
                value={values[param.id]}
                onChange={(value) => handleChange(param.id, value)}
                error={errors[param.id]}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
ParameterPanel.displayName = "ParameterPanel";

export { ParameterInput, ParameterPanel };
