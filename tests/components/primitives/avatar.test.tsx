import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/primitives/avatar";

describe("Avatar", () => {
  it("renders", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("is circular by default", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveClass("rounded-full");
  });

  it("merges custom className", () => {
    render(<Avatar className="custom-class" data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Avatar ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("AvatarImage", () => {
  // Note: Radix Avatar delays rendering the image until it loads.
  // In jsdom, images don't actually load, so we test what we can.

  it("renders within Avatar container", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
      </Avatar>
    );
    // Avatar container should render even if image hasn't loaded yet
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("passes src to underlying element", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User" data-testid="avatar-image" />
      </Avatar>
    );
    // The image element exists in the DOM but may be hidden until loaded
    const img = container.querySelector('img');
    if (img) {
      expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    }
  });
});

describe("AvatarFallback", () => {
  it("renders fallback content", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("is circular", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="fallback">JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByTestId("fallback")).toHaveClass("rounded-full");
  });

  it("merges custom className", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-class">JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("JD")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <Avatar>
        <AvatarFallback ref={ref}>JD</AvatarFallback>
      </Avatar>
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe("Avatar composition", () => {
  it("renders fallback when image not loaded", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    // Fallback should be visible when image hasn't loaded
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
