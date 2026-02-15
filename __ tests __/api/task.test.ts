import axios from "axios";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../src/api/task";
import type { Task } from "../../src/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("api/task", () => {
  const token = "fake-jwt-token";
  const expectedHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: "todo",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const mockTaskList: Task[] = [
    mockTask,
    {
      id: "2",
      title: "Second Task",
      description: "Another description",
      status: "in-progress",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      title: "Done Task",
      description: "Completed task",
      status: "done",
      createdAt: "2024-01-03T00:00:00.000Z",
      updatedAt: "2024-01-03T00:00:00.000Z",
    },
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe("fetchTasks", () => {
    it("should send GET request to /api/tasks & return an array of tasks on success", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTaskList });

          const result = await fetchTasks(token);

      expect(result).toEqual(mockTaskList);
      expect(result).toHaveLength(3);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/tasks", expectedHeaders);
    });
 
 
    it("should pass the correct Bearer token in Authorization header", async () => {
      const customToken = "my-special-token-123";
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await fetchTasks(customToken);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/tasks", {
        headers: { Authorization: `Bearer my-special-token-123` },
      });
    });

 
    it("should throw when axios rejects with a 401 unauthorized error", async () => {
      const error = {
        response: { status: 401, data: { message: "Unauthorized" } },
        message: "Request failed with status code 401",
      };
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(fetchTasks(token)).rejects.toEqual(error);
    });
  });

  // ─── createTask ──────────────────────────────────────────────

  describe("createTask", () => {
    const newTask: Partial<Task> = {
      title: "New Task",
      description: "New Description",
      status: "todo",
    };

    it("should send POST request to /api/tasks with task data and return the created task on success", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockTask });


      const result = await createTask(token, newTask);

      expect(result).toEqual(mockTask);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/tasks",
        newTask,
        expectedHeaders
      );
    });

 

    it("should handle creating a task with only title (minimal data)", async () => {
      const minimalTask: Partial<Task> = { title: "Minimal" };
      const returnedTask: Task = {
        ...mockTask,
        title: "Minimal",
        description: "",
      };
      mockedAxios.post.mockResolvedValueOnce({ data: returnedTask });

      const result = await createTask(token, minimalTask);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/tasks",
        minimalTask,
        expectedHeaders
      );
      expect(result).toEqual(returnedTask);
    });

    it("should throw when axios rejects with a 400 bad request", async () => {
      const error = {
        response: { status: 400, data: { message: "Title is required" } },
        message: "Request failed with status code 400",
      };
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(createTask(token, {})).rejects.toEqual(error);
    });

 
  });

  // ─── updateTask ──────────────────────────────────────────────

  describe("updateTask", () => {
    const taskId = "1";
    const updates: Partial<Task> = {
      title: "Updated Title",
      status: "in-progress",
    };

    it("should send PUT request to /api/tasks/:id with updates and return updated data", async () => {
      const updatedTask: Task = { ...mockTask, ...updates };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedTask });

        const result = await updateTask(token, taskId, updates);

      expect(result).toEqual(updatedTask);
      expect(result.title).toBe("Updated Title");
      expect(result.status).toBe("in-progress");

      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/tasks/${taskId}`,
        updates,
        expectedHeaders
      );
    });

 

    it("should correctly interpolate different task IDs in the URL", async () => {
      const differentId = "abc-123-xyz";
      mockedAxios.put.mockResolvedValueOnce({ data: mockTask });

      await updateTask(token, differentId, updates);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/tasks/abc-123-xyz`,
        updates,
        expectedHeaders
      );
    });

    it("should handle updating only the status", async () => {
      const statusUpdate: Partial<Task> = { status: "done" };
      const updatedTask: Task = { ...mockTask, status: "done" };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedTask });

      const result = await updateTask(token, taskId, statusUpdate);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/tasks/${taskId}`,
        statusUpdate,
        expectedHeaders
      );
      expect(result.status).toBe("done");
    });

    it("should throw when axios rejects with a 404 not found", async () => {
      const error = {
        response: { status: 404, data: { message: "Task not found" } },
        message: "Request failed with status code 404",
      };
      mockedAxios.put.mockRejectedValueOnce(error);

      await expect(updateTask(token, "non-existent-id", updates)).rejects.toEqual(
        error
      );
    });
 
  });

  // ─── deleteTask ──────────────────────────────────────────────

  describe("deleteTask", () => {
    const taskId = "1";

    it("should send DELETE request to /api/tasks/:id & return void", async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: {} });

     const result = await deleteTask(token, taskId);

      expect(result).toBeUndefined();

      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `/api/tasks/${taskId}`,
        expectedHeaders
      );
    });

 
    it("should correctly interpolate different task IDs in the URL", async () => {
      const differentId = "task-456";
      mockedAxios.delete.mockResolvedValueOnce({ data: {} });

      await deleteTask(token, differentId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `/api/tasks/task-456`,
        expectedHeaders
      );
    });

    it("should throw when axios rejects with a 404 not found", async () => {
      const error = {
        response: { status: 404, data: { message: "Task not found" } },
        message: "Request failed with status code 404",
      };
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(deleteTask(token, "non-existent-id")).rejects.toEqual(error);
    });

    it("should throw when axios rejects with a 403 forbidden", async () => {
      const error = {
        response: { status: 403, data: { message: "Forbidden" } },
        message: "Request failed with status code 403",
      };
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(deleteTask(token, taskId)).rejects.toEqual(error);
    });
 
  });

 
});