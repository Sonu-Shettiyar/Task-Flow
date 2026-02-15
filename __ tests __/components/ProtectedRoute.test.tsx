import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { AuthContext } from "../../src/hooks/useAuth";
import type { ReactNode } from "react";

function renderWithAuth(isAuthenticated: boolean) {
  const authValue = {
    user: isAuthenticated ? { username: "John", token: "t" } : null,
    isAuthenticated,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
  };

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AuthContext.Provider value={authValue}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("should render children when authenticated", () => {
    renderWithAuth(true);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to /login and hide children when not authenticated", () => {
    renderWithAuth(false);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});