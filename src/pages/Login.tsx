import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, Input, Button, Typography, Alert } from "antd";
import { CheckSquareOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const { Title, Paragraph, Text } = Typography;

export default function Login() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    login({ username: username.trim(), password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
      <Button
        type="text"
        icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-4 right-4"
      />
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <CheckSquareOutlined className="text-2xl text-primary-foreground" />
          </div>
          <Title level={3} className="!mb-1">TaskFlow</Title>
          <Paragraph type="secondary">Sign in to manage your tasks</Paragraph>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert title={error} type="error" showIcon />
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <Input.Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>

        <Paragraph type="secondary" className="mt-4 text-center !text-xs">
          Demo credentials: <Text code>test</Text> / <Text code>test123</Text>
        </Paragraph>
      </div>
    </div>
  );
}
