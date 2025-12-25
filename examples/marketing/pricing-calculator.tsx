"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Slider component
export interface PricingSliderProps {
  /** Slider label */
  label: string;
  /** Price per unit display (e.g., "US$0.33 per GB") */
  pricePerUnit?: string;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Current value */
  value: number;
  /** Step increment */
  step?: number;
  /** Format function for the value label */
  formatValue?: (value: number) => string;
  /** Format function for the cost display */
  formatCost?: (value: number) => string;
  /** Calculate cost from value */
  calculateCost?: (value: number) => number;
  /** Whether to show the cost column */
  showCost?: boolean;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Additional className */
  className?: string;
}

const PricingSlider = React.forwardRef<HTMLDivElement, PricingSliderProps>(
  (
    {
      label,
      pricePerUnit,
      min,
      max,
      value,
      step = 1,
      formatValue = (v) => v.toLocaleString(),
      formatCost = (v) => `US$${v.toFixed(2)}`,
      calculateCost,
      showCost = true,
      onChange,
      className,
    },
    ref
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const cost = calculateCost ? calculateCost(value) : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-[120px_1fr_auto_auto] gap-4 items-center py-3",
          className
        )}
      >
        {/* Label */}
        <div className="text-sm font-medium">{label}</div>

        {/* Price per unit */}
        <div className="text-sm text-muted-foreground">
          {pricePerUnit && (
            <span className="font-mono text-xs">{pricePerUnit}</span>
          )}
        </div>

        {/* Slider with value */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <div className="relative flex-1">
            {/* Value tooltip */}
            <div
              className="absolute -top-6 px-2 py-0.5 bg-foreground text-background text-xs rounded whitespace-nowrap transform -translate-x-1/2"
              style={{ left: `${percentage}%` }}
            >
              {formatValue(value)}
            </div>

            {/* Track */}
            <div className="relative h-2 bg-muted rounded-full">
              {/* Filled track */}
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{ width: `${percentage}%` }}
              />
              {/* Input */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange?.(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full shadow-sm pointer-events-none"
                style={{ left: `calc(${percentage}% - 8px)` }}
              />
            </div>
          </div>
        </div>

        {/* Cost */}
        {showCost && (
          <div className="text-sm font-mono text-right min-w-[80px]">
            {calculateCost ? formatCost(cost) : "Included"}
          </div>
        )}
      </div>
    );
  }
);
PricingSlider.displayName = "PricingSlider";

// Select/Dropdown component
export interface PricingSelectOption {
  value: string;
  label: string;
}

export interface PricingSelectProps {
  /** Select label */
  label: string;
  /** Options */
  options: PricingSelectOption[];
  /** Current value */
  value: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Additional className */
  className?: string;
}

const PricingSelect = React.forwardRef<HTMLDivElement, PricingSelectProps>(
  ({ label, options, value, onChange, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const selectedOption = options.find((o) => o.value === value);

    return (
      <div ref={ref} className={cn("relative", className)}>
        <label className="block text-sm text-muted-foreground mb-1">
          {label}
        </label>
        <button
          onClick={() => setOpen(!open)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-background hover:bg-muted/50 transition-colors text-sm"
        >
          <span>{selectedOption?.label || "Select..."}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors",
                  option.value === value && "bg-muted"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
PricingSelect.displayName = "PricingSelect";

// Plan toggle component
export interface PricingPlanToggleProps {
  /** Available plans */
  plans: { id: string; label: string }[];
  /** Selected plan */
  value: string;
  /** Change handler */
  onChange?: (planId: string) => void;
  /** Additional className */
  className?: string;
}

const PricingPlanToggle = React.forwardRef<
  HTMLDivElement,
  PricingPlanToggleProps
>(({ plans, value, onChange, className }, ref) => {
  return (
    <div ref={ref} className={cn("flex", className)}>
      <div className="inline-flex rounded-lg border bg-muted/30 p-1">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onChange?.(plan.id)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              value === plan.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {plan.label}
          </button>
        ))}
      </div>
    </div>
  );
});
PricingPlanToggle.displayName = "PricingPlanToggle";

// Main Calculator component
export interface PricingMetric {
  /** Metric ID */
  id: string;
  /** Display label */
  label: string;
  /** Price per unit text */
  pricePerUnit?: string;
  /** Min slider value */
  min: number;
  /** Max slider value */
  max: number;
  /** Step increment */
  step?: number;
  /** Default value */
  defaultValue: number;
  /** Format the display value */
  formatValue?: (value: number) => string;
  /** Calculate cost from value */
  calculateCost?: (value: number, planId?: string) => number;
}

export interface PricingCalculatorProps {
  /** Calculator title */
  title?: string;
  /** Configuration dropdowns */
  selects?: {
    id: string;
    label: string;
    options: PricingSelectOption[];
    defaultValue: string;
  }[];
  /** Available plans */
  plans?: { id: string; label: string; minCost?: number }[];
  /** Default selected plan */
  defaultPlan?: string;
  /** Pricing metrics with sliders */
  metrics: PricingMetric[];
  /** Currency symbol */
  currency?: string;
  /** Period label */
  period?: string;
  /** Minimum cost note */
  minCostNote?: string;
  /** On values change callback */
  onValuesChange?: (values: Record<string, number>, planId?: string) => void;
  /** Additional className */
  className?: string;
}

const PricingCalculator = React.forwardRef<
  HTMLDivElement,
  PricingCalculatorProps
>(
  (
    {
      title = "Cost calculator",
      selects = [],
      plans,
      defaultPlan,
      metrics,
      currency = "US$",
      period = "/month",
      minCostNote,
      onValuesChange,
      className,
    },
    ref
  ) => {
    const [selectValues, setSelectValues] = React.useState<
      Record<string, string>
    >(() =>
      selects.reduce(
        (acc, s) => ({ ...acc, [s.id]: s.defaultValue }),
        {} as Record<string, string>
      )
    );

    const [selectedPlan, setSelectedPlan] = React.useState(
      defaultPlan || plans?.[0]?.id
    );

    const [metricValues, setMetricValues] = React.useState<
      Record<string, number>
    >(() =>
      metrics.reduce(
        (acc, m) => ({ ...acc, [m.id]: m.defaultValue }),
        {} as Record<string, number>
      )
    );

    const handleMetricChange = (id: string, value: number) => {
      const newValues = { ...metricValues, [id]: value };
      setMetricValues(newValues);
      onValuesChange?.(newValues, selectedPlan);
    };

    const handlePlanChange = (planId: string) => {
      setSelectedPlan(planId);
      onValuesChange?.(metricValues, planId);
    };

    // Calculate total cost
    const totalCost = metrics.reduce((sum, metric) => {
      if (metric.calculateCost) {
        return sum + metric.calculateCost(metricValues[metric.id], selectedPlan);
      }
      return sum;
    }, 0);

    // Get minimum cost for selected plan
    const selectedPlanData = plans?.find((p) => p.id === selectedPlan);
    const minCost = selectedPlanData?.minCost || 0;
    const displayCost = Math.max(totalCost, minCost);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-background p-6",
          className
        )}
      >
        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold mb-6">{title}</h3>
        )}

        {/* Configuration row */}
        {(selects.length > 0 || plans) && (
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b">
            {/* Dropdowns */}
            {selects.map((select) => (
              <PricingSelect
                key={select.id}
                label={select.label}
                options={select.options}
                value={selectValues[select.id]}
                onChange={(v) =>
                  setSelectValues((prev) => ({ ...prev, [select.id]: v }))
                }
                className="min-w-[160px]"
              />
            ))}

            {/* Plan toggle */}
            {plans && plans.length > 0 && (
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Plan
                </label>
                <PricingPlanToggle
                  plans={plans}
                  value={selectedPlan || ""}
                  onChange={handlePlanChange}
                />
              </div>
            )}
          </div>
        )}

        {/* Metrics sliders */}
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[120px_1fr_auto_auto] gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
            <div></div>
            <div></div>
            <div className="min-w-[280px]"></div>
            <div className="text-right min-w-[80px]">Expected cost</div>
          </div>

          {/* Sliders */}
          {metrics.map((metric) => (
            <PricingSlider
              key={metric.id}
              label={metric.label}
              pricePerUnit={metric.pricePerUnit}
              min={metric.min}
              max={metric.max}
              step={metric.step}
              value={metricValues[metric.id]}
              formatValue={metric.formatValue}
              calculateCost={
                metric.calculateCost
                  ? (v) => metric.calculateCost!(v, selectedPlan)
                  : undefined
              }
              onChange={(v) => handleMetricChange(metric.id, v)}
            />
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Estimated cost</span>
            {minCostNote && (
              <span className="text-xs text-muted-foreground ml-2">
                ({minCostNote})
              </span>
            )}
          </div>
          <div className="text-2xl font-bold">
            {currency}
            {displayCost.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">
              {period}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
PricingCalculator.displayName = "PricingCalculator";

export {
  PricingSlider,
  PricingSelect,
  PricingPlanToggle,
  PricingCalculator,
};
