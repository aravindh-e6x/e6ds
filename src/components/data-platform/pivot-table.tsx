"use client";

import * as React from "react";
import {
  GripVertical,
  X,
  Plus,
  Settings2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export interface PivotColumn {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

export type AggregationType = "sum" | "avg" | "count" | "min" | "max";

export interface PivotFieldConfig {
  columnId: string;
  aggregation?: AggregationType;
}

export interface PivotConfig {
  rows: string[];
  columns: string[];
  values: PivotFieldConfig[];
  filters?: Record<string, string[]>;
}

export interface PivotTableProps {
  /** Available columns */
  availableColumns: PivotColumn[];
  /** Current pivot configuration */
  config: PivotConfig;
  /** Callback when config changes */
  onConfigChange?: (config: PivotConfig) => void;
  /** Pivot data (pre-computed) */
  data?: {
    rowHeaders: string[][];
    columnHeaders: string[][];
    values: (number | null)[][];
    rowTotals?: number[];
    columnTotals?: number[];
    grandTotal?: number;
  };
  /** Whether to show configuration panel */
  showConfig?: boolean;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
}

const aggregations: { value: AggregationType; label: string }[] = [
  { value: "sum", label: "Sum" },
  { value: "avg", label: "Average" },
  { value: "count", label: "Count" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
];

interface FieldDropZoneProps {
  label: string;
  fields: string[];
  columns: PivotColumn[];
  onAdd: (columnId: string) => void;
  onRemove: (columnId: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  aggregation?: Record<string, AggregationType>;
  onAggregationChange?: (columnId: string, agg: AggregationType) => void;
  showAggregation?: boolean;
}

const FieldDropZone: React.FC<FieldDropZoneProps> = ({
  label,
  fields,
  columns,
  onAdd,
  onRemove,
  aggregation,
  onAggregationChange,
  showAggregation = false,
}) => {
  const availableColumns = columns.filter((c) => !fields.includes(c.id));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </span>
        {availableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-1">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableColumns.map((col) => (
                <DropdownMenuItem key={col.id} onClick={() => onAdd(col.id)}>
                  {col.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {col.type}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="min-h-[60px] border border-dashed rounded p-2 space-y-1">
        {fields.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            Drop fields here
          </div>
        ) : (
          fields.map((fieldId) => {
            const col = columns.find((c) => c.id === fieldId);
            if (!col) return null;

            return (
              <div
                key={fieldId}
                className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm group"
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab" />
                <span className="flex-1 truncate">{col.name}</span>
                {showAggregation && onAggregationChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-xs text-muted-foreground hover:text-foreground">
                        {aggregation?.[fieldId] || "sum"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {aggregations.map((agg) => (
                        <DropdownMenuItem
                          key={agg.value}
                          onClick={() => onAggregationChange(fieldId, agg.value)}
                        >
                          {agg.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <button
                  onClick={() => onRemove(fieldId)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-background rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const PivotTable = React.forwardRef<HTMLDivElement, PivotTableProps>(
  (
    {
      availableColumns,
      config,
      onConfigChange,
      data,
      showConfig = true,
      isLoading = false,
      className,
    },
    ref
  ) => {
    const [configOpen, setConfigOpen] = React.useState(showConfig);

    const updateConfig = (updates: Partial<PivotConfig>) => {
      onConfigChange?.({ ...config, ...updates });
    };

    const addToRows = (columnId: string) => {
      updateConfig({ rows: [...config.rows, columnId] });
    };

    const removeFromRows = (columnId: string) => {
      updateConfig({ rows: config.rows.filter((id) => id !== columnId) });
    };

    const addToColumns = (columnId: string) => {
      updateConfig({ columns: [...config.columns, columnId] });
    };

    const removeFromColumns = (columnId: string) => {
      updateConfig({ columns: config.columns.filter((id) => id !== columnId) });
    };

    const addToValues = (columnId: string) => {
      updateConfig({
        values: [...config.values, { columnId, aggregation: "sum" }],
      });
    };

    const removeFromValues = (columnId: string) => {
      updateConfig({
        values: config.values.filter((v) => v.columnId !== columnId),
      });
    };

    const updateValueAggregation = (columnId: string, agg: AggregationType) => {
      updateConfig({
        values: config.values.map((v) =>
          v.columnId === columnId ? { ...v, aggregation: agg } : v
        ),
      });
    };

    const resetConfig = () => {
      onConfigChange?.({ rows: [], columns: [], values: [] });
    };

    const valueAggregation = config.values.reduce(
      (acc, v) => {
        acc[v.columnId] = v.aggregation || "sum";
        return acc;
      },
      {} as Record<string, AggregationType>
    );

    const numericColumns = availableColumns.filter((c) => c.type === "number");
    const dimensionColumns = availableColumns.filter((c) => c.type !== "number");

    return (
      <div ref={ref} className={cn("flex h-full", className)}>
        {/* Config Panel */}
        {configOpen && (
          <div className="w-64 border-r bg-muted/30 p-4 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <span className="font-medium text-sm">Pivot Config</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={resetConfig}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setConfigOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <FieldDropZone
              label="Rows"
              fields={config.rows}
              columns={dimensionColumns}
              onAdd={addToRows}
              onRemove={removeFromRows}
            />

            <FieldDropZone
              label="Columns"
              fields={config.columns}
              columns={dimensionColumns.filter(
                (c) => !config.rows.includes(c.id)
              )}
              onAdd={addToColumns}
              onRemove={removeFromColumns}
            />

            <FieldDropZone
              label="Values"
              fields={config.values.map((v) => v.columnId)}
              columns={numericColumns}
              onAdd={addToValues}
              onRemove={removeFromValues}
              showAggregation
              aggregation={valueAggregation}
              onAggregationChange={updateValueAggregation}
            />
          </div>
        )}

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          {!configOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="m-2"
              onClick={() => setConfigOpen(true)}
            >
              <Settings2 className="h-4 w-4 mr-1" />
              Configure
            </Button>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : !data ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Settings2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Configure your pivot table</p>
                <p className="text-sm">Add rows, columns, and values</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                {/* Column headers */}
                {data.columnHeaders.map((headerRow, rowIdx) => (
                  <tr key={rowIdx}>
                    {/* Empty cells for row headers */}
                    {config.rows.map((_, idx) => (
                      <th
                        key={`empty-${idx}`}
                        className="px-3 py-2 bg-muted border font-medium"
                      />
                    ))}
                    {/* Column header cells */}
                    {headerRow.map((header, colIdx) => (
                      <th
                        key={colIdx}
                        className="px-3 py-2 bg-muted border font-medium text-center"
                      >
                        {header}
                      </th>
                    ))}
                    {/* Row total header */}
                    {data.rowTotals && (
                      <th className="px-3 py-2 bg-muted/80 border font-medium text-center">
                        Total
                      </th>
                    )}
                  </tr>
                ))}
              </thead>
              <tbody>
                {data.rowHeaders.map((rowHeader, rowIdx) => (
                  <tr key={rowIdx}>
                    {/* Row headers */}
                    {rowHeader.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 bg-muted/50 border font-medium text-left"
                      >
                        {header}
                      </th>
                    ))}
                    {/* Values */}
                    {data.values[rowIdx]?.map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-3 py-2 border text-right font-mono"
                      >
                        {value !== null ? value.toLocaleString() : "-"}
                      </td>
                    ))}
                    {/* Row total */}
                    {data.rowTotals && (
                      <td className="px-3 py-2 bg-muted/30 border text-right font-mono font-medium">
                        {data.rowTotals[rowIdx]?.toLocaleString()}
                      </td>
                    )}
                  </tr>
                ))}
                {/* Column totals */}
                {data.columnTotals && (
                  <tr>
                    {config.rows.map((_, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 bg-muted/80 border font-medium"
                      >
                        {idx === 0 ? "Total" : ""}
                      </th>
                    ))}
                    {data.columnTotals.map((total, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-3 py-2 bg-muted/30 border text-right font-mono font-medium"
                      >
                        {total.toLocaleString()}
                      </td>
                    ))}
                    {data.grandTotal !== undefined && (
                      <td className="px-3 py-2 bg-muted/50 border text-right font-mono font-bold">
                        {data.grandTotal.toLocaleString()}
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
);
PivotTable.displayName = "PivotTable";

export { PivotTable };
