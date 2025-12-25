import type { Meta, StoryObj } from "@storybook/react";
import { CollapsibleSection } from "../../src";

const meta = {
  title: "Molecules/CollapsibleSection",
  component: CollapsibleSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Advanced Settings",
    children: (
      <div className="space-y-2">
        <p>This is the content that can be collapsed.</p>
        <p>It can contain any elements you need.</p>
      </div>
    ),
  },
};

export const DefaultOpen: Story = {
  args: {
    title: "Already Expanded",
    defaultOpen: true,
    children: (
      <div className="space-y-2">
        <p>This section starts in an expanded state.</p>
        <p>Users can click the header to collapse it.</p>
      </div>
    ),
  },
};

export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-4">
      <CollapsibleSection title="Section 1: Getting Started">
        <p>Introduction and setup instructions for new users.</p>
      </CollapsibleSection>
      <CollapsibleSection title="Section 2: Configuration" defaultOpen>
        <p>Detailed configuration options and settings.</p>
      </CollapsibleSection>
      <CollapsibleSection title="Section 3: Advanced Topics">
        <p>Advanced features and customization options.</p>
      </CollapsibleSection>
    </div>
  ),
};

export const WithRichContent: Story = {
  args: {
    title: "Query Details",
    defaultOpen: true,
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">Completed</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">2.5 seconds</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rows Scanned</p>
            <p className="font-medium">1,234,567</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data Read</p>
            <p className="font-medium">45.2 MB</p>
          </div>
        </div>
      </div>
    ),
  },
};
