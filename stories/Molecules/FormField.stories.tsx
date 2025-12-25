import type { Meta, StoryObj } from "@storybook/react";
import { FormField, Input, Textarea, Checkbox, Label } from "../../src";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FormField label="Email" className="w-[300px]">
      <Input type="email" placeholder="Enter your email" />
    </FormField>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <FormField
      label="Username"
      description="This will be your public display name."
      className="w-[300px]"
    >
      <Input placeholder="johndoe" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField
      label="Password"
      error="Password must be at least 8 characters."
      className="w-[300px]"
    >
      <Input type="password" placeholder="Enter password" />
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField label="Full Name" required className="w-[300px]">
      <Input placeholder="John Doe" />
    </FormField>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <FormField
      label="Bio"
      description="Write a short bio about yourself."
      className="w-[300px]"
    >
      <Textarea placeholder="Tell us about yourself..." />
    </FormField>
  ),
};

export const CompleteForm: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <FormField label="Name" required>
        <Input placeholder="Enter your name" />
      </FormField>
      <FormField
        label="Email"
        required
        description="We'll never share your email."
      >
        <Input type="email" placeholder="you@example.com" />
      </FormField>
      <FormField label="Message">
        <Textarea placeholder="Your message..." />
      </FormField>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  ),
};
