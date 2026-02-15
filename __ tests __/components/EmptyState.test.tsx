import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "../../src/components/EmptyState";

describe("EmptyState", () => {
  it("should render icon, title, description, and button that calls onCreateTask on click", () => {
    const onCreateTask = jest.fn();

    render(<EmptyState onCreateTask={onCreateTask} />);

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Get started by creating your first task/)
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Create your first task" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    fireEvent.click(button);

    expect(onCreateTask).toHaveBeenCalledTimes(2);
  });
});