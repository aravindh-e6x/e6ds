"use client";

import * as React from "react";
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  Settings2,
  X,
  Plus,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type ChartType = "bar" | "line" | "area" | "pie" | "scatter";

export interface ChartColumn {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

export interface ChartAxisConfig {
  columnId: string;
  aggregation?: "sum" | "avg" | "count" | "min" | "max" | "none";
  label?: string;
}

export interface ChartConfig {
  type: ChartType;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig[];
  groupBy?: string;
  colorScheme?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  title?: string;
}

export interface ChartBuilderProps {
  /** Available columns */
  columns: ChartColumn[];
  /** Current chart configuration */
  config: ChartConfig;
  /** Callback when config changes */
  onConfigChange?: (config: ChartConfig) => void;
  /** Preview component */
  preview?: React.ReactNode;
  /** Display mode */
  mode?: "sidebar" | "inline" | "dialog";
  /** Additional className */
  className?: string;
}

const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
  { type: "bar", icon: <BarChart3 className="h-4 w-4" />, label: "Bar" },
  { type: "line", icon: <LineChart className="h-4 w-4" />, label: "Line" },
  { type: "area", icon: <AreaChart className="h-4 w-4" />, label: "Area" },
  { type: "pie", icon: <PieChart className="h-4 w-4" />, label: "Pie" },
  { type: "scatter", icon: <ScatterChart className="h-4 w-4" />, label: "Scatter" },
];

const aggregations = [
  { value: "none", label: "None" },
  { value: "sum", label: "Sum" },
  { value: "avg", label: "Average" },
  { value: "count", label: "Count" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
];

interface AxisSelectorProps {
  label: string;
  columns: ChartColumn[];
  value?: ChartAxisConfig;
  onChange: (value: ChartAxisConfig | undefined) => void;
  showAggregation?: boolean;
  allowRemove?: boolean;
}

const AxisSelector: React.FC<AxisSelectorProps> = ({
  label,
  columns,
  value,
  onChange,
  showAggregation = true,
  allowRemove = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {allowRemove && value && (
          <button
            onClick={() => onChange(undefined)}
            className="p-0.5 hover:bg-muted rounded"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 justify-between">
              {value?.columnId
                ? columns.find((c) => c.id === value.columnId)?.name || "Select"
                : "Select column"}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {columns.map((col) => (
              <DropdownMenuItem
                key={col.id}
                onClick={() =>
                  onChange({
                    columnId: col.id,
                    aggregation: value?.aggregation || "none",
                  })
                }
              >
                <span className="flex-1">{col.name}</span>
                <span className="text-xs text-muted-foreground">{col.type}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showAggregation && value?.columnId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {aggregations.find((a) => a.value === value.aggregation)?.label ||
                  "Agg"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {aggregations.map((agg) => (
                <DropdownMenuItem
                  key={agg.value}
                  onClick={() =>
                    onChange({
                      ...value,
                      aggregation: agg.value as ChartAxisConfig["aggregation"],
                    })
                  }
                >
                  {agg.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

const ChartBuilder = React.forwardRef<HTMLDivElement, ChartBuilderProps>(
  (
    {
      columns,
      config,
      onConfigChange,
      preview,
      mode = "sidebar",
      className,
    },
    ref
  ) => {
    const updateConfig = (updates: Partial<ChartConfig>) => {
      onConfigChange?.({ ...config, ...updates });
    };

    const addYAxis = () => {
      const newAxis: ChartAxisConfig = { columnId: "", aggregation: "none" };
      updateConfig({ yAxis: [...(config.yAxis || []), newAxis] });
    };

    const updateYAxis = (index: number, value: ChartAxisConfig | undefined) => {
      const newYAxis = [...(config.yAxis || [])];
      if (value) {
        newYAxis[index] = value;
      } else {
        newYAxis.splice(index, 1);
      }
      updateConfig({ yAxis: newYAxis });
    };

    const configPanel = (
      <div className="space-y-6">
        {/* Chart Type */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Chart Type</span>
          <div className="grid grid-cols-5 gap-1">
            {chartTypes.map((ct) => (
              <Button
                key={ct.type}
                variant={config.type === ct.type ? "default" : "outline"}
                size="sm"
                className="flex flex-col h-auto py-2 gap-1"
                onClick={() => updateConfig({ type: ct.type })}
              >
                {ct.icon}
                <span className="text-xs">{ct.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* X Axis */}
        <AxisSelector
          label="X-Axis"
          columns={columns}
          value={config.xAxis}
          onChange={(value) => updateConfig({ xAxis: value })}
          showAggregation={false}
        />

        {/* Y Axis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Y-Axis</span>
            <Button variant="ghost" size="sm" onClick={addYAxis}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {(config.yAxis || []).map((axis, index) => (
            <div key={index} className="flex items-start gap-2">
              <GripVertical className="h-4 w-4 mt-2 text-muted-foreground cursor-grab" />
              <div className="flex-1">
                <AxisSelector
                  label={`Series ${index + 1}`}
                  columns={columns.filter((c) => c.type === "number")}
                  value={axis}
                  onChange={(value) => updateYAxis(index, value)}
                  allowRemove
                />
              </div>
            </div>
          ))}
          {(!config.yAxis || config.yAxis.length === 0) && (
            <div className="py-4 text-center text-sm text-muted-foreground border border-dashed rounded">
              Add a Y-axis field
            </div>
          )}
        </div>

        {/* Group By */}
        {config.type !== "pie" && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Group By (Optional)</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {config.groupBy
                    ? columns.find((c) => c.id === config.groupBy)?.name
                    : "None"}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                <DropdownMenuItem onClick={() => updateConfig({ groupBy: undefined })}>
                  None
                </DropdownMenuItem>
                {columns
                  .filter((c) => c.type === "string")
                  .map((col) => (
                    <DropdownMenuItem
                      key={col.id}
                      onClick={() => updateConfig({ groupBy: col.id })}
                    >
                      {col.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Options</span>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.showLegend ?? true}
                onChange={(e) => updateConfig({ showLegend: e.target.checked })}
                className="rounded"
              />
              Show Legend
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.showGrid ?? true}
                onChange={(e) => updateConfig({ showGrid: e.target.checked })}
                className="rounded"
              />
              Show Grid
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.showLabels ?? false}
                onChange={(e) => updateConfig({ showLabels: e.target.checked })}
                className="rounded"
              />
              Show Labels
            </label>
          </div>
        </div>
      </div>
    );

    if (mode === "inline") {
      return (
        <div ref={ref} className={cn("space-y-4", className)}>
          {configPanel}
          {preview && <div className="border rounded-lg p-4">{preview}</div>}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("flex h-full", className)}>
        {/* Preview Area */}
        <div className="flex-1 p-4 border-r">
          {preview || (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Settings2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Configure your chart</p>
              </div>
            </div>
          )}
        </div>

        {/* Config Sidebar */}
        <div className="w-72 p-4 overflow-auto bg-muted/30">{configPanel}</div>
      </div>
    );
  }
);
ChartBuilder.displayName = "ChartBuilder";

export { ChartBuilder };
