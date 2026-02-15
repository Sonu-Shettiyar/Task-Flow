import { renderHook, act } from "@testing-library/react";
import { ThemeProvider } from "../../src/context/ThemeContext";
import { useTheme } from "../../src/hooks/useTheme";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("should initialize from localStorage, apply class to <html>, persist to localStorage, and toggle between light/dark", () => {
    localStorage.setItem("task_app_theme", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("task_app_theme")).toBe("dark");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("task_app_theme")).toBe("light");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("dark");
  });

  it("should initialize from localStorage when stored value is 'light'", () => {
    localStorage.setItem("task_app_theme", "light");

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
  });

  it("should fall back to system preference when localStorage has invalid value", () => {
    localStorage.setItem("task_app_theme", "invalid-value");
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
  });
});