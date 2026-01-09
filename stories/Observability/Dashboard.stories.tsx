import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DashboardGrid,
  Panel,
  PanelEditor,
  Gauge,
  Sparkline,
  LineChart,
} from "../../src";

const meta: Meta = {
  title: "Observability/Dashboard",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const chartData = [
  { time: "00:00", value: 400 },
  { time: "04:00", value: 300 },
  { time: "08:00", value: 500 },
  { time: "12:00", value: 450 },
  { time: "16:00", value: 600 },
  { time: "20:00", value: 550 },
];

export const Grid: Story = {
  render: () => (
    <DashboardGrid columns={2} gap={4}>
      <Panel title="CPU Usage">
        <Gauge value={67} />
      </Panel>
      <Panel title="Memory">
        <Gauge value={45} color="#3b82f6" />
      </Panel>
      <Panel title="Requests/sec">
        <div className="text-3xl font-bold">1,234</div>
        <Sparkline data={[10, 15, 12, 18, 22, 20, 25]} className="mt-2" />
      </Panel>
      <Panel title="Error Rate">
        <div className="text-3xl font-bold text-red-500">0.5%</div>
        <Sparkline data={[1, 0, 2, 1, 0, 1, 0]} color="#ef4444" className="mt-2" />
      </Panel>
    </DashboardGrid>
  ),
};

export const PanelWithActions: Story = {
  render: () => (
    <Panel
      title="Request Latency"
      description="p99 latency over time"
      actions={[
        { label: "Edit", onClick: () => console.log("Edit") },
        { label: "Duplicate", onClick: () => console.log("Duplicate") },
        { label: "Delete", onClick: () => console.log("Delete") },
      ]}
      className="w-[500px]"
    >
      <LineChart
        data={chartData}
        xAxisKey="time"
        lines={[{ dataKey: "value", name: "Latency (ms)" }]}
        height={200}
        showLegend={false}
      />
    </Panel>
  ),
};

export const Editor: Story = {
  render: () => {
    const [config, setConfig] = useState({
      title: "CPU Usage",
      type: "gauge",
      query: "cpu_usage",
    });
    return (
      <PanelEditor
        config={config}
        onChange={setConfig}
        onClose={() => console.log("Close")}
        onSave={() => console.log("Save", config)}
      />
    );
  },
};

export const FullDashboard: Story = {
  render: () => (
    <div className="space-y-4">
      <DashboardGrid columns={4} gap={4}>
        <Panel title="CPU">
          <Gauge value={67} size={80} />
        </Panel>
        <Panel title="Memory">
          <Gauge value={45} size={80} color="#3b82f6" />
        </Panel>
        <Panel title="Disk">
          <Gauge value={82} size={80} color="#f59e0b" />
        </Panel>
        <Panel title="Network">
          <Gauge value={23} size={80} />
        </Panel>
      </DashboardGrid>
      <DashboardGrid columns={2} gap={4}>
        <Panel title="Request Rate" className="h-64">
          <LineChart
            data={chartData}
            xAxisKey="time"
            lines={[{ dataKey: "value" }]}
            height={180}
            showLegend={false}
          />
        </Panel>
        <Panel title="Error Rate" className="h-64">
          <LineChart
            data={chartData.map((d) => ({ ...d, value: d.value * 0.01 }))}
            xAxisKey="time"
            lines={[{ dataKey: "value", color: "#ef4444" }]}
            height={180}
            showLegend={false}
          />
        </Panel>
      </DashboardGrid>
    </div>
  ),
};
