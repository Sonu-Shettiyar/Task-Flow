import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button, Space } from "antd";
import { LogoutOutlined, CheckSquareOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquareOutlined className="text-xl text-primary" />
          <span className="text-lg font-bold tracking-tight">TaskFlow</span>
        </div>
        <Space>
          <Button
            type="text"
            icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          />
          {user && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hey, <span className="font-medium text-foreground">{user.username}</span>
              </span>
              <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Space>
      </div>
    </header>
  );
}
