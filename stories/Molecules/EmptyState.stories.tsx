import type { Meta, StoryObj } from "@storybook/react";
import { FileQuestion, Inbox, Search, Database } from "lucide-react";
import { EmptyState } from "../../src";

const meta: Meta<typeof EmptyState> = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Inbox className="h-8 w-8 text-muted-foreground" />,
    title: "No data available",
    description: "There are no items to display at this time.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <Database className="h-8 w-8 text-muted-foreground" />,
    title: "Let's set up your first Pools!",
    description: "Create a pool to get started with your data processing.",
    action: {
      label: "Create Pool",
      onClick: () => alert("Create Pool clicked"),
    },
  },
};

export const WithBothActions: Story = {
  args: {
    icon: <FileQuestion className="h-8 w-8 text-muted-foreground" />,
    title: "No results found",
    description: "We couldn't find any matching results.",
    action: {
      label: "Clear filters",
      onClick: () => alert("Clear filters clicked"),
    },
    secondaryAction: {
      label: "Learn more",
      onClick: () => alert("Learn more clicked"),
    },
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <Search className="h-8 w-8 text-muted-foreground" />,
    title: "No search results",
    description: "Try adjusting your search or filter to find what you're looking for.",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    icon: <Inbox className="h-10 w-10 text-muted-foreground" />,
    title: "Welcome to your dashboard",
    description: "You don't have any projects yet. Create your first project to get started.",
    action: {
      label: "Create Project",
      onClick: () => alert("Create Project clicked"),
    },
    size: "lg",
  },
};

// Custom illustration example
const RocketIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="50" fill="#f3f4f6" />
    <path d="M60 30L75 70H45L60 30Z" fill="#8b5cf6" />
    <circle cx="60" cy="80" r="10" fill="#fbbf24" />
  </svg>
);

export const WithIllustration: Story = {
  args: {
    illustration: <RocketIllustration />,
    title: "Ready for launch!",
    description: "Your workspace is all set up and ready to go.",
    action: {
      label: "Get Started",
      onClick: () => alert("Get Started clicked"),
    },
  },
};
