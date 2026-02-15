import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "../../src/components/TaskForm";
import type { Task } from "../../src/types";

describe("TaskForm", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const existingTask: Task = {
    id: "1",
    title: "Existing Task",
    description: "Existing Description",
    status: "in-progress",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  afterEach(() => jest.clearAllMocks());

  it("should render 'New Task' modal with empty fields, show validation errors on empty submit", async () => {
    render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What needs to be done?")).toHaveValue("");
    expect(screen.getByPlaceholderText("Add more details...")).toHaveValue("");
    expect(screen.getByText("Create Task")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Create Task"));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should render 'Edit Task' modal with pre-filled fields and submit trimmed values", async () => {
    render(
      <TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} initialData={existingTask} />
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What needs to be done?")).toHaveValue("Existing Task");
    expect(screen.getByPlaceholderText("Add more details...")).toHaveValue("Existing Description");
    expect(screen.getByText("Save Changes")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "  Updated Title  " },
    });
    fireEvent.change(screen.getByPlaceholderText("Add more details..."), {
      target: { value: "  Updated Desc  " },
    });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Updated Title",
        description: "Updated Desc",
        status: "in-progress",
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when Cancel button is clicked", () => {
    render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should not render content when open is false", () => {
    render(<TaskForm open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Task")).not.toBeInTheDocument();
  });
});