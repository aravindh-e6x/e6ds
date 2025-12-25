import type { Meta, StoryObj } from "@storybook/react";
import { SQLEditor } from "../../src";
import { useState } from "react";

const meta = {
  title: "Organisms/SQLEditor",
  component: SQLEditor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SQLEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample table schemas for autocomplete
const sampleSchemas = [
  {
    name: "users",
    columns: [
      { name: "id", type: "BIGINT", description: "Primary key" },
      { name: "email", type: "VARCHAR(255)", description: "User email address" },
      { name: "name", type: "VARCHAR(100)", description: "Full name" },
      { name: "created_at", type: "TIMESTAMP", description: "Account creation date" },
      { name: "status", type: "VARCHAR(20)", description: "Account status" },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "BIGINT", description: "Order ID" },
      { name: "user_id", type: "BIGINT", description: "Foreign key to users" },
      { name: "total_amount", type: "DECIMAL(10,2)", description: "Order total" },
      { name: "status", type: "VARCHAR(20)", description: "Order status" },
      { name: "created_at", type: "TIMESTAMP", description: "Order date" },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "id", type: "BIGINT", description: "Product ID" },
      { name: "name", type: "VARCHAR(255)", description: "Product name" },
      { name: "price", type: "DECIMAL(10,2)", description: "Unit price" },
      { name: "category", type: "VARCHAR(100)", description: "Product category" },
      { name: "inventory_count", type: "INT", description: "Stock quantity" },
    ],
  },
];

const defaultQuery = `-- Sample SQL Query
SELECT
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 100;`;

export const Default: Story = {
  args: {
    defaultValue: defaultQuery,
    height: 400,
    onExecute: (query) => {
      console.log("Executing query:", query);
      alert("Query executed! Check console for details.");
    },
  },
};

export const WithSchemaAutocomplete: Story = {
  args: {
    defaultValue: "-- Start typing to see autocomplete suggestions\n-- Try typing 'SELECT * FROM '\nSELECT ",
    height: 400,
    schemas: sampleSchemas,
    onExecute: (query) => console.log("Query:", query),
  },
};

export const LightTheme: Story = {
  args: {
    defaultValue: defaultQuery,
    height: 400,
    theme: "e6data-light",
    onExecute: (query) => console.log("Query:", query),
  },
};

export const DarkTheme: Story = {
  args: {
    defaultValue: defaultQuery,
    height: 400,
    theme: "e6data-dark",
    onExecute: (query) => console.log("Query:", query),
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: defaultQuery,
    height: 300,
    readOnly: true,
    showRunButton: false,
  },
};

export const Minimal: Story = {
  args: {
    defaultValue: "SELECT * FROM users WHERE status = 'active';",
    height: 150,
    showToolbar: false,
    showMinimap: false,
  },
};

export const WithMinimap: Story = {
  args: {
    defaultValue: `-- Long query with minimap enabled
${defaultQuery}

-- Another query
SELECT
  p.category,
  COUNT(*) as product_count,
  AVG(p.price) as avg_price,
  SUM(p.inventory_count) as total_inventory
FROM products p
GROUP BY p.category
ORDER BY product_count DESC;

-- CTE Example
WITH monthly_sales AS (
  SELECT
    DATE_TRUNC('month', created_at) as month,
    SUM(total_amount) as revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY DATE_TRUNC('month', created_at)
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) as growth
FROM monthly_sales
ORDER BY month;`,
    height: 500,
    showMinimap: true,
    onExecute: (query) => console.log("Query:", query),
  },
};

export const Loading: Story = {
  args: {
    defaultValue: "SELECT * FROM users;",
    height: 300,
    loading: true,
    onExecute: (query) => console.log("Query:", query),
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "SELECT * FROM users;",
    height: 300,
    disabled: true,
  },
};

export const CustomFontSize: Story = {
  args: {
    defaultValue: defaultQuery,
    height: 400,
    fontSize: 16,
    onExecute: (query) => console.log("Query:", query),
  },
};

// Interactive example with state
const InteractiveExample = () => {
  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async (sql: string) => {
    setIsLoading(true);
    setResult(null);

    // Simulate query execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setResult(`Query executed successfully!\n\nQuery:\n${sql}\n\nRows affected: ${Math.floor(Math.random() * 1000)}`);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <SQLEditor
        value={query}
        onChange={(val) => setQuery(val || "")}
        onExecute={handleExecute}
        height={350}
        schemas={sampleSchemas}
        loading={isLoading}
        showResetButton
      />
      {result && (
        <div className="p-4 bg-muted border border-border rounded-none">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

// Example with all toolbar options
export const FullToolbar: Story = {
  args: {
    defaultValue: defaultQuery,
    height: 400,
    showToolbar: true,
    showRunButton: true,
    showCopyButton: true,
    showFullscreenButton: true,
    showResetButton: true,
    schemas: sampleSchemas,
    onExecute: (query) => {
      console.log("Executing:", query);
      alert("Query executed!");
    },
  },
};
