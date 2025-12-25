import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DataTable, Badge } from "../../src";
import type { Column } from "../../src";

const meta: Meta = {
  title: "Organisms/DataTable",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", createdAt: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", createdAt: "2024-02-20" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "User", status: "inactive", createdAt: "2024-03-10" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "pending", createdAt: "2024-04-05" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "User", status: "active", createdAt: "2024-05-12" },
];

const columns: Column<User>[] = [
  { key: "id", header: "ID", width: 60, sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email" },
  { key: "role", header: "Role", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const status = value as User["status"];
      const variant = status === "active" ? "success" : status === "inactive" ? "secondary" : "warning";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { key: "createdAt", header: "Created At", align: "right" },
];

export const Default: Story = {
  render: () => <DataTable data={users} columns={columns} />,
};

export const Striped: Story = {
  render: () => <DataTable data={users} columns={columns} striped />,
};

export const Compact: Story = {
  render: () => <DataTable data={users} columns={columns} compact />,
};

export const Loading: Story = {
  render: () => <DataTable data={[]} columns={columns} loading />,
};

export const Empty: Story = {
  render: () => <DataTable data={[]} columns={columns} emptyMessage="No users found" />,
};

export const ClickableRows: Story = {
  render: () => {
    const handleRowClick = (user: User) => {
      alert(`Clicked on ${user.name}`);
    };
    return <DataTable data={users} columns={columns} onRowClick={handleRowClick} />;
  },
};

export const WithSorting: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = React.useState<string>("name");
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

    const handleSort = (column: string) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    };

    const sortedData = [...users].sort((a, b) => {
      const aVal = a[sortColumn as keyof User];
      const bVal = b[sortColumn as keyof User];
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return (
      <DataTable
        data={sortedData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    );
  },
};

interface Pipeline {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  messagesIn: number;
  messagesOut: number;
  lastUpdated: string;
}

const pipelines: Pipeline[] = [
  { id: "pl-001", name: "Kafka to Iceberg", status: "running", messagesIn: 125000, messagesOut: 124500, lastUpdated: "2 min ago" },
  { id: "pl-002", name: "S3 to Delta", status: "running", messagesIn: 89000, messagesOut: 89000, lastUpdated: "5 min ago" },
  { id: "pl-003", name: "Kinesis to S3", status: "stopped", messagesIn: 0, messagesOut: 0, lastUpdated: "1 hour ago" },
  { id: "pl-004", name: "Debezium CDC", status: "error", messagesIn: 45000, messagesOut: 42000, lastUpdated: "10 min ago" },
];

const pipelineColumns: Column<Pipeline>[] = [
  { key: "id", header: "ID", width: 100 },
  { key: "name", header: "Pipeline Name" },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const status = value as Pipeline["status"];
      const variant = status === "running" ? "success" : status === "stopped" ? "secondary" : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    key: "messagesIn",
    header: "Messages In",
    align: "right",
    render: (value) => (value as number).toLocaleString(),
  },
  {
    key: "messagesOut",
    header: "Messages Out",
    align: "right",
    render: (value) => (value as number).toLocaleString(),
  },
  { key: "lastUpdated", header: "Last Updated", align: "right" },
];

export const PipelineTable: Story = {
  render: () => <DataTable data={pipelines} columns={pipelineColumns} striped />,
};
