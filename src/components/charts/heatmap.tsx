"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../primitives/tooltip";

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
}

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HeatmapCell[];
  xLabels: string[];
  yLabels: string[];
  colorScale?: string[];
  cellSize?: number;
}

const defaultColorScale = [
  "rgb(var(--e6-green) / 0.1)",
  "rgb(var(--e6-green) / 0.3)",
  "rgb(var(--e6-green) / 0.5)",
  "rgb(var(--e6-green) / 0.7)",
  "rgb(var(--e6-green) / 0.9)",
];

const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  ({ className, data, xLabels, yLabels, colorScale = defaultColorScale, cellSize = 24, ...props }, ref) => {
    const max = Math.max(...data.map((d) => d.value), 1);

    const getColor = (value: number) => {
      const index = Math.floor((value / max) * (colorScale.length - 1));
      return colorScale[Math.min(index, colorScale.length - 1)];
    };

    const getValue = (x: string, y: string) => {
      return data.find((d) => d.x === x && d.y === y)?.value ?? 0;
    };

    return (
      <TooltipProvider>
        <div ref={ref} className={cn("inline-block", className)} {...props}>
          <div className="flex">
            <div className="flex flex-col justify-end mr-1">
              {yLabels.map((label) => (
                <div
                  key={label}
                  className="text-xs text-muted-foreground text-right pr-2"
                  style={{ height: cellSize }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div>
              <div className="flex flex-col">
                {yLabels.map((y) => (
                  <div key={y} className="flex">
                    {xLabels.map((x) => {
                      const value = getValue(x, y);
                      return (
                        <Tooltip key={`${x}-${y}`}>
                          <TooltipTrigger asChild>
                            <div
                              className="border border-background"
                              style={{
                                width: cellSize,
                                height: cellSize,
                                backgroundColor: getColor(value),
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{x}, {y}: {value}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex mt-1">
                {xLabels.map((label) => (
                  <div
                    key={label}
                    className="text-xs text-muted-foreground text-center"
                    style={{ width: cellSize }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }
);
Heatmap.displayName = "Heatmap";

export { Heatmap };
