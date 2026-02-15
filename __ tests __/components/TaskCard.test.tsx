import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../../src/components/TaskCard";
import type { Task } from "../../src/types";

jest.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 hours ago",
}));

describe("TaskCard", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: "todo",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  it("should render task details and call onEdit/onDelete with correct args on button clicks", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit task/i }));
    expect(onEdit).toHaveBeenCalledWith(mockTask);

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});