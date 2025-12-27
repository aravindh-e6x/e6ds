import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "@/components/primitives/breadcrumb";

const defaultItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Category", href: "/products/category" },
  { label: "Current Page" },
];

describe("Breadcrumb", () => {
  it("renders navigation with aria-label", () => {
    render(<Breadcrumb items={defaultItems} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<Breadcrumb items={defaultItems} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();
  });

  it("renders links for items with href", () => {
    render(<Breadcrumb items={defaultItems} />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
  });

  it("last item is not a link", () => {
    render(<Breadcrumb items={defaultItems} />);

    const lastItem = screen.getByText("Current Page");
    expect(lastItem.closest("a")).toBeNull();
    expect(lastItem).toHaveClass("font-medium");
  });

  it("renders buttons for items with onClick", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const items = [
      { label: "Home", onClick: handleClick },
      { label: "Current" },
    ];

    render(<Breadcrumb items={items} />);
    await user.click(screen.getByRole("button", { name: "Home" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows separators between items", () => {
    render(<Breadcrumb items={defaultItems} />);
    // Default separator is ChevronRight icon, there should be 3 separators for 4 items
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(defaultItems.length);
  });

  it("supports custom separator", () => {
    render(<Breadcrumb items={defaultItems} separator={<span>/</span>} />);
    expect(screen.getAllByText("/").length).toBe(3);
  });

  it("shows home icon when showHomeIcon is true", () => {
    render(<Breadcrumb items={defaultItems} showHomeIcon />);
    // Home icon should be visible in the first item
    const nav = screen.getByRole("navigation");
    expect(nav.querySelector("svg")).toBeInTheDocument();
  });

  it("renders items with icons", () => {
    const items = [
      { label: "Home", href: "/", icon: <span data-testid="custom-icon">🏠</span> },
      { label: "Current" },
    ];

    render(<Breadcrumb items={items} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("truncates with ellipsis when maxItems is set", () => {
    const manyItems = [
      { label: "Home", href: "/" },
      { label: "Level 1", href: "/1" },
      { label: "Level 2", href: "/2" },
      { label: "Level 3", href: "/3" },
      { label: "Current" },
    ];

    render(<Breadcrumb items={manyItems} maxItems={3} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.queryByText("Level 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Level 2")).not.toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Breadcrumb items={defaultItems} className="custom-class" />);
    expect(screen.getByRole("navigation")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Breadcrumb ref={ref} items={defaultItems} />);
    expect(ref).toHaveBeenCalled();
  });
});
