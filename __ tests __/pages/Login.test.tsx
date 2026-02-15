import { render, screen, fireEvent } from "@testing-library/react";

import Login from "../../src/pages/Login";
import { AuthContext } from "../../src/hooks/useAuth";
import { ThemeContext } from "../../src/hooks/useTheme";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
    mockNavigate(to, replace);
    return null;
  },
}));

const mockLogin = jest.fn();
const mockToggleTheme = jest.fn();

function renderLogin({
  isAuthenticated = false,
  isLoading = false,
  error = null as string | null,
  theme = "light" as "light" | "dark",
}) {
  const authValue = {
    user: isAuthenticated ? { username: "John", token: "t" } : null,
    isAuthenticated,
    isLoading,
    error,
    login: mockLogin,
    logout: jest.fn(),
  };

  const themeValue = { theme, toggleTheme: mockToggleTheme };

  return render(
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        <Login />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

describe("Login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should redirect to / when already authenticated", () => {
    renderLogin({ isAuthenticated: true });

    expect(mockNavigate).toHaveBeenCalledWith("/", true);
  });

  it("should render form, call login with trimmed username on submit, and toggle theme on button click", () => {
    renderLogin({});

    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
    expect(screen.getByText("Sign in to manage your tasks")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "  testuser  " } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass123" } });

    // Submit  
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }));

    expect(mockLogin).toHaveBeenCalledWith({ username: "testuser", password: "pass123" });

    // Toggle theme
    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("should show error alert when error exists, loading state, and sun icon when theme is dark", () => {
    const { container } = renderLogin({ error: "Invalid credentials", isLoading: true, theme: "dark" });

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signing in/i })).toBeInTheDocument();
    expect(container.querySelector(".anticon-sun")).toBeInTheDocument();
    expect(container.querySelector(".anticon-moon")).not.toBeInTheDocument();
  });
});