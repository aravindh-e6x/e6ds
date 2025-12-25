import type { Meta, StoryObj } from "@storybook/react";
import { MetricCard, StatCard } from "../../src";
import { Activity, Users, DollarSign, TrendingUp } from "lucide-react";

const meta: Meta<typeof MetricCard> = {
  title: "Molecules/MetricCard",
  component: MetricCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive",
    description: "from last month",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Active Users",
    value: "2,350",
    change: "+180",
    changeType: "positive",
    icon: <Users className="h-5 w-5 text-primary" />,
  },
};

export const Negative: Story = {
  args: {
    title: "Bounce Rate",
    value: "42.5%",
    change: "-3.2%",
    changeType: "negative",
    icon: <Activity className="h-5 w-5 text-primary" />,
  },
};

export const Neutral: Story = {
  args: {
    title: "Sessions",
    value: "12,543",
    change: "0%",
    changeType: "neutral",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[600px]">
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        change="+20.1%"
        changeType="positive"
        icon={<DollarSign className="h-5 w-5 text-primary" />}
      />
      <MetricCard
        title="Active Users"
        value="2,350"
        change="+180"
        changeType="positive"
        icon={<Users className="h-5 w-5 text-primary" />}
      />
      <MetricCard
        title="Conversion Rate"
        value="3.24%"
        change="-0.5%"
        changeType="negative"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />
      <MetricCard
        title="Avg. Session"
        value="4m 32s"
        change="+12s"
        changeType="positive"
        icon={<Activity className="h-5 w-5 text-primary" />}
      />
    </div>
  ),
};

export const StatCardExample: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[700px]">
      <StatCard
        label="Total Sales"
        value="12,543"
        previousValue="10,234"
        percentChange={22.5}
        prefix="$"
      />
      <StatCard
        label="Orders"
        value="1,234"
        percentChange={-5.2}
      />
      <StatCard
        label="Customers"
        value="8,456"
        percentChange={0}
      />
    </div>
  ),
};
