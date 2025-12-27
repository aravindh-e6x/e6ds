import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/primitives/tooltip";

const renderTooltip = (content: string = "Tooltip content") => {
  return render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

describe("Tooltip", () => {
  it("renders trigger", () => {
    renderTooltip();
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip content on hover", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("hides tooltip content when not hovered", () => {
    renderTooltip();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("renders custom content", async () => {
    const user = userEvent.setup();
    renderTooltip("Custom tooltip text");

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Custom tooltip text");
    });
  });
});

describe("TooltipContent", () => {
  it("merges custom className", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent className="custom-class">Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByText("Hover"));

    await waitFor(() => {
      const tooltipContent = container.querySelector(".custom-class");
      expect(tooltipContent).toBeInTheDocument();
    });
  });

  it("forwards ref", async () => {
    const ref = vi.fn();
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent ref={ref}>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByText("Hover"));

    await waitFor(() => {
      expect(ref).toHaveBeenCalled();
    });
  });
});
