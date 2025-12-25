import type { Meta, StoryObj } from "@storybook/react";
import { PageNavigation } from "../../src";

const meta = {
  title: "Organisms/PageNavigation",
  component: PageNavigation,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PageNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    previous: {
      title: "Introduction",
      href: "/docs/introduction",
    },
    next: {
      title: "Getting Started",
      href: "/docs/getting-started",
    },
  },
};

export const NextOnly: Story = {
  args: {
    next: {
      title: "Installation Guide",
      href: "/docs/installation",
    },
  },
};

export const PreviousOnly: Story = {
  args: {
    previous: {
      title: "API Reference",
      href: "/docs/api",
    },
  },
};

export const WithNavigateHandler: Story = {
  args: {
    previous: {
      title: "Components",
      href: "/docs/components",
    },
    next: {
      title: "Examples",
      href: "/docs/examples",
    },
    onNavigate: (href: string) => {
      console.log("Navigating to:", href);
      alert(`Would navigate to: ${href}`);
    },
  },
};

export const LongTitles: Story = {
  args: {
    previous: {
      title: "Understanding the Architecture and Design Patterns",
      href: "/docs/architecture",
    },
    next: {
      title: "Advanced Configuration and Customization Options",
      href: "/docs/advanced-config",
    },
  },
};
