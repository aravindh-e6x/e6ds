import type { Meta, StoryObj } from "@storybook/react";
import { TableOfContents } from "../../src";

const meta = {
  title: "Molecules/TableOfContents",
  component: TableOfContents,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { id: "introduction", title: "Introduction", level: 2 },
      { id: "installation", title: "Installation", level: 2 },
      { id: "npm", title: "npm", level: 3 },
      { id: "yarn", title: "yarn", level: 3 },
      { id: "usage", title: "Usage", level: 2 },
      { id: "basic-example", title: "Basic Example", level: 3 },
      { id: "advanced", title: "Advanced", level: 3 },
      { id: "api", title: "API Reference", level: 2 },
    ],
    activeId: "installation",
  },
};

export const DeepNesting: Story = {
  args: {
    items: [
      { id: "getting-started", title: "Getting Started", level: 2 },
      { id: "prerequisites", title: "Prerequisites", level: 3 },
      { id: "node-version", title: "Node.js Version", level: 4 },
      { id: "package-manager", title: "Package Manager", level: 4 },
      { id: "configuration", title: "Configuration", level: 2 },
      { id: "environment", title: "Environment Variables", level: 3 },
      { id: "deployment", title: "Deployment", level: 2 },
    ],
    activeId: "getting-started",
  },
};

export const WithScrollContent: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="space-y-16 pb-32">
          <section id="overview">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground">
              This is the overview section with introduction content.
            </p>
          </section>
          <section id="features">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <p className="text-muted-foreground">
              List of features and capabilities.
            </p>
          </section>
          <section id="architecture">
            <h2 className="text-2xl font-bold mb-4">Architecture</h2>
            <p className="text-muted-foreground">
              Technical architecture details.
            </p>
          </section>
        </div>
      </div>
      <div className="w-48 sticky top-4 self-start">
        <TableOfContents
          items={[
            { id: "overview", title: "Overview", level: 2 },
            { id: "features", title: "Features", level: 2 },
            { id: "architecture", title: "Architecture", level: 2 },
          ]}
        />
      </div>
    </div>
  ),
};
