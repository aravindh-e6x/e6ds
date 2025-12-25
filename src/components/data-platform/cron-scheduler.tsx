"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  Info,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export type ScheduleFrequency =
  | "once"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "custom";

export interface ScheduleConfig {
  frequency: ScheduleFrequency;
  cronExpression?: string;
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
  hour?: number;
  minute?: number;
  dayOfWeek?: number[];
  dayOfMonth?: number;
  enabled?: boolean;
}

export interface CronSchedulerProps {
  /** Current schedule configuration */
  config: ScheduleConfig;
  /** Callback when config changes */
  onConfigChange?: (config: ScheduleConfig) => void;
  /** Available timezones */
  timezones?: string[];
  /** Whether to show preview */
  showPreview?: boolean;
  /** Preview of next runs */
  nextRuns?: Date[];
  /** Display mode */
  mode?: "compact" | "detailed";
  /** Additional className */
  className?: string;
}

const frequencies: { value: ScheduleFrequency; label: string; description: string }[] = [
  { value: "once", label: "Once", description: "Run one time" },
  { value: "hourly", label: "Hourly", description: "Every hour" },
  { value: "daily", label: "Daily", description: "Once per day" },
  { value: "weekly", label: "Weekly", description: "Once per week" },
  { value: "monthly", label: "Monthly", description: "Once per month" },
  { value: "custom", label: "Custom", description: "Custom cron expression" },
];

const daysOfWeek = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const generateCronExpression = (config: ScheduleConfig): string => {
  const minute = config.minute ?? 0;
  const hour = config.hour ?? 0;

  switch (config.frequency) {
    case "once":
      return ""; // Not a cron pattern
    case "hourly":
      return `${minute} * * * *`;
    case "daily":
      return `${minute} ${hour} * * *`;
    case "weekly": {
      const days = config.dayOfWeek?.join(",") || "0";
      return `${minute} ${hour} * * ${days}`;
    }
    case "monthly":
      return `${minute} ${hour} ${config.dayOfMonth || 1} * *`;
    case "custom":
      return config.cronExpression || "0 0 * * *";
    default:
      return "0 0 * * *";
  }
};

const CronScheduler = React.forwardRef<HTMLDivElement, CronSchedulerProps>(
  (
    {
      config,
      onConfigChange,
      timezones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London"],
      showPreview = true,
      nextRuns = [],
      mode = "detailed",
      className,
    },
    ref
  ) => {
    const updateConfig = (updates: Partial<ScheduleConfig>) => {
      onConfigChange?.({ ...config, ...updates });
    };

    const cronExpression = generateCronExpression(config);

    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-3", className)}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                {frequencies.find((f) => f.value === config.frequency)?.label}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {frequencies.map((freq) => (
                <DropdownMenuItem
                  key={freq.value}
                  onClick={() => updateConfig({ frequency: freq.value })}
                >
                  <div>
                    <div>{freq.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {freq.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {config.frequency !== "once" && (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={`${String(config.hour ?? 0).padStart(2, "0")}:${String(config.minute ?? 0).padStart(2, "0")}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":").map(Number);
                  updateConfig({ hour: h, minute: m });
                }}
                className="px-2 py-1 text-sm border rounded"
              />
            </div>
          )}

          <Button
            variant={config.enabled ? "default" : "outline"}
            size="sm"
            onClick={() => updateConfig({ enabled: !config.enabled })}
          >
            {config.enabled ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Frequency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Frequency</label>
          <div className="grid grid-cols-3 gap-2">
            {frequencies.map((freq) => (
              <Button
                key={freq.value}
                variant={config.frequency === freq.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ frequency: freq.value })}
              >
                {freq.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Time */}
        {config.frequency !== "once" && config.frequency !== "custom" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={`${String(config.hour ?? 0).padStart(2, "0")}:${String(config.minute ?? 0).padStart(2, "0")}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":").map(Number);
                  updateConfig({ hour: h, minute: m });
                }}
                className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Day of week */}
        {config.frequency === "weekly" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Days</label>
            <div className="flex gap-1">
              {daysOfWeek.map((day) => {
                const isSelected = config.dayOfWeek?.includes(day.value);
                return (
                  <Button
                    key={day.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                    onClick={() => {
                      const current = config.dayOfWeek || [];
                      const next = isSelected
                        ? current.filter((d) => d !== day.value)
                        : [...current, day.value];
                      updateConfig({ dayOfWeek: next.sort() });
                    }}
                  >
                    {day.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Day of month */}
        {config.frequency === "monthly" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Day of month</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32">
                  Day {config.dayOfMonth || 1}
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-48 overflow-auto">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <DropdownMenuItem
                    key={day}
                    onClick={() => updateConfig({ dayOfMonth: day })}
                  >
                    Day {day}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Custom cron */}
        {config.frequency === "custom" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Cron Expression</label>
            <input
              type="text"
              value={config.cronExpression || ""}
              onChange={(e) => updateConfig({ cronExpression: e.target.value })}
              placeholder="0 0 * * *"
              className="w-full px-3 py-2 text-sm border rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              Format: minute hour day month weekday
            </div>
          </div>
        )}

        {/* Timezone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Timezone</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {config.timezone || "UTC"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              {timezones.map((tz) => (
                <DropdownMenuItem
                  key={tz}
                  onClick={() => updateConfig({ timezone: tz })}
                >
                  {tz}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date (Optional)</label>
            <input
              type="date"
              value={
                config.startDate
                  ? config.startDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                updateConfig({
                  startDate: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date (Optional)</label>
            <input
              type="date"
              value={
                config.endDate
                  ? config.endDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                updateConfig({
                  endDate: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Generated cron expression */}
        {config.frequency !== "once" && cronExpression && (
          <div className="px-3 py-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground mb-1">
              Cron Expression
            </div>
            <div className="font-mono text-sm">{cronExpression}</div>
          </div>
        )}

        {/* Next runs preview */}
        {showPreview && nextRuns.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Next Runs</label>
            <div className="space-y-1">
              {nextRuns.slice(0, 5).map((date, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {date.toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enable/Disable */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">Schedule Enabled</span>
          <button
            type="button"
            onClick={() => updateConfig({ enabled: !config.enabled })}
            className={cn(
              "relative w-10 h-6 rounded-full transition-colors",
              config.enabled ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                config.enabled ? "left-5" : "left-1"
              )}
            />
          </button>
        </div>
      </div>
    );
  }
);
CronScheduler.displayName = "CronScheduler";

export { CronScheduler };
