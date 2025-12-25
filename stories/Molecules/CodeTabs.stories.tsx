import type { Meta, StoryObj } from "@storybook/react";
import { CodeTabs } from "../../src";

const meta = {
  title: "Molecules/CodeTabs",
  component: CodeTabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CodeTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      {
        label: "JavaScript",
        language: "javascript",
        code: `const greeting = "Hello, World!";
console.log(greeting);

function add(a, b) {
  return a + b;
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        code: `const greeting: string = "Hello, World!";
console.log(greeting);

function add(a: number, b: number): number {
  return a + b;
}`,
      },
      {
        label: "Python",
        language: "python",
        code: `greeting = "Hello, World!"
print(greeting)

def add(a, b):
    return a + b`,
      },
    ],
  },
};

export const InstallCommands: Story = {
  args: {
    tabs: [
      {
        label: "npm",
        code: "npm install @e6data/design-system",
      },
      {
        label: "yarn",
        code: "yarn add @e6data/design-system",
      },
      {
        label: "pnpm",
        code: "pnpm add @e6data/design-system",
      },
    ],
  },
};

export const SingleTab: Story = {
  args: {
    tabs: [
      {
        label: "Example",
        language: "jsx",
        code: `import { Button } from "@e6data/design-system";

export function App() {
  return <Button>Click me</Button>;
}`,
      },
    ],
  },
};
