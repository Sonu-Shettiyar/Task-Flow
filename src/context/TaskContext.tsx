import * as api from "../api/task";
import React, { useState, useCallback } from "react";

import { useAuth } from "../hooks/useAuth";
import type { Task, TaskState } from "../types";
import { TaskContext } from "../hooks/useTasks";


export  function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<TaskState>({ tasks: [], isLoading: false, error: null });

  const token = user?.token || "";

  const loadTasks = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const tasks = await api.fetchTasks(token);
      setState({ tasks, isLoading: false, error: null });
    } catch {
      setState((s) => ({ ...s, isLoading: false, error: "Failed to load tasks" }));
    }
  }, [token]);

  const addTask = useCallback(async (task: Partial<Task>) => {
    try {
      const newTask = await api.createTask(token, task);
      setState((s) => ({ ...s, tasks: [...s.tasks, newTask] }));
    } catch {
      setState((s) => ({ ...s, error: "Failed to create task" }));
    }
  }, [token]);

  const editTask = useCallback(async (id: string, task: Partial<Task>) => {
    try {
      const updated = await api.updateTask(token, id, task);
      setState((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      setState((s) => ({ ...s, error: "Failed to update task" }));
    }
  }, [token]);

  const removeTask = useCallback(async (id: string) => {
    try {
      await api.deleteTask(token, id);
      setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch {
      setState((s) => ({ ...s, error: "Failed to delete task" }));
    }
  }, [token]);

  return (
    <TaskContext.Provider value={{ ...state, loadTasks, addTask, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
}