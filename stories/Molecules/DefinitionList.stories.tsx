import type { Meta, StoryObj } from "@storybook/react";
import { Cloud, MapPin, User, Calendar } from "lucide-react";
import { DefinitionList, StatusBadge, ExternalLink } from "../../src";

const meta: Meta<typeof DefinitionList> = {
  title: "Molecules/DefinitionList",
  component: DefinitionList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const workspaceDetails = [
  { term: "Name", description: "copsbeta-azure" },
  { term: "Version", description: "1.1.278" },
  { term: "Status", description: <StatusBadge status="disabled">Disabled</StatusBadge> },
  { term: "Region", description: "eastus" },
  { term: "Cloud", description: "AZURE" },
  { term: "Created by", description: "siddhanth@e6x.io" },
  { term: "Updated on", description: "18 Dec 2025, 05:08 PM" },
  { term: "Catalogs", description: <ExternalLink href="#">03</ExternalLink> },
  { term: "Clusters", description: <ExternalLink href="#">02</ExternalLink> },
  { term: "Workspace type", description: "Cloud prem" },
];

export const Horizontal: Story = {
  args: {
    items: workspaceDetails,
    layout: "horizontal",
    className: "w-[600px]",
  },
};

export const HorizontalStriped: Story = {
  args: {
    items: workspaceDetails,
    layout: "horizontal",
    striped: true,
    className: "w-[600px]",
  },
};

export const Vertical: Story = {
  args: {
    items: workspaceDetails.slice(0, 5),
    layout: "vertical",
    className: "w-[300px]",
  },
};

export const Grid2Columns: Story = {
  args: {
    items: [
      { term: "Cloud", description: "AZURE", icon: <Cloud className="h-4 w-4" /> },
      { term: "Region", description: "eastus", icon: <MapPin className="h-4 w-4" /> },
      { term: "Created by", description: "admin@e6x.io", icon: <User className="h-4 w-4" /> },
      { term: "Updated", description: "Dec 18, 2025", icon: <Calendar className="h-4 w-4" /> },
    ],
    layout: "grid",
    columns: 2,
    className: "w-[500px]",
  },
};

export const Grid4Columns: Story = {
  args: {
    items: [
      { term: "Queries", description: "1,234" },
      { term: "Avg Time", description: "2.5s" },
      { term: "Success Rate", description: "99.2%" },
      { term: "Data Scanned", description: "45 GB" },
    ],
    layout: "grid",
    columns: 4,
    bordered: true,
    className: "w-[700px]",
  },
};

export const NoBorder: Story = {
  args: {
    items: workspaceDetails.slice(0, 4),
    layout: "horizontal",
    bordered: false,
    className: "w-[600px]",
  },
};
