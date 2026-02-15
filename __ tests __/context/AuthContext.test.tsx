import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "../../src/context/AuthContext";
import { useAuth } from "../../src/hooks/useAuth";
import * as authApi from "../../src/api/auth";
import axios from "axios";
import type { ReactNode } from "react";

jest.mock("../../src/api/auth");
const mockedLoginApi = authApi.loginApi as jest.MockedFunction<typeof authApi.loginApi>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthProvider", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize as unauthenticated when sessionStorage is empty, then login successfully and persist to sessionStorage", async () => {
    const mockUser = { username: "John", token: "abc" };
    mockedLoginApi.mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initial state — unauthenticated
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // Login
    await act(() => result.current.login({ username: "John", password: "pass" }));

    expect(mockedLoginApi).toHaveBeenCalledWith({ username: "John", password: "pass" });
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(sessionStorage.getItem("task_app_auth")).toBe(JSON.stringify(mockUser));
  });

  it("should restore user from sessionStorage on mount", () => {
    const storedUser = { username: "Stored", token: "xyz" };
    sessionStorage.setItem("task_app_auth", JSON.stringify(storedUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(storedUser);
    expect(result.current.isAuthenticated).toBe(true);
  });


  it("should fallback to 'Login failed' when axios error has no response message", async () => {
    const axiosError = { response: { data: {} }, isAxiosError: true };
    mockedLoginApi.mockRejectedValueOnce(axiosError);
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(() => result.current.login({ username: "u", password: "p" }));

    expect(result.current.error).toBe("Login failed");
  });

  it("should clear sessionStorage and reset state on logout", async () => {
    const mockUser = { username: "John", token: "abc" };
    mockedLoginApi.mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(() => result.current.login({ username: "John", password: "pass" }));
    expect(result.current.isAuthenticated).toBe(true);

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem("task_app_auth")).toBeNull();
  });
});