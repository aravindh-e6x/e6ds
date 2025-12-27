import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/primitives/pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page info", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("1 of 10")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByRole("button", { name: /first page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /last page/i })).toBeInTheDocument();
  });

  it("disables previous/first when on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    expect(screen.getByRole("button", { name: /first page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
  });

  it("disables next/last when on last page", () => {
    render(<Pagination {...defaultProps} currentPage={10} />);

    expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /last page/i })).toBeDisabled();
  });

  it("enables all buttons when on middle page", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    expect(screen.getByRole("button", { name: /first page/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /previous page/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /next page/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /last page/i })).not.toBeDisabled();
  });

  it("calls onPageChange with correct page when clicking next", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={5} onPageChange={handleChange} />);
    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it("calls onPageChange with correct page when clicking previous", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={5} onPageChange={handleChange} />);
    await user.click(screen.getByRole("button", { name: /previous page/i }));

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with 1 when clicking first", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={5} onPageChange={handleChange} />);
    await user.click(screen.getByRole("button", { name: /first page/i }));

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with totalPages when clicking last", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={5} onPageChange={handleChange} />);
    await user.click(screen.getByRole("button", { name: /last page/i }));

    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it("shows total records when provided", () => {
    render(<Pagination {...defaultProps} totalRecords={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText(/total records/i)).toBeInTheDocument();
  });

  it("hides total records when showTotalRecords is false", () => {
    render(<Pagination {...defaultProps} totalRecords={100} showTotalRecords={false} />);
    expect(screen.queryByText(/total records/i)).not.toBeInTheDocument();
  });

  it("shows page size selector when onPageSizeChange is provided", () => {
    render(
      <Pagination
        {...defaultProps}
        pageSize={10}
        onPageSizeChange={vi.fn()}
      />
    );
    expect(screen.getByText(/rows per page/i)).toBeInTheDocument();
  });

  it("hides page size selector when showPageSize is false", () => {
    render(
      <Pagination
        {...defaultProps}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        showPageSize={false}
      />
    );
    expect(screen.queryByText(/rows per page/i)).not.toBeInTheDocument();
  });

  it("calls onPageSizeChange when page size is changed", async () => {
    const user = userEvent.setup();
    const handleSizeChange = vi.fn();

    render(
      <Pagination
        {...defaultProps}
        pageSize={10}
        onPageSizeChange={handleSizeChange}
      />
    );

    await user.click(screen.getByRole("combobox"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    await user.click(screen.getByText("20"));
    expect(handleSizeChange).toHaveBeenCalledWith(20);
  });

  it("hides first/last buttons when showFirstLast is false", () => {
    render(<Pagination {...defaultProps} showFirstLast={false} />);

    expect(screen.queryByRole("button", { name: /first page/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /last page/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Pagination {...defaultProps} className="custom-class" data-testid="pagination" />);
    expect(screen.getByTestId("pagination")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Pagination ref={ref} {...defaultProps} />);
    expect(ref).toHaveBeenCalled();
  });
});
