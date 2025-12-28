import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Database,
  Table,
  FileText,
  Users,
  Settings,
  Globe,
} from "lucide-react";
import { Combobox } from "../../src";
import type { ComboboxOption } from "../../src";

const meta: Meta<typeof Combobox> = {
  title: "Molecules/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    clearable: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
];

const databases: ComboboxOption[] = [
  {
    value: "postgres",
    label: "PostgreSQL",
    icon: <Database className="h-4 w-4" />,
    description: "Advanced open-source database",
  },
  {
    value: "mysql",
    label: "MySQL",
    icon: <Database className="h-4 w-4" />,
    description: "Popular relational database",
  },
  {
    value: "mongodb",
    label: "MongoDB",
    icon: <Database className="h-4 w-4" />,
    description: "Document-oriented NoSQL",
  },
  {
    value: "redis",
    label: "Redis",
    icon: <Database className="h-4 w-4" />,
    description: "In-memory data store",
  },
  {
    value: "elasticsearch",
    label: "Elasticsearch",
    icon: <Database className="h-4 w-4" />,
    description: "Search and analytics engine",
    disabled: true,
  },
];

const countries: ComboboxOption[] = [
  { value: "us", label: "United States", icon: <Globe className="h-4 w-4" /> },
  { value: "uk", label: "United Kingdom", icon: <Globe className="h-4 w-4" /> },
  { value: "ca", label: "Canada", icon: <Globe className="h-4 w-4" /> },
  { value: "de", label: "Germany", icon: <Globe className="h-4 w-4" /> },
  { value: "fr", label: "France", icon: <Globe className="h-4 w-4" /> },
  { value: "jp", label: "Japan", icon: <Globe className="h-4 w-4" /> },
  { value: "au", label: "Australia", icon: <Globe className="h-4 w-4" /> },
  { value: "br", label: "Brazil", icon: <Globe className="h-4 w-4" /> },
  { value: "in", label: "India", icon: <Globe className="h-4 w-4" /> },
  { value: "cn", label: "China", icon: <Globe className="h-4 w-4" /> },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-72">
        <Combobox
          options={frameworks}
          value={value}
          onValueChange={(v) => setValue(v as string)}
          placeholder="Select framework..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<string>("");

<Combobox
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ]}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework..."
/>`,
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-80">
        <Combobox
          options={databases}
          value={value}
          onValueChange={(v) => setValue(v as string)}
          placeholder="Select database..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<string>("");

const options = [
  { value: "postgres", label: "PostgreSQL", icon: <Database />, description: "Advanced open-source database" },
  { value: "mysql", label: "MySQL", icon: <Database />, description: "Popular relational database" },
];

<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select database..."
/>`,
      },
    },
  },
};

export const Multiple: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    return (
      <div className="w-80">
        <Combobox
          options={frameworks}
          value={values}
          onValueChange={(v) => setValues(v as string[])}
          placeholder="Select frameworks..."
          multiple
        />
        <p className="text-sm text-muted-foreground mt-2">
          Selected: {values.join(", ") || "None"}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [values, setValues] = useState<string[]>([]);

<Combobox
  options={frameworks}
  value={values}
  onValueChange={setValues}
  placeholder="Select frameworks..."
  multiple
/>`,
      },
    },
  },
};

export const MultipleWithPreselected: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(["react", "vue"]);
    return (
      <div className="w-80">
        <Combobox
          options={frameworks}
          value={values}
          onValueChange={(v) => setValues(v as string[])}
          placeholder="Select frameworks..."
          multiple
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [values, setValues] = useState<string[]>(["react", "vue"]);

<Combobox
  options={frameworks}
  value={values}
  onValueChange={setValues}
  placeholder="Select frameworks..."
  multiple
/>`,
      },
    },
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("react");
    return (
      <div className="w-72">
        <Combobox
          options={frameworks}
          value={value}
          onValueChange={(v) => setValue(v as string)}
          placeholder="Select framework..."
          clearable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<string>("react");

<Combobox
  options={frameworks}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework..."
  clearable
/>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Combobox
        options={frameworks}
        value="react"
        placeholder="Select framework..."
        disabled
      />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Combobox
  options={frameworks}
  value="react"
  placeholder="Select framework..."
  disabled
/>`,
      },
    },
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-96">
        <Combobox
          options={databases}
          value={value}
          onValueChange={(v) => setValue(v as string)}
          placeholder="Choose a database..."
          searchPlaceholder="Search databases..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<string>("");

<Combobox
  options={databases}
  value={value}
  onValueChange={setValue}
  placeholder="Choose a database..."
  searchPlaceholder="Search databases..."
/>`,
      },
    },
  },
};

export const LongList: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-72">
        <Combobox
          options={countries}
          value={value}
          onValueChange={(v) => setValue(v as string)}
          placeholder="Select country..."
          searchPlaceholder="Search countries..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<string>("");

<Combobox
  options={countries}
  value={value}
  onValueChange={setValue}
  placeholder="Select country..."
  searchPlaceholder="Search countries..."
/>`,
      },
    },
  },
};

export const CustomEmptyText: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-72">
        <Combobox
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
          ]}
          value={value}
          onValueChange={(v) => setValue(v as string)}
          placeholder="Select..."
          emptyText="No matching options. Try a different search."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<string>("");

<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select..."
  emptyText="No matching options. Try a different search."
/>`,
      },
    },
  },
};

export const InForm: Story = {
  render: () => {
    const [database, setDatabase] = React.useState<string>("");
    const [regions, setRegions] = React.useState<string[]>([]);

    return (
      <div className="w-96 space-y-4 p-4 border">
        <div className="space-y-2">
          <label className="text-sm font-medium">Database</label>
          <Combobox
            options={databases}
            value={database}
            onValueChange={(v) => setDatabase(v as string)}
            placeholder="Select database..."
            clearable
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Regions</label>
          <Combobox
            options={countries}
            value={regions}
            onValueChange={(v) => setRegions(v as string[])}
            placeholder="Select regions..."
            multiple
          />
        </div>
        <div className="pt-2 text-sm text-muted-foreground">
          <p>Database: {database || "Not selected"}</p>
          <p>Regions: {regions.join(", ") || "None"}</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [database, setDatabase] = useState<string>("");
const [regions, setRegions] = useState<string[]>([]);

<div className="space-y-4">
  <div className="space-y-2">
    <label>Database</label>
    <Combobox
      options={databases}
      value={database}
      onValueChange={setDatabase}
      placeholder="Select database..."
      clearable
    />
  </div>
  <div className="space-y-2">
    <label>Regions</label>
    <Combobox
      options={countries}
      value={regions}
      onValueChange={setRegions}
      placeholder="Select regions..."
      multiple
    />
  </div>
</div>`,
      },
    },
  },
};
