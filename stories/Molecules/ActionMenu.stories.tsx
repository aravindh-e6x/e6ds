import type { Meta, StoryObj } from "@storybook/react";
import { Edit, Trash, Copy, Download, Play, Pause, Settings } from "lucide-react";
import { ActionMenu, Button } from "../../src";

const meta: Meta<typeof ActionMenu> = {
  title: "Molecules/ActionMenu",
  component: ActionMenu,
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
      { label: "Edit", icon: <Edit className="h-4 w-4" />, onClick: () => alert("Edit") },
      { label: "Duplicate", icon: <Copy className="h-4 w-4" />, onClick: () => alert("Duplicate") },
      { label: "Download", icon: <Download className="h-4 w-4" />, onClick: () => alert("Download") },
      { separator: true, label: "" },
      { label: "Delete", icon: <Trash className="h-4 w-4" />, destructive: true, onClick: () => alert("Delete") },
    ],
  },
};

export const WorkspaceActions: Story = {
  args: {
    items: [
      { label: "Start", icon: <Play className="h-4 w-4" />, onClick: () => alert("Start") },
      { label: "Stop", icon: <Pause className="h-4 w-4" />, onClick: () => alert("Stop") },
      { label: "Settings", icon: <Settings className="h-4 w-4" />, onClick: () => alert("Settings") },
      { separator: true, label: "" },
      { label: "Delete", icon: <Trash className="h-4 w-4" />, destructive: true, onClick: () => alert("Delete") },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { label: "Edit", icon: <Edit className="h-4 w-4" />, onClick: () => alert("Edit") },
      { label: "Delete", icon: <Trash className="h-4 w-4" />, disabled: true, onClick: () => alert("Delete") },
    ],
  },
};

export const CustomTrigger: Story = {
  args: {
    items: [
      { label: "Edit", onClick: () => alert("Edit") },
      { label: "Delete", destructive: true, onClick: () => alert("Delete") },
    ],
    trigger: <Button variant="outline" size="sm">Actions</Button>,
  },
};

export const AlignStart: Story = {
  args: {
    items: [
      { label: "Option 1", onClick: () => alert("Option 1") },
      { label: "Option 2", onClick: () => alert("Option 2") },
      { label: "Option 3", onClick: () => alert("Option 3") },
    ],
    align: "start",
  },
};
