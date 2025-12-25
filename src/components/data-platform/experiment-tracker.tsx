"use client";

import * as React from "react";
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Search,
  Download,
  MoreHorizontal,
  Trash2,
  Copy,
  Eye,
  TrendingUp,
  TrendingDown,
  GitCompare,
  Tag,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../primitives/dropdown-menu";
import { Badge } from "../primitives/badge";

export type ExperimentStatus = "running" | "finished" | "failed" | "scheduled";

export interface MetricValue {
  step: number;
  value: number;
  timestamp: Date;
}

export interface ExperimentMetric {
  name: string;
  values: MetricValue[];
  best?: number;
  last?: number;
}

export interface ExperimentParam {
  name: string;
  value: string | number | boolean;
}

export interface ExperimentRun {
  id: string;
  name: string;
  experimentId: string;
  status: ExperimentStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  user?: string;
  tags?: string[];
  params: ExperimentParam[];
  metrics: ExperimentMetric[];
  artifacts?: string[];
  notes?: string;
  gitCommit?: string;
  parentRunId?: string;
}

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  runs: ExperimentRun[];
  createdAt: Date;
  lastActivity?: Date;
  tags?: string[];
}

export interface ExperimentTrackerProps {
  /** List of experiments */
  experiments: Experiment[];
  /** Currently selected experiment ID */
  selectedExperimentId?: string;
  /** Currently selected runs for comparison */
  selectedRunIds?: string[];
  /** Callback when experiment is selected */
  onExperimentSelect?: (experimentId: string | null) => void;
  /** Callback when run is selected */
  onRunSelect?: (runId: string) => void;
  /** Callback when runs are selected for comparison */
  onCompareRuns?: (runIds: string[]) => void;
  /** Callback when run is viewed */
  onRunView?: (runId: string) => void;
  /** Callback when run is deleted */
  onRunDelete?: (runId: string) => void;
  /** Additional className */
  className?: string;
}

const statusConfig: Record<ExperimentStatus, { icon: React.ReactNode; label: string; color: string }> = {
  running: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    label: "Running",
    color: "text-blue-600 dark:text-blue-400",
  },
  finished: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Finished",
    color: "text-green-600 dark:text-green-400",
  },
  failed: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Failed",
    color: "text-red-600 dark:text-red-400",
  },
  scheduled: {
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Scheduled",
    color: "text-yellow-600 dark:text-yellow-400",
  },
};

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const ExperimentTracker = React.forwardRef<HTMLDivElement, ExperimentTrackerProps>(
  (
    {
      experiments,
      selectedExperimentId,
      selectedRunIds = [],
      onExperimentSelect,
      onRunSelect,
      onCompareRuns,
      onRunView,
      onRunDelete,
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedExperiments, setExpandedExperiments] = React.useState<Set<string>>(
      new Set(selectedExperimentId ? [selectedExperimentId] : [])
    );

    const toggleExperiment = (id: string) => {
      const next = new Set(expandedExperiments);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setExpandedExperiments(next);
    };

    const toggleRunSelection = (runId: string) => {
      const isSelected = selectedRunIds.includes(runId);
      const newSelection = isSelected
        ? selectedRunIds.filter((id) => id !== runId)
        : [...selectedRunIds, runId];
      onCompareRuns?.(newSelection);
    };

    const filteredExperiments = experiments.filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.runs.some((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div ref={ref} className={cn("flex h-full bg-background", className)}>
        {/* Experiment list */}
        <div className="w-80 border-r flex flex-col">
          <div className="px-3 py-2 border-b bg-card">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Experiments</span>
              <Badge variant="secondary" className="ml-auto">{experiments.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experiments..."
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredExperiments.map((experiment) => (
              <div key={experiment.id} className="border-b">
                <div
                  className={cn(
                    "px-3 py-2 cursor-pointer hover:bg-muted/50 flex items-center gap-2",
                    experiment.id === selectedExperimentId && "bg-muted"
                  )}
                  onClick={() => {
                    onExperimentSelect?.(experiment.id);
                    toggleExperiment(experiment.id);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExperiment(experiment.id);
                    }}
                    className="p-0.5"
                  >
                    {expandedExperiments.has(experiment.id) ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <FlaskConical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{experiment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {experiment.runs.length} runs
                    </p>
                  </div>
                </div>

                {expandedExperiments.has(experiment.id) && (
                  <div className="pl-8 pb-2">
                    {experiment.runs.slice(0, 10).map((run) => (
                      <div
                        key={run.id}
                        className={cn(
                          "px-2 py-1.5 mx-2 rounded flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                          selectedRunIds.includes(run.id) && "bg-primary/10"
                        )}
                        onClick={() => onRunSelect?.(run.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRunIds.includes(run.id)}
                          onChange={() => toggleRunSelection(run.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-3 w-3"
                        />
                        <span className={statusConfig[run.status].color}>
                          {statusConfig[run.status].icon}
                        </span>
                        <span className="text-xs truncate flex-1">{run.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(run.startTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Run details / comparison */}
        <div className="flex-1 flex flex-col">
          {selectedRunIds.length > 1 ? (
            <ComparisonView
              experiments={experiments}
              selectedRunIds={selectedRunIds}
              onRemoveRun={(runId) => onCompareRuns?.(selectedRunIds.filter((id) => id !== runId))}
            />
          ) : selectedRunIds.length === 1 ? (
            <RunDetailsView
              run={experiments
                .flatMap((e) => e.runs)
                .find((r) => r.id === selectedRunIds[0])}
              onView={() => onRunView?.(selectedRunIds[0])}
              onDelete={() => onRunDelete?.(selectedRunIds[0])}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select runs to compare</p>
                <p className="text-sm">Choose one or more runs from the experiments list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ExperimentTracker.displayName = "ExperimentTracker";

const RunDetailsView: React.FC<{
  run?: ExperimentRun;
  onView: () => void;
  onDelete: () => void;
}> = ({ run, onView, onDelete }) => {
  if (!run) return null;

  const config = statusConfig[run.status];

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={config.color}>{config.icon}</span>
            <div>
              <h2 className="font-semibold">{run.name}</h2>
              <p className="text-xs text-muted-foreground">Run ID: {run.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-3.5 w-3.5 mr-1" />
              View Full
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          {run.user && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {run.user}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {run.startTime.toLocaleString()}
          </span>
          {run.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(run.duration)}
            </span>
          )}
          {run.gitCommit && (
            <span className="flex items-center gap-1 font-mono text-xs">
              {run.gitCommit.slice(0, 7)}
            </span>
          )}
        </div>

        {run.tags && run.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {run.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Parameters */}
        <div>
          <h3 className="text-sm font-medium mb-2">Parameters</h3>
          <div className="border rounded-lg divide-y">
            {run.params.map((param) => (
              <div key={param.name} className="flex items-center px-3 py-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground w-48 shrink-0">
                  {param.name}
                </span>
                <span className="truncate">{String(param.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-sm font-medium mb-2">Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            {run.metrics.map((metric) => (
              <div key={metric.name} className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">{metric.name}</p>
                <p className="text-2xl font-bold">
                  {metric.last?.toFixed(4) ?? "-"}
                </p>
                {metric.best !== undefined && metric.best !== metric.last && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Best: {metric.best.toFixed(4)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Artifacts */}
        {run.artifacts && run.artifacts.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Artifacts</h3>
            <div className="border rounded-lg divide-y">
              {run.artifacts.map((artifact) => (
                <div
                  key={artifact}
                  className="flex items-center px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-mono text-xs">{artifact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {run.notes && (
          <div>
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{run.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ComparisonView: React.FC<{
  experiments: Experiment[];
  selectedRunIds: string[];
  onRemoveRun: (runId: string) => void;
}> = ({ experiments, selectedRunIds, onRemoveRun }) => {
  const runs = selectedRunIds
    .map((id) => experiments.flatMap((e) => e.runs).find((r) => r.id === id))
    .filter(Boolean) as ExperimentRun[];

  // Get all unique param and metric names
  const allParamNames = [...new Set(runs.flatMap((r) => r.params.map((p) => p.name)))];
  const allMetricNames = [...new Set(runs.flatMap((r) => r.metrics.map((m) => m.name)))];

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 py-3 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Compare Runs</h2>
            <Badge variant="secondary">{runs.length} runs</Badge>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-3 py-2 font-medium sticky left-0 bg-background">Run</th>
              {runs.map((run) => (
                <th key={run.id} className="text-left px-3 py-2 min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <span className={statusConfig[run.status].color}>
                      {statusConfig[run.status].icon}
                    </span>
                    <span className="truncate">{run.name}</span>
                    <button
                      onClick={() => onRemoveRun(run.id)}
                      className="p-0.5 hover:bg-muted rounded ml-auto"
                    >
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Parameters section */}
            <tr className="border-b bg-muted/30">
              <td colSpan={runs.length + 1} className="px-3 py-2 font-medium text-xs uppercase text-muted-foreground">
                Parameters
              </td>
            </tr>
            {allParamNames.map((name) => (
              <tr key={`param-${name}`} className="border-b hover:bg-muted/30">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground sticky left-0 bg-background">
                  {name}
                </td>
                {runs.map((run) => {
                  const param = run.params.find((p) => p.name === name);
                  return (
                    <td key={run.id} className="px-3 py-2">
                      {param ? String(param.value) : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Metrics section */}
            <tr className="border-b bg-muted/30">
              <td colSpan={runs.length + 1} className="px-3 py-2 font-medium text-xs uppercase text-muted-foreground">
                Metrics
              </td>
            </tr>
            {allMetricNames.map((name) => {
              const values = runs.map((r) => r.metrics.find((m) => m.name === name)?.last).filter(Boolean) as number[];
              const best = Math.max(...values);
              const worst = Math.min(...values);

              return (
                <tr key={`metric-${name}`} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground sticky left-0 bg-background">
                    {name}
                  </td>
                  {runs.map((run) => {
                    const metric = run.metrics.find((m) => m.name === name);
                    const value = metric?.last;
                    const isBest = value === best && values.length > 1;
                    const isWorst = value === worst && values.length > 1;

                    return (
                      <td
                        key={run.id}
                        className={cn(
                          "px-3 py-2 font-medium",
                          isBest && "text-green-600 dark:text-green-400",
                          isWorst && "text-red-600 dark:text-red-400"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {value?.toFixed(4) ?? "-"}
                          {isBest && <TrendingUp className="h-3 w-3" />}
                          {isWorst && <TrendingDown className="h-3 w-3" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ExperimentTracker };
