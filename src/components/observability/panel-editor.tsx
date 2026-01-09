"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";
import { Label } from "../primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";

export interface PanelConfig {
  title: string;
  type: string;
  query: string;
}

export interface PanelEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  config: PanelConfig;
  onChange: (config: PanelConfig) => void;
  onClose: () => void;
  onSave: () => void;
  panelTypes?: string[];
}

const defaultPanelTypes = ["line", "bar", "gauge", "stat", "table", "logs"];

const PanelEditor = React.forwardRef<HTMLDivElement, PanelEditorProps>(
  ({ className, config, onChange, onClose, onSave, panelTypes = defaultPanelTypes, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border bg-card w-80", className)} {...props}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-medium">Edit Panel</span>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={config.title}
              onChange={(e) => onChange({ ...config, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={config.type} onValueChange={(v) => onChange({ ...config, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {panelTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Query</Label>
            <Input
              value={config.query}
              onChange={(e) => onChange({ ...config, query: e.target.value })}
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={onSave} className="w-full">Save</Button>
        </div>
      </div>
    );
  }
);
PanelEditor.displayName = "PanelEditor";

export { PanelEditor };
