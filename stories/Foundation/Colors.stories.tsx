import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundation/Colors",
};

export default meta;

const ColorSwatch = ({
  name,
  cssVar,
  description,
}: {
  name: string;
  cssVar: string;
  description?: string;
}) => (
  <div className="flex items-center gap-4 p-2">
    <div
      className="h-12 w-12 border border-border"
      style={{ backgroundColor: `var(${cssVar})` }}
    />
    <div>
      <div className="font-medium">{name}</div>
      <code className="text-sm text-muted-foreground">{cssVar}</code>
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  </div>
);

export const BrandColors: StoryObj = {
  render: () => (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Brand Colors</h2>
      <div className="grid gap-2">
        <ColorSwatch
          name="E6 Green"
          cssVar="--primary"
          description="Primary CTA color"
        />
        <ColorSwatch
          name="E6 Purple"
          cssVar="--link"
          description="Link color"
        />
        <ColorSwatch
          name="E6 Cream"
          cssVar="--background"
          description="Background"
        />
        <ColorSwatch
          name="E6 Dark"
          cssVar="--foreground"
          description="Primary text"
        />
        <ColorSwatch
          name="E6 Beige"
          cssVar="--secondary"
          description="Secondary background"
        />
        <ColorSwatch
          name="E6 Gray"
          cssVar="--muted-foreground"
          description="Muted text"
        />
      </div>
    </div>
  ),
};

export const SemanticColors: StoryObj = {
  render: () => (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Semantic Colors</h2>
      <div className="grid gap-2">
        <ColorSwatch name="Primary" cssVar="--primary" />
        <ColorSwatch name="Primary Foreground" cssVar="--primary-foreground" />
        <ColorSwatch name="Secondary" cssVar="--secondary" />
        <ColorSwatch name="Secondary Foreground" cssVar="--secondary-foreground" />
        <ColorSwatch name="Muted" cssVar="--muted" />
        <ColorSwatch name="Muted Foreground" cssVar="--muted-foreground" />
        <ColorSwatch name="Accent" cssVar="--accent" />
        <ColorSwatch name="Accent Foreground" cssVar="--accent-foreground" />
        <ColorSwatch name="Destructive" cssVar="--destructive" />
        <ColorSwatch name="Destructive Foreground" cssVar="--destructive-foreground" />
      </div>
    </div>
  ),
};

export const SurfaceColors: StoryObj = {
  render: () => (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Surface Colors</h2>
      <div className="grid gap-2">
        <ColorSwatch name="Background" cssVar="--background" />
        <ColorSwatch name="Foreground" cssVar="--foreground" />
        <ColorSwatch name="Card" cssVar="--card" />
        <ColorSwatch name="Card Foreground" cssVar="--card-foreground" />
        <ColorSwatch name="Popover" cssVar="--popover" />
        <ColorSwatch name="Popover Foreground" cssVar="--popover-foreground" />
        <ColorSwatch name="Border" cssVar="--border" />
        <ColorSwatch name="Input" cssVar="--input" />
        <ColorSwatch name="Ring" cssVar="--ring" />
      </div>
    </div>
  ),
};

export const ChartColors: StoryObj = {
  render: () => (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Chart Colors</h2>
      <div className="grid gap-2">
        <ColorSwatch name="Chart 1" cssVar="--chart-1" />
        <ColorSwatch name="Chart 2" cssVar="--chart-2" />
        <ColorSwatch name="Chart 3" cssVar="--chart-3" />
        <ColorSwatch name="Chart 4" cssVar="--chart-4" />
        <ColorSwatch name="Chart 5" cssVar="--chart-5" />
      </div>
    </div>
  ),
};
