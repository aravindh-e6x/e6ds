import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert, AlertTitle, AlertDescription } from "@/components/primitives/alert";

describe("Alert", () => {
  it("renders with role alert", () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByText("Alert content")).toBeInTheDocument();
  });

  it("shows icon by default", () => {
    render(<Alert data-testid="alert">Message</Alert>);
    const alert = screen.getByTestId("alert");
    expect(alert.querySelector("svg")).toBeInTheDocument();
  });

  it("can hide icon", () => {
    render(<Alert showIcon={false} data-testid="alert">Message</Alert>);
    const alert = screen.getByTestId("alert");
    expect(alert.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders custom icon", () => {
    render(
      <Alert icon={<span data-testid="custom-icon">!</span>}>
        Message
      </Alert>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Alert variant="default">Default</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("bg-background");
    });

    it("renders info variant", () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("bg-blue-50");
    });

    it("renders success variant", () => {
      render(<Alert variant="success">Success</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("bg-green-50");
    });

    it("renders warning variant", () => {
      render(<Alert variant="warning">Warning</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("bg-yellow-50");
    });

    it("renders destructive variant", () => {
      render(<Alert variant="destructive">Error</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("text-destructive");
    });
  });

  describe("dismissible", () => {
    it("shows dismiss button when dismissible", () => {
      render(<Alert dismissible>Message</Alert>);
      expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
    });

    it("does not show dismiss button by default", () => {
      render(<Alert>Message</Alert>);
      expect(screen.queryByRole("button", { name: /dismiss/i })).not.toBeInTheDocument();
    });

    it("calls onDismiss when dismiss button clicked", async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();

      render(<Alert dismissible onDismiss={handleDismiss}>Message</Alert>);
      await user.click(screen.getByRole("button", { name: /dismiss/i }));

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it("merges custom className", () => {
    render(<Alert className="custom-class">Alert</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Alert ref={ref}>Alert</Alert>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("AlertTitle", () => {
  it("renders as h5", () => {
    render(<AlertTitle>Title</AlertTitle>);
    expect(screen.getByRole("heading", { level: 5 })).toHaveTextContent("Title");
  });

  it("merges custom className", () => {
    render(<AlertTitle className="custom-class">Title</AlertTitle>);
    expect(screen.getByRole("heading")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<AlertTitle ref={ref}>Title</AlertTitle>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("AlertDescription", () => {
  it("renders with content", () => {
    render(<AlertDescription>Description text</AlertDescription>);
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<AlertDescription className="custom-class">Desc</AlertDescription>);
    expect(screen.getByText("Desc")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<AlertDescription ref={ref}>Desc</AlertDescription>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("Alert composition", () => {
  it("renders full alert structure", () => {
    render(
      <Alert variant="info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is an informational message.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Information" })).toBeInTheDocument();
    expect(screen.getByText("This is an informational message.")).toBeInTheDocument();
  });
});
