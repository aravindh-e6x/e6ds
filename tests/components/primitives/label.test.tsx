import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/primitives/label";

describe("Label", () => {
  it("renders with text content", () => {
    render(<Label>Username</Label>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("associates with form element via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </>
    );

    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "email");
  });

  it("merges custom className", () => {
    render(<Label className="custom-class">Label</Label>);
    expect(screen.getByText("Label")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Label ref={ref}>Label</Label>);
    expect(ref).toHaveBeenCalled();
  });
});
