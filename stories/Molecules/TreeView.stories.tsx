import type { Meta, StoryObj } from "@storybook/react";
import { Database, Table, Columns } from "lucide-react";
import { TreeView } from "../../src";
import type { TreeNode } from "../../src";

const meta: Meta<typeof TreeView> = {
  title: "Molecules/TreeView",
  component: TreeView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const schemaData: TreeNode[] = [
  {
    id: "hive",
    label: "hive",
    icon: <Database className="h-4 w-4" />,
    children: [
      {
        id: "hive-default",
        label: "default",
        icon: <Table className="h-4 w-4" />,
        children: [
          { id: "hive-default-users", label: "users", icon: <Columns className="h-4 w-4" /> },
          { id: "hive-default-orders", label: "orders", icon: <Columns className="h-4 w-4" /> },
          { id: "hive-default-products", label: "products", icon: <Columns className="h-4 w-4" /> },
        ],
      },
    ],
  },
  {
    id: "main",
    label: "main",
    icon: <Database className="h-4 w-4" />,
    children: [
      {
        id: "main-analytics",
        label: "analytics",
        icon: <Table className="h-4 w-4" />,
        children: [
          { id: "main-analytics-events", label: "events", icon: <Columns className="h-4 w-4" /> },
          { id: "main-analytics-sessions", label: "sessions", icon: <Columns className="h-4 w-4" /> },
        ],
      },
    ],
  },
  {
    id: "metacatalog",
    label: "metacatalog",
    icon: <Database className="h-4 w-4" />,
    children: [],
  },
];

export const Default: Story = {
  args: {
    data: schemaData,
    className: "w-[250px] border",
  },
};

export const WithCheckboxes: Story = {
  args: {
    data: schemaData,
    showCheckboxes: true,
    className: "w-[250px] border",
  },
};

export const ExpandedByDefault: Story = {
  args: {
    data: schemaData,
    expandedIds: ["hive", "hive-default", "main"],
    className: "w-[250px] border",
  },
};

export const SingleSelect: Story = {
  args: {
    data: schemaData,
    showCheckboxes: true,
    multiSelect: false,
    className: "w-[250px] border",
  },
};
