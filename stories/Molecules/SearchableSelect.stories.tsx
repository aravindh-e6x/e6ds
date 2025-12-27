import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SearchableSelect } from "../../src";
import type { SearchableSelectOption } from "../../src";

const meta: Meta<typeof SearchableSelect> = {
  title: "Molecules/SearchableSelect",
  component: SearchableSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const countries: SearchableSelectOption[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "mx", label: "Mexico" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "kr", label: "South Korea" },
  { value: "nl", label: "Netherlands" },
];

const timezones: SearchableSelectOption[] = [
  { value: "utc", label: "UTC (Coordinated Universal Time)" },
  { value: "est", label: "EST (Eastern Standard Time)" },
  { value: "pst", label: "PST (Pacific Standard Time)" },
  { value: "cst", label: "CST (Central Standard Time)" },
  { value: "mst", label: "MST (Mountain Standard Time)" },
  { value: "gmt", label: "GMT (Greenwich Mean Time)" },
  { value: "cet", label: "CET (Central European Time)" },
  { value: "jst", label: "JST (Japan Standard Time)" },
  { value: "ist", label: "IST (India Standard Time)" },
  { value: "aest", label: "AEST (Australian Eastern Standard Time)" },
];

const databases: SearchableSelectOption[] = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "oracle", label: "Oracle" },
  { value: "mssql", label: "Microsoft SQL Server" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-72">
        <SearchableSelect
          options={countries}
          value={value}
          onChange={setValue}
          placeholder="Select country..."
        />
      </div>
    );
  },
};

export const WithPreselectedValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("us");
    return (
      <div className="w-72">
        <SearchableSelect
          options={countries}
          value={value}
          onChange={setValue}
          placeholder="Select country..."
        />
      </div>
    );
  },
};

export const LongLabels: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-80">
        <SearchableSelect
          options={timezones}
          value={value}
          onChange={setValue}
          placeholder="Select timezone..."
          searchPlaceholder="Search timezones..."
        />
      </div>
    );
  },
};

export const CustomPlaceholders: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-72">
        <SearchableSelect
          options={databases}
          value={value}
          onChange={setValue}
          placeholder="Choose a database..."
          searchPlaceholder="Type to filter..."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <SearchableSelect
        options={countries}
        value="us"
        placeholder="Select country..."
        disabled
      />
    </div>
  ),
};

export const InForm: Story = {
  render: () => {
    const [country, setCountry] = React.useState<string>("");
    const [timezone, setTimezone] = React.useState<string>("");
    const [database, setDatabase] = React.useState<string>("");

    return (
      <div className="w-96 space-y-4 p-4 border rounded-md">
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <SearchableSelect
            options={countries}
            value={country}
            onChange={setCountry}
            placeholder="Select country..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Timezone</label>
          <SearchableSelect
            options={timezones}
            value={timezone}
            onChange={setTimezone}
            placeholder="Select timezone..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Database</label>
          <SearchableSelect
            options={databases}
            value={database}
            onChange={setDatabase}
            placeholder="Select database..."
          />
        </div>
        <div className="pt-2 text-sm text-muted-foreground border-t">
          <p>Country: {country || "Not selected"}</p>
          <p>Timezone: {timezone || "Not selected"}</p>
          <p>Database: {database || "Not selected"}</p>
        </div>
      </div>
    );
  },
};

export const EmptyOptions: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="w-72">
        <SearchableSelect
          options={[]}
          value={value}
          onChange={setValue}
          placeholder="No options available..."
        />
      </div>
    );
  },
};
