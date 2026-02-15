import { renderHook, act } from "@testing-library/react";
import { TaskProvider } from "../../src/context/TaskContext";
import { useTasks } from "../../src/hooks/useTasks";
import * as taskApi from "../../src/api/task";
import type { ReactNode } from "react";
import type { Task } from "../../src/types";

jest.mock("../../src/api/task");
jest.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({ user: { username: "John", token: "test-token" } }),
}));

const mockedApi = taskApi as jest.Mocked<typeof taskApi>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <TaskProvider>{children}</TaskProvider>
);

const mockTask: Task = {
  id: "1",
  title: "Task 1",
  description: "Desc",
  status: "todo",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockTask2: Task = { ...mockTask, id: "2", title: "Task 2" };

describe("TaskProvider", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should initialize with empty state, then loadTasks successfully", async () => {
    mockedApi.fetchTasks.mockResolvedValueOnce([mockTask, mockTask2]);

    const { result } = renderHook(() => useTasks(), { wrapper });

    // Initial state
    expect(result.current.tasks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(() => result.current.loadTasks());

    expect(mockedApi.fetchTasks).toHaveBeenCalledWith("test-token");
    expect(result.current.tasks).toEqual([mockTask, mockTask2]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should set error when loadTasks fails", async () => {
    mockedApi.fetchTasks.mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(() => result.current.loadTasks());

    expect(result.current.error).toBe("Failed to load tasks");
    expect(result.current.isLoading).toBe(false);
  });

  it("should addTask successfully and set error on failure", async () => {
    mockedApi.createTask.mockResolvedValueOnce(mockTask);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(() => result.current.addTask({ title: "Task 1" }));

    expect(mockedApi.createTask).toHaveBeenCalledWith("test-token", { title: "Task 1" });
    expect(result.current.tasks).toEqual([mockTask]);


    mockedApi.createTask.mockRejectedValueOnce(new Error("fail"));

    await act(() => result.current.addTask({ title: "Bad" }));

    expect(result.current.error).toBe("Failed to create task");
  });

  it("should editTask successfully replacing the correct task, and set error on failure", async () => {
    mockedApi.fetchTasks.mockResolvedValueOnce([mockTask, mockTask2]);
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(() => result.current.loadTasks());

    const updatedTask = { ...mockTask, title: "Updated" };
    mockedApi.updateTask.mockResolvedValueOnce(updatedTask);

    await act(() => result.current.editTask("1", { title: "Updated" }));

    expect(mockedApi.updateTask).toHaveBeenCalledWith("test-token", "1", { title: "Updated" });
    expect(result.current.tasks[0]).toEqual(updatedTask);
    expect(result.current.tasks[1]).toEqual(mockTask2); // untouched


    mockedApi.updateTask.mockRejectedValueOnce(new Error("fail"));

    await act(() => result.current.editTask("1", { title: "Bad" }));

    expect(result.current.error).toBe("Failed to update task");
  });

  it("should removeTask successfully filtering it out, and set error on failure", async () => {
    mockedApi.fetchTasks.mockResolvedValueOnce([mockTask, mockTask2]);
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(() => result.current.loadTasks());

    mockedApi.deleteTask.mockResolvedValueOnce();

    await act(() => result.current.removeTask("1"));

    expect(mockedApi.deleteTask).toHaveBeenCalledWith("test-token", "1");
    expect(result.current.tasks).toEqual([mockTask2]);


    mockedApi.deleteTask.mockRejectedValueOnce(new Error("fail"));

    await act(() => result.current.removeTask("2"));

    expect(result.current.error).toBe("Failed to delete task");
  });
});