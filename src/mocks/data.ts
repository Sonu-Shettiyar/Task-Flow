import type { Task } from "../types";

const TASKS_KEY = "mock_tasks";

const DEFAULT_TASKS: Task[] = [
  {
    id: "1",
    title: "Design landing page wireframes",
    description: "Create low-fidelity wireframes for the new product landing page including hero, features, and CTA sections.",
    status: "done",
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-11T14:30:00Z",
  },
  {
    id: "2",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment to staging environment.",
    status: "in-progress",
    createdAt: "2026-02-11T10:00:00Z",
    updatedAt: "2026-02-12T16:00:00Z",
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST endpoints with request/response examples using OpenAPI specification.",
    status: "todo",
    createdAt: "2026-02-12T08:00:00Z",
    updatedAt: "2026-02-12T08:00:00Z",
  },
  {
    id: "4",
    title: "Implement user notifications",
    description: "Add real-time notifications for task assignments and status changes using WebSocket connections.",
    status: "todo",
    createdAt: "2026-02-12T11:00:00Z",
    updatedAt: "2026-02-12T11:00:00Z",
  },
];

export function getTasks(): Task[] {
  const stored = localStorage.getItem(TASKS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(TASKS_KEY, JSON.stringify(DEFAULT_TASKS));
  return DEFAULT_TASKS;
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}


export const VALID_USER = { username: "test", password: "test123" };
export const FAKE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MDg1OTIwMDB9.mock_signature";
