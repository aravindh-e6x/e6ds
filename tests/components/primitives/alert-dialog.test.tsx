import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/primitives/alert-dialog";

describe("AlertDialog", () => {
  it("renders trigger", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
      expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    });
  });

  it("closes when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("closes when action is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Continue"));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("renders with controlled open state", async () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogTitle>Controlled</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});

describe("AlertDialogHeader", () => {
  it("renders children", () => {
    render(<AlertDialogHeader>Header</AlertDialogHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<AlertDialogHeader className="custom-class" data-testid="header" />);
    expect(screen.getByTestId("header")).toHaveClass("custom-class");
  });
});

describe("AlertDialogFooter", () => {
  it("renders children", () => {
    render(<AlertDialogFooter>Footer</AlertDialogFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<AlertDialogFooter className="custom-class" data-testid="footer" />);
    expect(screen.getByTestId("footer")).toHaveClass("custom-class");
  });
});

describe("AlertDialogAction", () => {
  it("applies button styles", async () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogAction data-testid="action">Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    await waitFor(() => {
      expect(screen.getByTestId("action")).toHaveClass("bg-primary");
    });
  });

  it("forwards ref", async () => {
    const ref = vi.fn();
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogAction ref={ref}>Action</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    await waitFor(() => {
      expect(ref).toHaveBeenCalled();
    });
  });
});

describe("AlertDialogCancel", () => {
  it("applies outline button styles", async () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel data-testid="cancel">Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cancel")).toHaveClass("border");
    });
  });

  it("forwards ref", async () => {
    const ref = vi.fn();
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    await waitFor(() => {
      expect(ref).toHaveBeenCalled();
    });
  });
});

describe("AlertDialog composition", () => {
  it("renders full confirmation dialog", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete Item</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Delete Item"));

    await waitFor(() => {
      expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(handleAction).toHaveBeenCalled();
  });
});
