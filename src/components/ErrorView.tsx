import { Alert, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="py-10 animate-fade-in">
      <Alert
        title="Something went wrong"
        description={message}
        type="error"
        showIcon
        action={
          onRetry ? (
            <Button size="small" danger icon={<ReloadOutlined />} onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
