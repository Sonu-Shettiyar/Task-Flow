import { createContext, useContext } from "react";
import type { Task, TaskState } from "../types";

interface TaskContextType extends TaskState {
  loadTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  editTask: (id: string, task: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);


export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}