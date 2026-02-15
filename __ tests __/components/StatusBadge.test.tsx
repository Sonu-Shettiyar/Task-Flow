import { render, screen } from "@testing-library/react";
import StatusBadge from "../../src/components/StatusBadge";
import type { TaskStatus } from "../../src/types";

describe("StatusBadge", () => {
  it.each<[TaskStatus, string]>([
    ["todo", "To Do"],
    ["in-progress", "In Progress"],
    ["done", "Done"],
  ])('should render "%s" status as "%s" label', (status, label) => {
    render(<StatusBadge status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});