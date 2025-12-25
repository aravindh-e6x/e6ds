import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Terminal, Rocket } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../src";

const meta: Meta<typeof Alert> = {
  title: "Molecules/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "destructive"],
    },
    dismissible: {
      control: "boolean",
    },
    showIcon: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-[450px]">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational message to provide context.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[450px]">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[450px]">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Your session is about to expire. Please save your work.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[450px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <Alert className="w-[450px]" icon={<Terminal className="h-4 w-4" />}>
      <AlertTitle>Terminal Command</AlertTitle>
      <AlertDescription>
        Run <code className="font-mono bg-muted px-1">npm install</code> to get started.
      </AlertDescription>
    </Alert>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <Alert className="w-[450px]" showIcon={false}>
      <AlertTitle>Simple Alert</AlertTitle>
      <AlertDescription>
        This alert has no icon.
      </AlertDescription>
    </Alert>
  ),
};

export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) {
      return (
        <button
          onClick={() => setVisible(true)}
          className="text-sm text-muted-foreground underline"
        >
          Show alert again
        </button>
      );
    }

    return (
      <Alert
        variant="info"
        className="w-[450px]"
        dismissible
        onDismiss={() => setVisible(false)}
      >
        <AlertTitle>Dismissible Alert</AlertTitle>
        <AlertDescription>
          Click the X button to dismiss this alert.
        </AlertDescription>
      </Alert>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-[450px]">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Default alert style.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Informational alert style.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Success alert style.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Warning alert style.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Destructive alert style.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <Alert variant="info" className="w-[500px]">
      <AlertTitle className="flex items-center gap-2">
        <Rocket className="h-4 w-4" />
        New Feature Available
      </AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          We've released a new dashboard with improved analytics and reporting.
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Real-time data updates</li>
          <li>Custom chart configurations</li>
          <li>Export to multiple formats</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
};
