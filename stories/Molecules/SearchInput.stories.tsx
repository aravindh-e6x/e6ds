import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "../../src";

const meta: Meta<typeof SearchInput> = {
  title: "Molecules/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="Search by Name, Created by, Status"
        className="w-[300px]"
      />
    );
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("example search");
    return (
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="Search..."
        className="w-[300px]"
      />
    );
  },
};

export const NoClearButton: Story = {
  args: {
    placeholder: "Search without clear button",
    showClearButton: false,
    className: "w-[300px]",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled search",
    disabled: true,
    className: "w-[300px]",
  },
};
