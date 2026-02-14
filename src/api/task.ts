import axios from "axios";
import type { Task } from "../types";

function authHeaders(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function fetchTasks(token: string): Promise<Task[]> {
  const { data } = await axios.get("/api/tasks", authHeaders(token));
  return data;
}

export async function createTask(token: string, task: Partial<Task>): Promise<Task> {
  const { data } = await axios.post("/api/tasks", task, authHeaders(token));
  return data;
}

export async function updateTask(token: string, id: string, task: Partial<Task>): Promise<Task> {
  const { data } = await axios.put(`/api/tasks/${id}`, task, authHeaders(token));
  return data;
}

export async function deleteTask(token: string, id: string): Promise<void> {
  await axios.delete(`/api/tasks/${id}`, authHeaders(token));
}
