# @e6data/design-system

E6Data Design System - Shared React components and design tokens for building consistent UIs.

## Installation

```bash
npm install @e6data/design-system
```

## Setup

### 1. Import styles

In your app's global CSS or layout file:

```tsx
import "@e6data/design-system/styles";
```

### 2. Configure Tailwind (optional)

If you want to use the design tokens in your own Tailwind classes, extend your config:

```ts
// tailwind.config.ts
import { e6Preset } from "@e6data/design-system/tailwind-preset";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [e6Preset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@e6data/design-system/dist/**/*.js",
  ],
};

export default config;
```

## Usage

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  LineChart,
  MetricCard,
  DataTable,
  useToast,
} from "@e6data/design-system";
import "@e6data/design-system/styles";

function Dashboard() {
  return (
    <div className="grid gap-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        change="+20.1%"
        changeType="positive"
      />
      <LineChart
        title="Traffic"
        data={[...]}
        xAxisKey="time"
        lines={[{ dataKey: "value", name: "Visitors" }]}
      />
    </div>
  );
}
```

## Components

### Primitives
- **Button** - Primary action button with variants (default, destructive, outline, secondary, ghost, link)
- **Card** - Container with header, content, footer sections
- **Avatar** - User avatar with image and fallback
- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Label** - Form label
- **Select** - Dropdown select with groups
- **Dialog** - Modal dialog
- **AlertDialog** - Confirmation dialog
- **DropdownMenu** - Context menu with submenus
- **Tabs** - Tab navigation
- **Badge** - Status indicators with variants
- **Tooltip** - Hover tooltips
- **Popover** - Click-triggered popover
- **Separator** - Horizontal/vertical divider
- **ScrollArea** - Custom scrollbar container
- **Toast** - Notification toasts

### Forms
- **FormField** - Wrapper with label, description, error states
- **Checkbox** - Checkbox input
- **RadioGroup** - Radio button group
- **Switch** - Toggle switch
- **Slider** - Range slider

### Layout
- **Sidebar** - Collapsible navigation sidebar
- **SidebarItem** - Navigation item with icon
- **SidebarSection** - Grouped sidebar items
- **TopBar** - App header bar
- **MainContent** - Main content area
- **PageHeader** - Page title with actions
- **PageContent** - Padded content container

### Data Display
- **MetricCard** - KPI display with change indicator
- **StatCard** - Statistics with trend
- **Progress** - Linear progress bar
- **CircularProgress** - Circular progress indicator
- **DataTable** - Data table with sorting, loading states

### Charts (powered by Recharts)
- **LineChart** - Line chart for time series
- **AreaChart** - Filled area chart
- **BarChart** - Bar chart with horizontal/vertical layout
- **PieChart** - Pie/donut chart
- **ChartContainer** - Wrapper with title and loading states
- **ChartTooltip** - Styled chart tooltip

### Hooks
- **useToast** - Toast notification hook

## Design Tokens

### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--e6-green` | `rgb(73 245 159)` | Primary CTA |
| `--e6-purple` | `rgb(136 0 255)` | Links |
| `--e6-cream` | `rgb(255 253 250)` | Background |
| `--e6-dark` | `rgb(51 50 46)` | Text |
| `--e6-beige` | `rgb(229 223 207)` | Secondary |
| `--e6-gray` | `rgb(153 148 138)` | Muted |

### Semantic Tokens
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--border`, `--input`, `--ring`

### Design Principles
- **Sharp Edges**: Zero border radius throughout
- **Dark Mode**: Full support via `.dark` class
- **Accessibility**: Built on Radix UI primitives

## Development

```bash
# Install dependencies
npm install

# Start Storybook for development
npm run storybook

# Build the library
npm run build

# Watch mode for development
npm run dev
```

## File Structure

```
src/
├── components/
│   ├── primitives/     # Base UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   ├── feedback/       # Toast, alerts
│   ├── data-display/   # Stats, tables, progress
│   └── charts/         # Chart components
├── hooks/              # React hooks
├── lib/                # Utilities (cn)
└── styles/             # CSS tokens and globals
```

## License

MIT
