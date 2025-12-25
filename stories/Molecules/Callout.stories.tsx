import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "../../src";

const meta = {
  title: "Molecules/Callout",
  component: Callout,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    children: "This is an informational callout that provides helpful context to the user.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "This action may have unintended consequences. Please review before proceeding.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    children: "An error occurred while processing your request. Please try again.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "Your changes have been saved successfully.",
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "info",
    children: "A simple callout without a title.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Callout variant="info" title="Information">
        This is an informational callout.
      </Callout>
      <Callout variant="warning" title="Warning">
        This is a warning callout.
      </Callout>
      <Callout variant="error" title="Error">
        This is an error callout.
      </Callout>
      <Callout variant="success" title="Success">
        This is a success callout.
      </Callout>
    </div>
  ),
};
