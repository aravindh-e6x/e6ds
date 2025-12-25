import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "../../src";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        totalRecords={110}
        onPageChange={setPage}
      />
    );
  },
};

export const WithPageSize: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(110 / pageSize)}
        totalRecords={110}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

export const Minimal: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
        showTotalRecords={false}
        showPageSize={false}
        showFirstLast={false}
      />
    );
  },
};

export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(10);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        totalRecords={100}
        onPageChange={setPage}
      />
    );
  },
};
