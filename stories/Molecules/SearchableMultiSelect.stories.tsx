import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SearchableMultiSelect } from "../../src";
import type { SearchableMultiSelectOption } from "../../src";

const meta: Meta<typeof SearchableMultiSelect> = {
  title: "Molecules/SearchableMultiSelect",
  component: SearchableMultiSelect,
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

const frameworks: SearchableMultiSelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const languages: SearchableMultiSelectOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
];

const skills: SearchableMultiSelectOption[] = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "devops", label: "DevOps & CI/CD" },
  { value: "mobile", label: "Mobile Development" },
  { value: "database", label: "Database Administration" },
  { value: "cloud", label: "Cloud Architecture" },
  { value: "security", label: "Security Engineering" },
  { value: "ml", label: "Machine Learning" },
  { value: "data", label: "Data Engineering" },
];

export const Default: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    return (
      <div className="w-80">
        <SearchableMultiSelect
          options={frameworks}
          value={values}
          onChange={setValues}
          placeholder="Select frameworks..."
        />
        <p className="text-sm text-muted-foreground mt-2">
          Selected: {values.length > 0 ? values.join(", ") : "None"}
        </p>
      </div>
    );
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(["react", "typescript"]);
    return (
      <div className="w-80">
        <SearchableMultiSelect
          options={[...frameworks, ...languages].slice(0, 12)}
          value={values}
          onChange={setValues}
          placeholder="Select technologies..."
        />
      </div>
    );
  },
};

export const ManySelections: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([
      "react",
      "vue",
      "angular",
      "svelte",
      "nextjs",
    ]);
    return (
      <div className="w-80">
        <SearchableMultiSelect
          options={frameworks}
          value={values}
          onChange={setValues}
          placeholder="Select frameworks..."
        />
      </div>
    );
  },
};

export const LongLabels: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    return (
      <div className="w-96">
        <SearchableMultiSelect
          options={skills}
          value={values}
          onChange={setValues}
          placeholder="Select skills..."
          searchPlaceholder="Search skills..."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <SearchableMultiSelect
        options={frameworks}
        value={["react", "vue"]}
        placeholder="Select frameworks..."
        disabled
      />
    </div>
  ),
};

export const InForm: Story = {
  render: () => {
    const [languages, setLanguages] = React.useState<string[]>([]);
    const [frameworks, setFrameworks] = React.useState<string[]>([]);
    const [skills, setSkills] = React.useState<string[]>([]);

    const languageOptions: SearchableMultiSelectOption[] = [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "rust", label: "Rust" },
      { value: "go", label: "Go" },
    ];

    const frameworkOptions: SearchableMultiSelectOption[] = [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "angular", label: "Angular" },
      { value: "nextjs", label: "Next.js" },
    ];

    const skillOptions: SearchableMultiSelectOption[] = [
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
      { value: "devops", label: "DevOps" },
      { value: "mobile", label: "Mobile" },
    ];

    return (
      <div className="w-96 space-y-4 p-4 border rounded-md">
        <h3 className="font-medium">Developer Profile</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Languages</label>
          <SearchableMultiSelect
            options={languageOptions}
            value={languages}
            onChange={setLanguages}
            placeholder="Select languages..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Frameworks</label>
          <SearchableMultiSelect
            options={frameworkOptions}
            value={frameworks}
            onChange={setFrameworks}
            placeholder="Select frameworks..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <SearchableMultiSelect
            options={skillOptions}
            value={skills}
            onChange={setSkills}
            placeholder="Select skills..."
          />
        </div>
        <div className="pt-2 text-sm text-muted-foreground border-t space-y-1">
          <p>Languages: {languages.join(", ") || "None"}</p>
          <p>Frameworks: {frameworks.join(", ") || "None"}</p>
          <p>Skills: {skills.join(", ") || "None"}</p>
        </div>
      </div>
    );
  },
};

export const FilterExample: Story = {
  render: () => {
    const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

    const statusOptions: SearchableMultiSelectOption[] = [
      { value: "pending", label: "Pending" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "failed", label: "Failed" },
      { value: "cancelled", label: "Cancelled" },
    ];

    return (
      <div className="w-72">
        <label className="text-sm font-medium mb-2 block">Filter by Status</label>
        <SearchableMultiSelect
          options={statusOptions}
          value={selectedStatuses}
          onChange={setSelectedStatuses}
          placeholder="All statuses"
          searchPlaceholder="Search statuses..."
        />
      </div>
    );
  },
};
