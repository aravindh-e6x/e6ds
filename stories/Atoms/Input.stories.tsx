import type { Meta, StoryObj } from "@storybook/react";
import { Input, Label } from "../../src";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>`,
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Input placeholder="Disabled input" disabled />`,
      },
    },
  },
};

export const WithType: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input type="text" id="text" placeholder="Text input" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="number">Number</Label>
        <Input type="number" id="number" placeholder="123" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Input type="text" placeholder="Text input" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="123" />
<Input type="file" />`,
      },
    },
  },
};
