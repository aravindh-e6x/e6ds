import type { Meta, StoryObj } from "@storybook/react";
import {
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  StackedBarChart,
  BenchmarkChart,
} from "../../src";

const meta: Meta = {
  title: "Organisms/Charts",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

// Sample data
const timeSeriesData = [
  { time: "00:00", received: 4000, sent: 2400 },
  { time: "04:00", received: 3000, sent: 1398 },
  { time: "08:00", received: 2000, sent: 9800 },
  { time: "12:00", received: 2780, sent: 3908 },
  { time: "16:00", received: 1890, sent: 4800 },
  { time: "20:00", received: 2390, sent: 3800 },
  { time: "24:00", received: 3490, sent: 4300 },
];

const barData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 1800 },
  { month: "Apr", revenue: 2780, expenses: 2908 },
  { month: "May", revenue: 1890, expenses: 1800 },
  { month: "Jun", revenue: 2390, expenses: 2800 },
];

const pieData = [
  { name: "Chrome", value: 400 },
  { name: "Firefox", value: 300 },
  { name: "Safari", value: 200 },
  { name: "Edge", value: 100 },
  { name: "Other", value: 50 },
];

const benchmarkItems = [
  { label: "e6data", value: 2500, highlight: true },
  { label: "Competitor A", value: 8000 },
  { label: "Competitor B", value: 12000 },
  { label: "Competitor C", value: 15000 },
];

const usageData = [
  { date: "14 Dec", planner: 0, executor: 0, queue: 0 },
  { date: "15 Dec", planner: 85, executor: 65, queue: 10 },
  { date: "16 Dec", planner: 0, executor: 0, queue: 0 },
  { date: "17 Dec", planner: 110, executor: 75, queue: 15 },
  { date: "18 Dec", planner: 10, executor: 8, queue: 2 },
  { date: "19 Dec", planner: 0, executor: 0, queue: 0 },
  { date: "20 Dec", planner: 0, executor: 0, queue: 0 },
];

export const Line: Story = {
  render: () => (
    <LineChart
      title="Messages Processed"
      description="Received vs Sent messages over time"
      data={timeSeriesData}
      xAxisKey="time"
      lines={[
        { dataKey: "received", name: "Received", color: "rgb(var(--e6-green))" },
        { dataKey: "sent", name: "Sent", color: "#3b82f6" },
      ]}
      height={300}
    />
  ),
};

export const Area: Story = {
  render: () => (
    <AreaChart
      title="Network Traffic"
      data={timeSeriesData}
      xAxisKey="time"
      areas={[
        { dataKey: "received", name: "Received", fillOpacity: 0.4 },
        { dataKey: "sent", name: "Sent", fillOpacity: 0.4 },
      ]}
      height={300}
    />
  ),
};

export const AreaStacked: Story = {
  render: () => (
    <AreaChart
      title="Stacked Network Traffic"
      data={timeSeriesData}
      xAxisKey="time"
      areas={[
        { dataKey: "received", name: "Received" },
        { dataKey: "sent", name: "Sent" },
      ]}
      stacked
      height={300}
    />
  ),
};

export const Bar: Story = {
  render: () => (
    <BarChart
      title="Monthly Revenue vs Expenses"
      data={barData}
      xAxisKey="month"
      bars={[
        { dataKey: "revenue", name: "Revenue" },
        { dataKey: "expenses", name: "Expenses", color: "#ef4444" },
      ]}
      height={300}
    />
  ),
};

export const BarStacked: Story = {
  render: () => (
    <BarChart
      title="Stacked Revenue vs Expenses"
      data={barData}
      xAxisKey="month"
      bars={[
        { dataKey: "revenue", name: "Revenue" },
        { dataKey: "expenses", name: "Expenses", color: "#ef4444" },
      ]}
      stacked
      height={300}
    />
  ),
};

export const BarHorizontal: Story = {
  render: () => (
    <BarChart
      title="Monthly Overview"
      data={barData.slice(0, 4)}
      xAxisKey="month"
      bars={[{ dataKey: "revenue", name: "Revenue" }]}
      layout="vertical"
      height={250}
    />
  ),
};

export const Pie: Story = {
  render: () => (
    <PieChart
      title="Browser Usage"
      data={pieData}
      height={300}
    />
  ),
};

export const Donut: Story = {
  render: () => (
    <PieChart
      title="Browser Distribution"
      description="Market share by browser"
      data={pieData}
      donut
      height={300}
    />
  ),
};

export const Stacked: Story = {
  render: () => (
    <StackedBarChart
      data={usageData}
      stacks={[
        { dataKey: "planner", name: "Planner cores", color: "#3b82f6" },
        { dataKey: "executor", name: "Executor cores", color: "rgb(73, 245, 159)" },
        { dataKey: "queue", name: "Queue cores", color: "#8b5cf6" },
      ]}
      xAxisKey="date"
      title="Usage Breakdown"
      description="Core consumption over the last 7 days"
      height={300}
      className="w-[600px]"
    />
  ),
};

export const Benchmark: Story = {
  render: () => (
    <BenchmarkChart
      items={benchmarkItems}
      unit="ms"
      lowerIsBetter
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <LineChart
      title="Loading State"
      data={[]}
      xAxisKey="time"
      lines={[{ dataKey: "value" }]}
      loading
      height={300}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <LineChart
      title="Empty State"
      data={[]}
      xAxisKey="time"
      lines={[{ dataKey: "value" }]}
      height={300}
    />
  ),
};
