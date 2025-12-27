import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "@/components/primitives/icon-button";

describe("IconButton", () => {
  it("renders with children", () => {
    render(<IconButton>🔥</IconButton>);
    expect(screen.getByRole("button")).toHaveTextContent("🔥");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<IconButton onClick={handleClick}>X</IconButton>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<IconButton onClick={handleClick} disabled>X</IconButton>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled attribute", () => {
    render(<IconButton disabled>X</IconButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<IconButton variant="default">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("bg-primary");
    });

    it("renders ghost variant (default)", () => {
      render(<IconButton>X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("hover:bg-accent");
    });

    it("renders destructive variant", () => {
      render(<IconButton variant="destructive">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("bg-destructive");
    });

    it("renders outline variant", () => {
      render(<IconButton variant="outline">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("border");
    });

    it("renders secondary variant", () => {
      render(<IconButton variant="secondary">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("bg-secondary");
    });
  });

  describe("sizes", () => {
    it("renders default size", () => {
      render(<IconButton size="default">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("h-10", "w-10");
    });

    it("renders xs size", () => {
      render(<IconButton size="xs">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("h-6", "w-6");
    });

    it("renders sm size", () => {
      render(<IconButton size="sm">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("h-8", "w-8");
    });

    it("renders lg size", () => {
      render(<IconButton size="lg">X</IconButton>);
      expect(screen.getByRole("button")).toHaveClass("h-12", "w-12");
    });
  });

  it("merges custom className", () => {
    render(<IconButton className="custom-class">X</IconButton>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("renders as child element when asChild is true", () => {
    render(
      <IconButton asChild>
        <a href="/test">Link</a>
      </IconButton>
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<IconButton ref={ref}>X</IconButton>);
    expect(ref).toHaveBeenCalled();
  });
});
