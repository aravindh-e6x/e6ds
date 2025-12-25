"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Upload,
  Download,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  type?: "string" | "number" | "boolean" | "json";
  secret?: boolean;
  error?: string;
}

export interface KeyValueEditorProps {
  /** Key-value pairs */
  pairs: KeyValuePair[];
  /** Callback when pairs change */
  onChange?: (pairs: KeyValuePair[]) => void;
  /** Placeholder for key input */
  keyPlaceholder?: string;
  /** Placeholder for value input */
  valuePlaceholder?: string;
  /** Whether to show type selector */
  showTypeSelector?: boolean;
  /** Whether to allow secret values */
  allowSecrets?: boolean;
  /** Whether to show import/export */
  showImportExport?: boolean;
  /** Validation function */
  validateKey?: (key: string) => string | undefined;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Maximum pairs allowed */
  maxPairs?: number;
  /** Additional className */
  className?: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const KeyValueEditor = React.forwardRef<HTMLDivElement, KeyValueEditorProps>(
  (
    {
      pairs,
      onChange,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      showTypeSelector = false,
      allowSecrets = false,
      showImportExport = false,
      validateKey,
      disabled = false,
      maxPairs,
      className,
    },
    ref
  ) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const addPair = () => {
      if (maxPairs && pairs.length >= maxPairs) return;
      const newPair: KeyValuePair = {
        id: generateId(),
        key: "",
        value: "",
        type: "string",
      };
      onChange?.([...pairs, newPair]);
    };

    const updatePair = (id: string, updates: Partial<KeyValuePair>) => {
      onChange?.(
        pairs.map((pair) => {
          if (pair.id !== id) return pair;

          const updated = { ...pair, ...updates };

          // Validate key if validator provided
          if (updates.key !== undefined && validateKey) {
            updated.error = validateKey(updates.key);
          }

          return updated;
        })
      );
    };

    const removePair = (id: string) => {
      onChange?.(pairs.filter((pair) => pair.id !== id));
    };

    const duplicatePair = (pair: KeyValuePair) => {
      if (maxPairs && pairs.length >= maxPairs) return;
      const newPair: KeyValuePair = {
        ...pair,
        id: generateId(),
        key: `${pair.key}_copy`,
      };
      const index = pairs.findIndex((p) => p.id === pair.id);
      const newPairs = [...pairs];
      newPairs.splice(index + 1, 0, newPair);
      onChange?.(newPairs);
    };

    const handleDragStart = (id: string) => {
      setDraggedId(id);
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!draggedId || draggedId === targetId) return;

      const draggedIndex = pairs.findIndex((p) => p.id === draggedId);
      const targetIndex = pairs.findIndex((p) => p.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newPairs = [...pairs];
      const [removed] = newPairs.splice(draggedIndex, 1);
      newPairs.splice(targetIndex, 0, removed);
      onChange?.(newPairs);
    };

    const handleDragEnd = () => {
      setDraggedId(null);
    };

    const exportAsJson = () => {
      const data = pairs.reduce(
        (acc, pair) => {
          if (pair.key) {
            acc[pair.key] = pair.value;
          }
          return acc;
        },
        {} as Record<string, string>
      );
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "key-values.json";
      a.click();
      URL.revokeObjectURL(url);
    };

    const importFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          const newPairs: KeyValuePair[] = Object.entries(data).map(
            ([key, value]) => ({
              id: generateId(),
              key,
              value: String(value),
              type: "string" as const,
            })
          );
          onChange?.([...pairs, ...newPairs].slice(0, maxPairs));
        } catch {
          // Invalid JSON
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    };

    const hasErrors = pairs.some((p) => p.error);
    const canAddMore = !maxPairs || pairs.length < maxPairs;

    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {pairs.length} pair{pairs.length !== 1 ? "s" : ""}
            {maxPairs && ` (max ${maxPairs})`}
          </div>
          <div className="flex items-center gap-2">
            {showImportExport && (
              <>
                <label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importFromJson}
                    className="hidden"
                    disabled={disabled}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                    </span>
                  </Button>
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportAsJson}
                  disabled={disabled || pairs.length === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={addPair}
              disabled={disabled || !canAddMore}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Pairs */}
        {pairs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-md">
            No key-value pairs. Click "Add" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {pairs.map((pair) => (
              <div
                key={pair.id}
                draggable={!disabled}
                onDragStart={() => handleDragStart(pair.id)}
                onDragOver={(e) => handleDragOver(e, pair.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group flex items-start gap-2 p-2 border rounded-md",
                  draggedId === pair.id && "opacity-50",
                  pair.error && "border-destructive"
                )}
              >
                {/* Drag handle */}
                <div className="pt-2 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Key */}
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={pair.key}
                    onChange={(e) => updatePair(pair.id, { key: e.target.value })}
                    placeholder={keyPlaceholder}
                    disabled={disabled}
                    className={cn(
                      "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                      disabled && "opacity-50 cursor-not-allowed",
                      pair.error && "border-destructive"
                    )}
                  />
                  {pair.error && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {pair.error}
                    </div>
                  )}
                </div>

                {/* Type selector */}
                {showTypeSelector && (
                  <select
                    value={pair.type || "string"}
                    onChange={(e) =>
                      updatePair(pair.id, {
                        type: e.target.value as KeyValuePair["type"],
                      })
                    }
                    disabled={disabled}
                    className="px-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="json">JSON</option>
                  </select>
                )}

                {/* Value */}
                <div className="flex-1">
                  <input
                    type={pair.secret ? "password" : "text"}
                    value={pair.value}
                    onChange={(e) => updatePair(pair.id, { value: e.target.value })}
                    placeholder={valuePlaceholder}
                    disabled={disabled}
                    className={cn(
                      "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Secret toggle */}
                {allowSecrets && (
                  <button
                    type="button"
                    onClick={() => updatePair(pair.id, { secret: !pair.secret })}
                    disabled={disabled}
                    className={cn(
                      "p-2 rounded hover:bg-muted",
                      pair.secret && "text-primary"
                    )}
                    title={pair.secret ? "Show value" : "Hide value"}
                  >
                    {pair.secret ? "🔒" : "🔓"}
                  </button>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => duplicatePair(pair)}
                    disabled={disabled || !canAddMore}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() => removePair(pair.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error summary */}
        {hasErrors && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Some entries have validation errors
          </div>
        )}
      </div>
    );
  }
);
KeyValueEditor.displayName = "KeyValueEditor";

export { KeyValueEditor };
