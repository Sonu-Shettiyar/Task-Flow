import { Tag } from "antd";
import type { TaskStatus } from "../types";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "default" },
  "in-progress": { label: "In Progress", color: "warning" },
  done: { label: "Done", color: "success" },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}
