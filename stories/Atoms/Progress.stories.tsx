import type { Meta, StoryObj } from "@storybook/react";
import { Progress, CircularProgress } from "../../src";

const meta: Meta<typeof Progress> = {
  title: "Atoms/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
    className: "w-[300px]",
  },
};

export const Small: Story = {
  args: {
    value: 45,
    className: "w-[300px] h-2",
  },
};

export const Large: Story = {
  args: {
    value: 75,
    className: "w-[300px] h-6",
  },
};

export const AllValues: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>0%</span>
        </div>
        <Progress value={0} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>25%</span>
        </div>
        <Progress value={25} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>50%</span>
        </div>
        <Progress value={50} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>75%</span>
        </div>
        <Progress value={75} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const CircularDefault: Story = {
  render: () => <CircularProgress value={65} />,
};

export const CircularWithLabel: Story = {
  render: () => <CircularProgress value={78} label="Complete" />,
};

export const CircularSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <CircularProgress value={45} size={80} strokeWidth={6} />
      <CircularProgress value={65} size={120} strokeWidth={10} />
      <CircularProgress value={85} size={160} strokeWidth={14} />
    </div>
  ),
};

export const CircularGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <CircularProgress value={25} label="Q1" />
      <CircularProgress value={50} label="Q2" />
      <CircularProgress value={75} label="Q3" />
      <CircularProgress value={100} label="Q4" />
    </div>
  ),
};
