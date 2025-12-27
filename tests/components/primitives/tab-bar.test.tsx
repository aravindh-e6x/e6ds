import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabBar } from "@/components/primitives/tab-bar";

const defaultTabs = [
  { id: "tab1", label: "Tab 1" },
  { id: "tab2", label: "Tab 2" },
  { id: "tab3", label: "Tab 3" },
];

describe("TabBar", () => {
  it("renders all tabs", () => {
    render(<TabBar tabs={defaultTabs} />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 3" })).toBeInTheDocument();
  });

  it("marks first tab as active by default", () => {
    render(<TabBar tabs={defaultTabs} />);
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
  });

  it("respects activeTab prop", () => {
    render(<TabBar tabs={defaultTabs} activeTab="tab2" />);
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");
  });

  it("calls onTabChange when tab is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<TabBar tabs={defaultTabs} onTabChange={handleChange} />);
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(handleChange).toHaveBeenCalledWith("tab2");
  });

  it("updates internal state when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<TabBar tabs={defaultTabs} />);

    await user.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");
  });

  it("supports disabled tabs", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const tabs = [
      { id: "tab1", label: "Tab 1" },
      { id: "tab2", label: "Tab 2", disabled: true },
    ];

    render(<TabBar tabs={tabs} onTabChange={handleChange} />);
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(handleChange).not.toHaveBeenCalledWith("tab2");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeDisabled();
  });

  it("renders tabs with icons", () => {
    const tabs = [
      { id: "tab1", label: "Tab 1", icon: <span data-testid="icon">🔥</span> },
    ];

    render(<TabBar tabs={tabs} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders tabs with badges", () => {
    const tabs = [
      { id: "tab1", label: "Tab 1", badge: 5 },
      { id: "tab2", label: "Tab 2", badge: "New" },
    ];

    render(<TabBar tabs={tabs} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  describe("variants", () => {
    it("renders underline variant (default)", () => {
      render(<TabBar tabs={defaultTabs} variant="underline" data-testid="tabbar" />);
      expect(screen.getByTestId("tabbar")).toHaveClass("border-b");
    });

    it("renders pills variant", () => {
      render(<TabBar tabs={defaultTabs} variant="pills" data-testid="tabbar" />);
      expect(screen.getByTestId("tabbar")).toHaveClass("gap-1");
    });

    it("renders enclosed variant", () => {
      render(<TabBar tabs={defaultTabs} variant="enclosed" />);
      // Active tab should have border styles
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveClass("border");
    });
  });

  describe("sizes", () => {
    it("renders default size", () => {
      render(<TabBar tabs={defaultTabs} size="default" />);
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveClass("px-4", "py-2");
    });

    it("renders small size", () => {
      render(<TabBar tabs={defaultTabs} size="sm" />);
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveClass("px-3", "py-1.5");
    });

    it("renders large size", () => {
      render(<TabBar tabs={defaultTabs} size="lg" />);
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveClass("px-5", "py-2.5");
    });
  });

  it("merges custom className", () => {
    render(<TabBar tabs={defaultTabs} className="custom-class" data-testid="tabbar" />);
    expect(screen.getByTestId("tabbar")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<TabBar ref={ref} tabs={defaultTabs} />);
    expect(ref).toHaveBeenCalled();
  });
});
