import { useEffect, useState } from "react";
import { Button, Input, Select, Spin, Typography } from "antd";
import { PlusOutlined, SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";

import Header from "../components/Headers";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import ErrorView from "../components/ErrorView";
import EmptyState from "../components/EmptyState";

import type { Task, TaskStatus } from "../types";
import { useTasks } from "../hooks/useTasks";

const { Text } = Typography;

export default function Dashboard() {
  const { tasks, isLoading, error, loadTasks, addTask, editTask, removeTask } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filtered = (filter === "all" ? tasks : tasks.filter((t) => t.status === filter))
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleSubmit = async (data: Partial<Task>) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-3xl py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
            <Text type="secondary">
              {counts.all} total · {counts.todo} to do · {counts["in-progress"]} in progress · {counts.done} done
            </Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen(true)}>
            New Task
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search tasks..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
            allowClear
          />
          <Select
            value={filter}
            onChange={(v) => setFilter(v)}
            className="w-full sm:w-[140px]"
            options={[
              { value: "all", label: "All Tasks" },
              { value: "todo", label: "To Do" },
              { value: "in-progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
          />
          <Select
            value={sortBy}
            onChange={(v) => setSortBy(v)}
            className="w-full sm:w-[140px]"
            suffixIcon={<SortAscendingOutlined />}
            options={[
              { value: "date", label: "By Date" },
              { value: "title", label: "By Title" },
              { value: "status", label: "By Status" },
            ]}
          />
        </div>

        {error && <ErrorView message={error} onRetry={loadTasks} />}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : !error && filtered.length === 0 && filter === "all" ? (
          <EmptyState onCreateTask={() => setFormOpen(true)} />
        ) : !error && filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No tasks with status "{filter}"
          </div>
        ) : (
          !error && (
            <div>
              {filtered.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={removeTask} />
              ))}
            </div>
          )
        )}
      </main>

      <TaskForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingTask}
      />
    </div>
  );
}
