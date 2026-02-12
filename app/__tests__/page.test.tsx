/**
 * @jest-environment jsdom
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

describe("Task Manager", () => {
  let confirmSpy: jest.SpyInstance<boolean, [message?: string]>;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => false);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  describe("Normal use cases", () => {
    test("adds a task with typical text", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByLabelText(/task title/i);
      const submit = screen.getByRole("button", { name: /add task/i });

      await user.type(input, "Buy groceries");
      await user.click(submit);

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(input).toHaveValue("");
    });

    test("marks a task complete then incomplete", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(screen.getByLabelText(/task title/i), "Finish report");
      await user.click(screen.getByRole("button", { name: /add task/i }));

      const checkbox = screen.getByRole("checkbox", {
        name: /mark task complete/i,
      });
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
      expect(screen.getByText("Finish report")).toHaveClass("line-through");

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /mark task complete/i })).toBeInTheDocument();
    });

    test("edits task text", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(screen.getByLabelText(/task title/i), "Old title");
      await user.click(screen.getByRole("button", { name: /add task/i }));

      await user.click(screen.getByRole("button", { name: /edit task/i }));
      const editInput = screen.getByLabelText(/edit task/i);
      await user.clear(editInput);
      await user.type(editInput, "New title");
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      expect(screen.getByText("New title")).toBeInTheDocument();
      expect(screen.queryByText("Old title")).not.toBeInTheDocument();
    });

    test("deletes task when user confirms", async () => {
      const user = userEvent.setup();
      confirmSpy.mockReturnValue(true);
      render(<Home />);

      await user.type(screen.getByLabelText(/task title/i), "Task to delete");
      await user.click(screen.getByRole("button", { name: /add task/i }));

      expect(screen.getByText("Task to delete")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /delete task/i }));

      expect(confirmSpy).toHaveBeenCalledWith("Delete this task?");
      expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
    });

    test("does not delete task when user cancels confirmation", async () => {
      const user = userEvent.setup();
      confirmSpy.mockReturnValue(false);
      render(<Home />);

      await user.type(screen.getByLabelText(/task title/i), "Keep this task");
      await user.click(screen.getByRole("button", { name: /add task/i }));

      await user.click(screen.getByRole("button", { name: /delete task/i }));

      expect(screen.getByText("Keep this task")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    test("does not add task with empty or whitespace-only title", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByLabelText(/task title/i);
      const submit = screen.getByRole("button", { name: /add task/i });

      await user.click(submit);
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

      await user.type(input, "   ");
      await user.click(submit);
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

      await user.clear(input);
      await user.type(input, "");
      await user.click(submit);
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });

    test("adds and displays task with very long title", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const longTitle =
        "A".repeat(500) + " and some more text at the end to make it realistic";
      await user.type(screen.getByLabelText(/task title/i), longTitle);
      await user.click(screen.getByRole("button", { name: /add task/i }));

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    test("handles rapid clicking on Add Task without duplicating or breaking", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByLabelText(/task title/i);
      const submit = screen.getByRole("button", { name: /add task/i });

      await user.type(input, "One task");
      submit.click();
      submit.click();
      submit.click();

      await screen.findByText("One task");
      const items = screen.getAllByRole("listitem");
      expect(items.length).toBe(1);
    });

    test("handles rapid toggling of complete checkbox", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await user.type(screen.getByLabelText(/task title/i), "Toggle me");
      await user.click(screen.getByRole("button", { name: /add task/i }));

      const checkbox = screen.getByRole("checkbox", {
        name: /mark task complete/i,
      });
      for (let i = 0; i < 5; i++) {
        await user.click(checkbox);
      }

      expect(screen.getByText("Toggle me")).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    test("editing one task while deleting another does not crash and state is consistent", async () => {
      const user = userEvent.setup();
      confirmSpy.mockReturnValue(true);
      render(<Home />);

      await user.type(screen.getByLabelText(/task title/i), "Task one");
      await user.click(screen.getByRole("button", { name: /add task/i }));
      await user.type(screen.getByLabelText(/task title/i), "Task two");
      await user.click(screen.getByRole("button", { name: /add task/i }));

      await user.click(screen.getAllByRole("button", { name: /edit task/i })[0]);
      const editInput = screen.getByLabelText(/edit task/i);
      await user.type(editInput, " updated");
      await user.click(screen.getByRole("button", { name: /^save$/i }));
      await user.click(screen.getByRole("button", { name: /delete task/i }));

      expect(confirmSpy).toHaveBeenCalled();
      expect(screen.queryByText("Task two")).not.toBeInTheDocument();
      expect(screen.getByText("Task one updated")).toBeInTheDocument();
    });

    test("maximum number of tasks - many tasks can be added and remain usable", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByLabelText(/task title/i);
      const submit = screen.getByRole("button", { name: /add task/i });

      const count = 50;
      for (let i = 0; i < count; i++) {
        await user.clear(input);
        await user.type(input, `Task ${i + 1}`);
        await user.click(submit);
      }

      const list = screen.getByRole("list");
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(count);

      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText(`Task ${count}`)).toBeInTheDocument();

      const firstCheckbox = within(items[0]).getByRole("checkbox");
      await user.click(firstCheckbox);
      expect(firstCheckbox).toBeChecked();
    });
  });
});
