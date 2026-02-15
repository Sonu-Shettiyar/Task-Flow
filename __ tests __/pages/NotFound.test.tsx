import { render, screen } from "@testing-library/react";

import NotFound from "../../src/pages/NotFound";
import { AuthContext } from "../../src/hooks/useAuth";
import { ThemeContext } from "../../src/hooks/useTheme";

function renderNotFound() {
  const authValue = {
    user: { username: "John", token: "t" },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
  };

  const themeValue = { theme: "light" as const, toggleTheme: jest.fn() };

  return render(
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        <NotFound />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

describe("NotFound", () => {
  it("should render Header, 404 status, message, and Return to Home button with correct href", () => {
    renderNotFound();

    // Header  
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();

    // 404  
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();

    // Return to Home button
    const homeButton = screen.getByRole("link", { name: /return to home/i });
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveAttribute("href", "/");
  });
});