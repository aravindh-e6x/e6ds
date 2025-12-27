import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TagInput } from "../../src";

const meta: Meta<typeof TagInput> = {
  title: "Molecules/TagInput",
  component: TagInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    allowCreate: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const labelSuggestions = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
  "help-wanted",
  "good-first-issue",
  "priority-high",
  "priority-low",
  "wontfix",
  "duplicate",
  "invalid",
  "question",
];

const techTags = [
  "react",
  "typescript",
  "javascript",
  "nodejs",
  "python",
  "docker",
  "kubernetes",
  "aws",
  "gcp",
  "azure",
  "mongodb",
  "postgresql",
];

const categoryTags = [
  "frontend",
  "backend",
  "devops",
  "design",
  "testing",
  "security",
  "performance",
  "accessibility",
];

export const Default: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>([]);
    return (
      <div className="w-80">
        <TagInput
          options={labelSuggestions}
          value={tags}
          onChange={setTags}
          placeholder="Add labels..."
        />
        <p className="text-sm text-muted-foreground mt-2">
          Tags: {tags.length > 0 ? tags.join(", ") : "None"}
        </p>
      </div>
    );
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>(["bug", "priority-high"]);
    return (
      <div className="w-80">
        <TagInput
          options={labelSuggestions}
          value={tags}
          onChange={setTags}
          placeholder="Add labels..."
        />
      </div>
    );
  },
};

export const AllowCreateNew: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>([]);
    return (
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">
          Type a new tag name and press Enter to create it
        </p>
        <TagInput
          options={techTags}
          value={tags}
          onChange={setTags}
          placeholder="Add technologies..."
          allowCreate={true}
        />
      </div>
    );
  },
};

export const DisallowCreate: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>([]);
    return (
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">
          Can only select from predefined options
        </p>
        <TagInput
          options={categoryTags}
          value={tags}
          onChange={setTags}
          placeholder="Select categories..."
          allowCreate={false}
        />
      </div>
    );
  },
};

export const ManyTags: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>([
      "react",
      "typescript",
      "nodejs",
      "docker",
      "aws",
    ]);
    return (
      <div className="w-80">
        <TagInput
          options={techTags}
          value={tags}
          onChange={setTags}
          placeholder="Add technologies..."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <TagInput
        options={labelSuggestions}
        value={["bug", "feature"]}
        placeholder="Add labels..."
        disabled
      />
    </div>
  ),
};

export const NoSuggestions: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>([]);
    return (
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">
          Free-form tag input with no suggestions
        </p>
        <TagInput
          options={[]}
          value={tags}
          onChange={setTags}
          placeholder="Type and press Enter..."
          allowCreate={true}
        />
      </div>
    );
  },
};

export const IssueLabeling: Story = {
  render: () => {
    const [labels, setLabels] = React.useState<string[]>(["bug"]);

    return (
      <div className="w-96 p-4 border rounded-md space-y-4">
        <div>
          <h3 className="font-medium">Issue #1234</h3>
          <p className="text-sm text-muted-foreground">
            Fix authentication redirect loop
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Labels</label>
          <TagInput
            options={labelSuggestions}
            value={labels}
            onChange={setLabels}
            placeholder="Add labels..."
            allowCreate={true}
          />
        </div>
      </div>
    );
  },
};

export const BlogPostTags: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>([]);
    const blogTags = [
      "tutorial",
      "guide",
      "tips",
      "news",
      "announcement",
      "case-study",
      "interview",
      "opinion",
      "review",
      "comparison",
    ];

    return (
      <div className="w-96 p-4 border rounded-md space-y-4">
        <div>
          <h3 className="font-medium">New Blog Post</h3>
          <input
            type="text"
            placeholder="Post title..."
            className="w-full mt-2 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <TagInput
            options={blogTags}
            value={tags}
            onChange={setTags}
            placeholder="Add tags for SEO..."
            allowCreate={true}
          />
          <p className="text-xs text-muted-foreground">
            Add relevant tags to help readers find your post
          </p>
        </div>
      </div>
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>(["react"]);
    return (
      <div className="w-80 space-y-4">
        <TagInput
          options={techTags}
          value={tags}
          onChange={setTags}
          placeholder="Add technologies..."
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p><kbd className="px-1 bg-muted rounded">↑↓</kbd> Navigate suggestions</p>
          <p><kbd className="px-1 bg-muted rounded">Enter</kbd> Select or create tag</p>
          <p><kbd className="px-1 bg-muted rounded">Backspace</kbd> Remove last tag (when empty)</p>
          <p><kbd className="px-1 bg-muted rounded">Esc</kbd> Close suggestions</p>
        </div>
      </div>
    );
  },
};
