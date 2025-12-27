import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from "@/components/primitives/skeleton";

describe("Skeleton", () => {
  it("renders with default props", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("applies animation by default", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveClass("animate-pulse");
  });

  it("can disable animation", () => {
    render(<Skeleton animate={false} data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).not.toHaveClass("animate-pulse");
  });

  it("applies custom width and height", () => {
    render(<Skeleton width={100} height={50} data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveStyle({ width: "100px", height: "50px" });
  });

  it("applies string dimensions", () => {
    render(<Skeleton width="100%" height="2rem" data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveStyle({ width: "100%", height: "2rem" });
  });

  describe("variants", () => {
    it("renders rectangular variant", () => {
      render(<Skeleton variant="rectangular" data-testid="skeleton" />);
      expect(screen.getByTestId("skeleton")).not.toHaveClass("rounded-full");
    });

    it("renders circular variant", () => {
      render(<Skeleton variant="circular" data-testid="skeleton" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-full");
    });

    it("renders text variant", () => {
      render(<Skeleton variant="text" data-testid="skeleton" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-sm");
    });
  });

  it("merges custom className", () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Skeleton ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("SkeletonText", () => {
  it("renders default 3 lines", () => {
    render(<SkeletonText data-testid="skeleton-text" />);
    const container = screen.getByTestId("skeleton-text");
    expect(container.children).toHaveLength(3);
  });

  it("renders custom number of lines", () => {
    render(<SkeletonText lines={5} data-testid="skeleton-text" />);
    const container = screen.getByTestId("skeleton-text");
    expect(container.children).toHaveLength(5);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SkeletonText ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe("SkeletonAvatar", () => {
  it("renders with default medium size", () => {
    render(<SkeletonAvatar data-testid="skeleton-avatar" />);
    const avatar = screen.getByTestId("skeleton-avatar");
    expect(avatar).toHaveStyle({ width: "40px", height: "40px" });
  });

  it("renders small size", () => {
    render(<SkeletonAvatar size="sm" data-testid="skeleton-avatar" />);
    const avatar = screen.getByTestId("skeleton-avatar");
    expect(avatar).toHaveStyle({ width: "32px", height: "32px" });
  });

  it("renders large size", () => {
    render(<SkeletonAvatar size="lg" data-testid="skeleton-avatar" />);
    const avatar = screen.getByTestId("skeleton-avatar");
    expect(avatar).toHaveStyle({ width: "56px", height: "56px" });
  });

  it("renders custom numeric size", () => {
    render(<SkeletonAvatar size={80} data-testid="skeleton-avatar" />);
    const avatar = screen.getByTestId("skeleton-avatar");
    expect(avatar).toHaveStyle({ width: "80px", height: "80px" });
  });

  it("is circular", () => {
    render(<SkeletonAvatar data-testid="skeleton-avatar" />);
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass("rounded-full");
  });
});

describe("SkeletonCard", () => {
  it("renders with default props", () => {
    render(<SkeletonCard data-testid="skeleton-card" />);
    expect(screen.getByTestId("skeleton-card")).toBeInTheDocument();
  });

  it("shows header by default", () => {
    render(<SkeletonCard data-testid="skeleton-card" />);
    const card = screen.getByTestId("skeleton-card");
    // Header contains avatar which has rounded-full class
    expect(card.querySelector(".rounded-full")).toBeInTheDocument();
  });

  it("can hide header", () => {
    render(<SkeletonCard showHeader={false} data-testid="skeleton-card" />);
    const card = screen.getByTestId("skeleton-card");
    expect(card.querySelector(".rounded-full")).not.toBeInTheDocument();
  });

  it("can show actions", () => {
    render(<SkeletonCard showActions={true} data-testid="skeleton-card" />);
    const card = screen.getByTestId("skeleton-card");
    const buttons = card.querySelectorAll(".h-9.w-20");
    expect(buttons).toHaveLength(2);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SkeletonCard ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
