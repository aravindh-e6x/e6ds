import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/primitives/search-input";

describe("SearchInput", () => {
  it("renders with search icon", () => {
    render(<SearchInput data-testid="search" />);
    const container = screen.getByTestId("search").parentElement;
    expect(container?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders input element", () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("accepts and displays value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput onChange={handleChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "test query");
    expect(handleChange).toHaveBeenCalled();
  });

  it("shows clear button when value is present", () => {
    render(<SearchInput value="test" onChange={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("hides clear button when value is empty", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides clear button when showClearButton is false", () => {
    render(<SearchInput value="test" showClearButton={false} onChange={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(<SearchInput value="test" onClear={handleClear} onChange={() => {}} />);
    await user.click(screen.getByRole("button"));

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state", () => {
    render(<SearchInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("merges custom className", () => {
    render(<SearchInput className="custom-class" data-testid="search" />);
    expect(screen.getByTestId("search").parentElement).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SearchInput ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("is always type text", () => {
    render(<SearchInput data-testid="search" />);
    expect(screen.getByTestId("search")).toHaveAttribute("type", "text");
  });
});
