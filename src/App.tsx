import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme as antTheme } from "antd";

import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";

import { setupMockApi } from "./mocks/interceptors";
import { useTheme } from "./hooks/useTheme";

setupMockApi();

function AntConfigWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#0fa968",
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

const App = () => (
  <ThemeProvider>
    <AntConfigWrapper>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </AntConfigWrapper>
  </ThemeProvider>
);

export default App;
