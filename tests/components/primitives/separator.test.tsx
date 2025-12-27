import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/primitives/separator";

describe("Separator", () => {
  it("renders with default horizontal orientation", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("h-[1px]", "w-full");
  });

  it("renders with vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("h-full", "w-[1px]");
  });

  it("renders as decorative by default", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("merges custom className", () => {
    render(<Separator className="custom-class" data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Separator ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
