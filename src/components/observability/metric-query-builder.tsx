"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";

export interface MetricFilter {
  label: string;
  operator: string;
  value: string;
}

export interface MetricQueryBuilderProps extends React.HTMLAttributes<HTMLDivElement> {
  metric: string;
  onMetricChange: (metric: string) => void;
  metrics: string[];
  filters: MetricFilter[];
  onFiltersChange: (filters: MetricFilter[]) => void;
  labels: string[];
}

const operators = ["=", "!=", "=~", "!~"];

const MetricQueryBuilder = React.forwardRef<HTMLDivElement, MetricQueryBuilderProps>(
  ({ className, metric, onMetricChange, metrics, filters, onFiltersChange, labels, ...props }, ref) => {
    const addFilter = () => {
      onFiltersChange([...filters, { label: labels[0] || "", operator: "=", value: "" }]);
    };

    const updateFilter = (index: number, field: keyof MetricFilter, value: string) => {
      const updated = [...filters];
      updated[index] = { ...updated[index], [field]: value };
      onFiltersChange(updated);
    };

    const removeFilter = (index: number) => {
      onFiltersChange(filters.filter((_, i) => i !== index));
    };

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        <Select value={metric} onValueChange={onMetricChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.map((filter, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Select value={filter.label} onValueChange={(v) => updateFilter(index, "label", v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {labels.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filter.operator} onValueChange={(v) => updateFilter(index, "operator", v)}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>{op}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={filter.value}
              onChange={(e) => updateFilter(index, "value", e.target.value)}
              placeholder="value"
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => removeFilter(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={addFilter}>
          <Plus className="h-4 w-4 mr-1" /> Add filter
        </Button>
      </div>
    );
  }
);
MetricQueryBuilder.displayName = "MetricQueryBuilder";

export { MetricQueryBuilder };
