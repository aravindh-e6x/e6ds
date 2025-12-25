import type { Meta, StoryObj } from "@storybook/react";
import { Switch, Label } from "../../src";

const meta: Meta<typeof Switch> = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Switch />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked />
      <Label htmlFor="checked">Enabled</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled" className="opacity-50">
          Disabled off
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="opacity-50">
          Disabled on
        </Label>
      </div>
    </div>
  ),
};

export const SettingsList: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="notifications" className="text-sm font-medium">
            Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications about updates
          </p>
        </div>
        <Switch id="notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="marketing" className="text-sm font-medium">
            Marketing emails
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive marketing emails
          </p>
        </div>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="security" className="text-sm font-medium">
            Security alerts
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive security alerts
          </p>
        </div>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
};
