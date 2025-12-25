import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "../../src";

const meta: Meta<typeof StatusBadge> = {
  title: "Atoms/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    status: "active",
    children: "Active",
  },
};

export const Disabled: Story = {
  args: {
    status: "disabled",
    children: "Disabled",
  },
};

export const Accepted: Story = {
  args: {
    status: "accepted",
    children: "Accepted",
  },
};

export const Pending: Story = {
  args: {
    status: "pending",
    children: "Pending",
  },
};

export const Suspended: Story = {
  args: {
    status: "suspended",
    children: "Suspended",
  },
};

export const Error: Story = {
  args: {
    status: "error",
    children: "Error",
  },
};

export const WithoutDot: Story = {
  args: {
    status: "active",
    children: "Active",
    showDot: false,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <StatusBadge status="active">Active</StatusBadge>
      <StatusBadge status="disabled">Disabled</StatusBadge>
      <StatusBadge status="accepted">Accepted</StatusBadge>
      <StatusBadge status="pending">Pending</StatusBadge>
      <StatusBadge status="suspended">Suspended</StatusBadge>
      <StatusBadge status="error">Error</StatusBadge>
      <StatusBadge status="warning">Warning</StatusBadge>
    </div>
  ),
};
