import type { Meta, StoryObj } from "@storybook/react";
import { Home, Settings, Users } from "lucide-react";
import { Breadcrumb } from "../../src";

const meta: Meta<typeof Breadcrumb> = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Workspace", href: "#" },
      { label: "copsbeta-azure" },
    ],
  },
};

export const WithHomeIcon: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Settings", href: "#" },
      { label: "Profile" },
    ],
    showHomeIcon: true,
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: "Home", href: "#", icon: <Home className="h-4 w-4" /> },
      { label: "Settings", href: "#", icon: <Settings className="h-4 w-4" /> },
      { label: "Users", icon: <Users className="h-4 w-4" /> },
    ],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Projects", href: "#" },
      { label: "E6Data", href: "#" },
      { label: "Workspaces", href: "#" },
      { label: "copsbeta-azure" },
    ],
  },
};

export const WithMaxItems: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Projects", href: "#" },
      { label: "E6Data", href: "#" },
      { label: "Workspaces", href: "#" },
      { label: "copsbeta-azure" },
    ],
    maxItems: 3,
  },
};
