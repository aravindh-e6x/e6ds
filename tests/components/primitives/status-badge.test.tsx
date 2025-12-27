import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/primitives/status-badge";

describe("StatusBadge", () => {
  it("renders with text content", () => {
    render(<StatusBadge>Active</StatusBadge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("shows dot by default", () => {
    render(<StatusBadge data-testid="badge">Active</StatusBadge>);
    const badge = screen.getByTestId("badge");
    expect(badge.querySelector("span.rounded-full")).toBeInTheDocument();
  });

  it("hides dot when showDot is false", () => {
    render(<StatusBadge showDot={false} data-testid="badge">Active</StatusBadge>);
    const badge = screen.getByTestId("badge");
    expect(badge.querySelector("span.rounded-full")).not.toBeInTheDocument();
  });

  describe("status variants", () => {
    it("renders active status", () => {
      render(<StatusBadge status="active" data-testid="badge">Active</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-green-600");
    });

    it("renders disabled status", () => {
      render(<StatusBadge status="disabled" data-testid="badge">Disabled</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-muted-foreground");
    });

    it("renders accepted status", () => {
      render(<StatusBadge status="accepted" data-testid="badge">Accepted</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-green-600");
    });

    it("renders pending status", () => {
      render(<StatusBadge status="pending" data-testid="badge">Pending</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-yellow-600");
    });

    it("renders suspended status", () => {
      render(<StatusBadge status="suspended" data-testid="badge">Suspended</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-muted-foreground");
    });

    it("renders error status", () => {
      render(<StatusBadge status="error" data-testid="badge">Error</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-destructive");
    });

    it("renders warning status", () => {
      render(<StatusBadge status="warning" data-testid="badge">Warning</StatusBadge>);
      expect(screen.getByTestId("badge")).toHaveClass("text-yellow-600");
    });
  });

  describe("dot colors", () => {
    it("active status has green dot", () => {
      render(<StatusBadge status="active" data-testid="badge">Active</StatusBadge>);
      const dot = screen.getByTestId("badge").querySelector("span.rounded-full");
      expect(dot).toHaveClass("bg-green-500");
    });

    it("error status has destructive dot", () => {
      render(<StatusBadge status="error" data-testid="badge">Error</StatusBadge>);
      const dot = screen.getByTestId("badge").querySelector("span.rounded-full");
      expect(dot).toHaveClass("bg-destructive");
    });

    it("pending status has yellow dot", () => {
      render(<StatusBadge status="pending" data-testid="badge">Pending</StatusBadge>);
      const dot = screen.getByTestId("badge").querySelector("span.rounded-full");
      expect(dot).toHaveClass("bg-yellow-500");
    });
  });

  it("merges custom className", () => {
    render(<StatusBadge className="custom-class" data-testid="badge">Status</StatusBadge>);
    expect(screen.getByTestId("badge")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<StatusBadge ref={ref}>Status</StatusBadge>);
    expect(ref).toHaveBeenCalled();
  });
});
