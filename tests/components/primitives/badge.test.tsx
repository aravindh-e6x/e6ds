import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/primitives/badge";

describe("Badge", () => {
  it("renders with text content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText("Default")).toHaveClass("bg-primary");
    });

    it("renders secondary variant", () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText("Secondary")).toHaveClass("bg-secondary");
    });

    it("renders destructive variant", () => {
      render(<Badge variant="destructive">Error</Badge>);
      expect(screen.getByText("Error")).toHaveClass("bg-destructive");
    });

    it("renders outline variant", () => {
      render(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText("Outline")).toHaveClass("text-foreground");
    });

    it("renders success variant", () => {
      render(<Badge variant="success">Success</Badge>);
      expect(screen.getByText("Success")).toHaveClass("bg-primary");
    });

    it("renders warning variant", () => {
      render(<Badge variant="warning">Warning</Badge>);
      expect(screen.getByText("Warning")).toHaveClass("bg-yellow-500");
    });

    it("renders info variant", () => {
      render(<Badge variant="info">Info</Badge>);
      expect(screen.getByText("Info")).toHaveClass("bg-blue-500");
    });
  });

  it("merges custom className", () => {
    render(<Badge className="custom-class">Badge</Badge>);
    expect(screen.getByText("Badge")).toHaveClass("custom-class");
  });
});
