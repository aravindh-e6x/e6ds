import type { Meta, StoryObj } from "@storybook/react";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from "../../src";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["rectangular", "circular", "text"],
    },
    animate: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 300,
    height: 100,
  },
};

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 48,
    height: 48,
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    width: "100%",
  },
};

export const NoAnimation: Story = {
  args: {
    width: 200,
    height: 20,
    animate: false,
  },
};

export const TextLines: StoryObj<typeof SkeletonText> = {
  render: () => (
    <div className="w-80">
      <SkeletonText lines={4} />
    </div>
  ),
};

export const Avatar: StoryObj<typeof SkeletonAvatar> = {
  render: () => (
    <div className="flex gap-4">
      <SkeletonAvatar size="sm" />
      <SkeletonAvatar size="md" />
      <SkeletonAvatar size="lg" />
      <SkeletonAvatar size={64} />
    </div>
  ),
};

export const Card: StoryObj<typeof SkeletonCard> = {
  render: () => (
    <div className="w-80">
      <SkeletonCard />
    </div>
  ),
};

export const CardWithActions: StoryObj<typeof SkeletonCard> = {
  render: () => (
    <div className="w-80">
      <SkeletonCard showActions />
    </div>
  ),
};

export const CardNoHeader: StoryObj<typeof SkeletonCard> = {
  render: () => (
    <div className="w-80">
      <SkeletonCard showHeader={false} contentLines={5} />
    </div>
  ),
};

export const ListItems: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TableRows: Story = {
  render: () => (
    <div className="w-full space-y-2">
      {/* Header */}
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 py-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  ),
};

export const DashboardCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[800px]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  ),
};
