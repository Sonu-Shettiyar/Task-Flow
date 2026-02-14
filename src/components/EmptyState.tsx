import { Button, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface EmptyStateProps {
  onCreateTask: () => void;
}

export default function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="rounded-2xl bg-secondary p-6 mb-6">
        <FileTextOutlined className="text-4xl text-muted-foreground" />
      </div>
      <Title level={4} className="!mb-2">No tasks yet</Title>
      <Paragraph type="secondary" className="max-w-sm text-center !mb-6">
        Get started by creating your first task. Stay organized and track your progress.
      </Paragraph>
      <Button type="primary" onClick={onCreateTask}>Create your first task</Button>
    </div>
  );
}
