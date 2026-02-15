import { render } from "@testing-library/react";

import Index from "../../src/pages/Index";
import { AuthContext } from "../../src/hooks/useAuth";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
    mockNavigate(to, replace);
    return null;
  },
}));

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
    <AuthContext.Provider value={authValue}>
      <Index />
    </AuthContext.Provider>
  );
}

describe("Index", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should redirect to /dashboard when authenticated, /login when not", () => {
    renderWithAuth(true);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", true);

    mockNavigate.mockClear();

    renderWithAuth(false);
    expect(mockNavigate).toHaveBeenCalledWith("/login", true);
  });
});