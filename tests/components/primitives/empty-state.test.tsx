import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "@/components/primitives/empty-state";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByRole("heading", { name: "No results found" })).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<EmptyState title="No results" description="Try adjusting your search" />);
    expect(screen.getByText("Try adjusting your search")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">📭</span>} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders illustration", () => {
    render(<EmptyState title="Empty" illustration={<img data-testid="illustration" alt="empty" />} />);
    expect(screen.getByTestId("illustration")).toBeInTheDocument();
  });

  it("prefers illustration over icon", () => {
    render(
      <EmptyState
        title="Empty"
        icon={<span data-testid="icon">📭</span>}
        illustration={<img data-testid="illustration" alt="empty" />}
      />
    );
    expect(screen.getByTestId("illustration")).toBeInTheDocument();
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("renders action button", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={{ label: "Add Item", onClick: handleClick }}
      />
    );
    expect(screen.getByRole("button", { name: "Add Item" })).toBeInTheDocument();
  });

  it("calls action onClick when button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <EmptyState
        title="Empty"
        action={{ label: "Add Item", onClick: handleClick }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Add Item" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders secondary action button", () => {
    const handlePrimary = vi.fn();
    const handleSecondary = vi.fn();

    render(
      <EmptyState
        title="Empty"
        action={{ label: "Primary", onClick: handlePrimary }}
        secondaryAction={{ label: "Secondary", onClick: handleSecondary }}
      />
    );

    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument();
  });

  it("calls secondary action onClick", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <EmptyState
        title="Empty"
        secondaryAction={{ label: "Learn More", onClick: handleClick }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Learn More" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe("sizes", () => {
    it("renders default size", () => {
      render(<EmptyState title="Empty" size="default" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("py-12");
    });

    it("renders small size", () => {
      render(<EmptyState title="Empty" size="sm" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("py-8");
    });

    it("renders large size", () => {
      render(<EmptyState title="Empty" size="lg" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("py-16");
    });
  });

  it("applies action variant", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={{ label: "Outline", onClick: handleClick, variant: "outline" }}
      />
    );
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border");
  });

  it("merges custom className", () => {
    render(<EmptyState title="Empty" className="custom-class" data-testid="empty" />);
    expect(screen.getByTestId("empty")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<EmptyState ref={ref} title="Empty" />);
    expect(ref).toHaveBeenCalled();
  });
});
