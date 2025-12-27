import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "@/components/primitives/textarea";

describe("Textarea", () => {
  it("renders", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("accepts and displays value", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello World");

    expect(textarea).toHaveValue("Hello World");
  });

  it("supports multiline input", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line 1{enter}Line 2{enter}Line 3");

    expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea onChange={handleChange} />);
    await user.type(screen.getByRole("textbox"), "a");

    expect(handleChange).toHaveBeenCalled();
  });

  it("renders with placeholder", () => {
    render(<Textarea placeholder="Enter description..." />);
    expect(screen.getByPlaceholderText("Enter description...")).toBeInTheDocument();
  });

  it("applies disabled state", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("supports rows attribute", () => {
    render(<Textarea rows={10} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "10");
  });

  it("supports readonly state", () => {
    render(<Textarea readOnly value="Read only content" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("merges custom className", () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("supports maxLength", async () => {
    const user = userEvent.setup();
    render(<Textarea maxLength={5} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "1234567890");

    expect(textarea).toHaveValue("12345");
  });
});
