import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Label } from "../../src";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">This is checked</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" className="opacity-50">
          Disabled unchecked
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked" className="opacity-50">
          Disabled checked
        </Label>
      </div>
    </div>
  ),
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-base">Select your interests</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="react" />
          <Label htmlFor="react">React</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="vue" />
          <Label htmlFor="vue">Vue</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="angular" />
          <Label htmlFor="angular">Angular</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="svelte" />
          <Label htmlFor="svelte">Svelte</Label>
        </div>
      </div>
    </div>
  ),
};
