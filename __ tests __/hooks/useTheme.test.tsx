import { renderHook } from "@testing-library/react";
import { useAuth, AuthContext } from "../../src/hooks/useAuth";
import type { ReactNode } from "react";

describe("useAuth", () => {
  it("should return context value when used within AuthProvider", () => {
    const mockValue = {
      user: { username: "John", token: "t" },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(mockValue);
  });

  it("should throw when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within AuthProvider"
    );
  });
});