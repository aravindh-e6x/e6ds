import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/primitives/card";

describe("Card", () => {
  it("renders with content", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Card className="custom-class" data-testid="card" />);
    expect(screen.getByTestId("card")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Card ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("CardHeader", () => {
  it("renders with content", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<CardHeader className="custom-class" data-testid="header" />);
    expect(screen.getByTestId("header")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardHeader ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Title");
  });

  it("merges custom className", () => {
    render(<CardTitle className="custom-class">Title</CardTitle>);
    expect(screen.getByRole("heading")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("CardDescription", () => {
  it("renders with content", () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<CardDescription className="custom-class">Desc</CardDescription>);
    expect(screen.getByText("Desc")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardDescription ref={ref}>Desc</CardDescription>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("CardContent", () => {
  it("renders with content", () => {
    render(<CardContent>Content here</CardContent>);
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<CardContent className="custom-class" data-testid="content" />);
    expect(screen.getByTestId("content")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardContent ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("CardFooter", () => {
  it("renders with content", () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<CardFooter className="custom-class" data-testid="footer" />);
    expect(screen.getByTestId("footer")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardFooter ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("Card composition", () => {
  it("renders full card structure", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Card Title" })).toBeInTheDocument();
    expect(screen.getByText("Card description")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });
});
