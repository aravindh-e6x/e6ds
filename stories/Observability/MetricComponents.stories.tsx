import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Gauge,
  Sparkline,
  AlertStateIndicator,
  TimeRangeSelector,
  RefreshPicker,
  VariableDropdown,
  MetricQueryBuilder,
  AlertRuleCard,
  AlertList,
  Heatmap,
} from "../../src";

const meta: Meta = {
  title: "Observability/Metrics",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const sparklineData = [10, 15, 8, 22, 18, 25, 30, 28, 35, 32, 40, 38];

export const GaugeChart: Story = {
  render: () => (
    <div className="flex gap-8">
      <Gauge value={45} label="CPU" />
      <Gauge value={72} label="Memory" color="#f59e0b" />
      <Gauge value={91} label="Disk" color="#ef4444" />
    </div>
  ),
};

export const SparklineChart: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-20">CPU:</span>
        <Sparkline data={sparklineData} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20">Memory:</span>
        <Sparkline data={[5, 8, 12, 9, 15, 20, 18, 22]} color="#f59e0b" />
      </div>
    </div>
  ),
};

export const AlertStates: Story = {
  render: () => (
    <div className="flex gap-4">
      <AlertStateIndicator state="firing" />
      <AlertStateIndicator state="pending" />
      <AlertStateIndicator state="resolved" />
      <AlertStateIndicator state="normal" />
    </div>
  ),
};

export const TimeRange: Story = {
  render: () => {
    const [value, setValue] = useState("1h");
    return <TimeRangeSelector value={value} onChange={setValue} />;
  },
};

export const Refresh: Story = {
  render: () => {
    const [value, setValue] = useState("off");
    return (
      <RefreshPicker
        value={value}
        onChange={setValue}
        onRefresh={() => console.log("Refresh")}
      />
    );
  },
};

export const Variable: Story = {
  render: () => {
    const [value, setValue] = useState("prod");
    return (
      <VariableDropdown
        label="Environment"
        value={value}
        options={["prod", "staging", "dev"]}
        onChange={setValue}
      />
    );
  },
};

export const QueryBuilder: Story = {
  render: () => {
    const [metric, setMetric] = useState("http_requests_total");
    const [filters, setFilters] = useState([{ label: "job", operator: "=", value: "api" }]);
    return (
      <MetricQueryBuilder
        metric={metric}
        onMetricChange={setMetric}
        metrics={["http_requests_total", "cpu_usage", "memory_usage"]}
        filters={filters}
        onFiltersChange={setFilters}
        labels={["job", "instance", "method", "status"]}
        className="w-96"
      />
    );
  },
};

export const RuleCard: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <AlertRuleCard
        name="High CPU Usage"
        state="firing"
        query="cpu_usage > 90"
        lastEvaluation="10s ago"
        labels={{ severity: "critical", team: "infra" }}
      />
      <AlertRuleCard
        name="Memory Warning"
        state="pending"
        query="memory_usage > 80"
      />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <AlertList
      alerts={[
        { id: "1", name: "High CPU", state: "firing", message: "CPU > 90%", timestamp: "2m ago" },
        { id: "2", name: "Memory Warning", state: "pending", message: "Memory > 80%", timestamp: "5m ago" },
        { id: "3", name: "Disk Space", state: "resolved", timestamp: "1h ago" },
      ]}
      className="w-96"
    />
  ),
};

export const HeatmapChart: Story = {
  render: () => {
    const hours = ["00", "06", "12", "18"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const data = days.flatMap((y) =>
      hours.map((x) => ({ x, y, value: Math.floor(Math.random() * 100) }))
    );
    return <Heatmap data={data} xLabels={hours} yLabels={days} />;
  },
};
