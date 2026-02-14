import { Card, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";

import type { Task } from "../types";

const { Text, Paragraph } = Typography;

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="animate-fade-in mb-3 hover:shadow-md transition-shadow" size="small">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Text strong className="text-base truncate">{task.title}</Text>
            <StatusBadge status={task.status} />
          </div>
          <Paragraph type="secondary" className="!mb-0 text-sm" ellipsis={{ rows: 2 }}>
            {task.description}
          </Paragraph>
          <Text type="secondary" className="text-xs opacity-70">
            Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
          </Text>
        </div>
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} aria-label="Edit task" />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(task.id)} aria-label="Delete task" />
        </Space>
      </div>
    </Card>
  );
}
