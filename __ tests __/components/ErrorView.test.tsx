import { render, screen, fireEvent } from "@testing-library/react";
import ErrorView from "../../src/components/ErrorView";

describe("ErrorView", () => {
  it("should render error message with retry button that calls onRetry when clicked", () => {
    const onRetry = jest.fn();

    render(<ErrorView message="Something failed" onRetry={onRetry} />);

    expect(screen.getByText("Something failed")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should render error message without retry button when onRetry is not provided", () => {
    render(<ErrorView message="Network error" />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });
});