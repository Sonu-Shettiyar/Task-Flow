import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../src/components/Headers";

const mockLogout = jest.fn();
const mockToggleTheme = jest.fn();

let mockUser: { username: string } | null = { username: "John" };
let mockTheme = "light";

jest.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}));

jest.mock("../../src/hooks/useTheme", () => ({
  useTheme: () => ({ theme: mockTheme, toggleTheme: mockToggleTheme }),
}));

describe("Header", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockUser = { username: "John" };
    mockTheme = "light";
  });

  it("should render logo, username, toggle theme button, and logout button that calls respective handlers", () => {
    render(<Header />);

    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("should hide username and logout button when user is null", () => {
    mockUser = null;

    render(<Header />);

    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("should render sun icon when theme is dark", () => {
    mockTheme = "dark";

    const { container } = render(<Header />);

    expect(container.querySelector(".anticon-sun")).toBeInTheDocument();
    expect(container.querySelector(".anticon-moon")).not.toBeInTheDocument();
  });
});