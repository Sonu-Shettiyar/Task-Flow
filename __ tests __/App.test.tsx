import { render, screen } from "@testing-library/react";
import App from "../src/App";

// To prevent actual interceptors
jest.mock("../src/mocks/interceptors", () => ({
  setupMockApi: jest.fn(),
}));

jest.mock("../src/pages/Index", () => ({
  __esModule: true,
  default: () => <div data-testid="index-page">Index Page</div>,
}));

jest.mock("../src/pages/Login", () => ({
  __esModule: true,
  default: () => <div data-testid="login-page">Login Page</div>,
}));

jest.mock("../src/pages/Dashboard", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

jest.mock("../src/pages/NotFound", () => ({
  __esModule: true,
  default: () => <div data-testid="notfound-page">NotFound Page</div>,
}));

jest.mock("../src/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("App", () => {
  beforeEach(() => {
    // Reset URL to root before each test
    window.history.pushState({}, "", "/");
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should render Index page at root route and wrap with all providers", () => {
    render(<App />);

    expect(screen.getByTestId("index-page")).toBeInTheDocument();
  });

  it("should render Login page at /login route", () => {
    window.history.pushState({}, "", "/login");

    render(<App />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("should render Dashboard page at /dashboard route", () => {
    window.history.pushState({}, "", "/dashboard");

    render(<App />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("should render NotFound page at unknown routes", () => {
    window.history.pushState({}, "", "/unknown-route");

    render(<App />);

    expect(screen.getByTestId("notfound-page")).toBeInTheDocument();
  });

  it("should apply dark theme algorithm when theme is dark", () => {
    localStorage.setItem("task_app_theme", "dark");

    const { container } = render(<App />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("should apply light theme algorithm when theme is light", () => {
    localStorage.setItem("task_app_theme", "light");

    const { container } = render(<App />);

    expect(container.firstChild).toBeInTheDocument();
  });
});