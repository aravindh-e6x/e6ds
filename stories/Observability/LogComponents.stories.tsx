import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  LogLine,
  LogLevelFilter,
  LogStream,
  LogQueryInput,
  LogLabelsPanel,
  LogContext,
  LogHistogram,
  LogLevel,
} from "../../src";

const meta: Meta = {
  title: "Observability/Logs",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const sampleLogs = [
  { id: "1", timestamp: "2024-01-15 10:23:45.123", level: "info" as LogLevel, message: "Server started on port 3000", service: "api" },
  { id: "2", timestamp: "2024-01-15 10:23:46.456", level: "debug" as LogLevel, message: "Database connection established", service: "db" },
  { id: "3", timestamp: "2024-01-15 10:23:47.789", level: "warn" as LogLevel, message: "High memory usage detected: 85%", service: "monitor" },
  { id: "4", timestamp: "2024-01-15 10:23:48.012", level: "error" as LogLevel, message: "Failed to connect to Redis: ECONNREFUSED", service: "cache" },
  { id: "5", timestamp: "2024-01-15 10:23:49.345", level: "info" as LogLevel, message: "User authentication successful", service: "auth" },
];

const histogramData = [
  { timestamp: "10:00", count: 120, error: 5 },
  { timestamp: "10:05", count: 89, error: 0 },
  { timestamp: "10:10", count: 156, error: 12 },
  { timestamp: "10:15", count: 203, error: 3 },
  { timestamp: "10:20", count: 178, error: 0 },
  { timestamp: "10:25", count: 145, error: 8 },
];

export const Line: Story = {
  render: () => (
    <div className="space-y-2">
      <LogLine timestamp="2024-01-15 10:23:45.123" level="info" message="Server started" service="api" />
      <LogLine timestamp="2024-01-15 10:23:46.456" level="warn" message="High memory usage" service="monitor" />
      <LogLine timestamp="2024-01-15 10:23:47.789" level="error" message="Connection failed" service="db" />
      <LogLine timestamp="2024-01-15 10:23:48.012" level="debug" message="Debug message" />
    </div>
  ),
};

export const LevelFilter: Story = {
  render: () => {
    const [active, setActive] = useState<LogLevel[]>(["error", "warn", "info"]);
    const toggle = (level: LogLevel) => {
      setActive((prev) =>
        prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
      );
    };
    return (
      <LogLevelFilter
        activeLevels={active}
        onToggle={toggle}
        counts={{ error: 12, warn: 45, info: 234, debug: 89, trace: 567 }}
      />
    );
  },
};

export const Stream: Story = {
  render: () => <LogStream logs={sampleLogs} height={300} />,
};

export const QueryInput: Story = {
  render: () => {
    const [query, setQuery] = useState("");
    return (
      <LogQueryInput
        value={query}
        onChange={setQuery}
        onSubmit={() => console.log("Search:", query)}
        placeholder='{level="error"}'
      />
    );
  },
};

export const LabelsPanel: Story = {
  render: () => (
    <LogLabelsPanel
      labels={[
        { key: "service", values: ["api", "db", "cache", "auth"] },
        { key: "level", values: ["error", "warn", "info", "debug"] },
        { key: "host", values: ["prod-1", "prod-2", "prod-3"] },
      ]}
      onLabelClick={(k, v) => console.log(`${k}=${v}`)}
      className="w-64"
    />
  ),
};

export const Context: Story = {
  render: () => (
    <LogContext
      before={[
        { id: "1", timestamp: "10:23:45", level: "info", message: "Request received" },
        { id: "2", timestamp: "10:23:46", level: "debug", message: "Processing..." },
      ]}
      current={{ id: "3", timestamp: "10:23:47", level: "error", message: "Connection timeout" }}
      after={[
        { id: "4", timestamp: "10:23:48", level: "info", message: "Retrying..." },
        { id: "5", timestamp: "10:23:49", level: "info", message: "Connected" },
      ]}
    />
  ),
};

export const Histogram: Story = {
  render: () => <LogHistogram data={histogramData} height={80} />,
};
