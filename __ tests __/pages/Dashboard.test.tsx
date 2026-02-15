import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Dashboard from "../../src/pages/Dashboard";
import { AuthContext } from "../../src/hooks/useAuth";
import { ThemeContext } from "../../src/hooks/useTheme";
import { TaskContext } from "../../src/hooks/useTasks";
import type { Task } from "../../src/types";

const mockLoadTasks = jest.fn();
const mockAddTask = jest.fn();
const mockEditTask = jest.fn();
const mockRemoveTask = jest.fn();

const mockTasks: Task[] = [
    {
        id: "1",
        title: "Alpha Task",
        description: "First desc",
        status: "todo",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-03T00:00:00Z",
    },
    {
        id: "2",
        title: "Beta Task",
        description: "Second desc",
        status: "in-progress",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
    },
    {
        id: "3",
        title: "Gamma Task",
        description: "Third desc",
        status: "done",
        createdAt: "2024-01-03T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
];

function renderDashboard({
    tasks = [] as Task[],
    isLoading = false,
    error = null as string | null,
}) {
    const authValue = {
        user: { username: "John", token: "t" },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
    };

    const themeValue = { theme: "light" as const, toggleTheme: jest.fn() };

    const taskValue = {
        tasks,
        isLoading,
        error,
        loadTasks: mockLoadTasks,
        addTask: mockAddTask,
        editTask: mockEditTask,
        removeTask: mockRemoveTask,
    };

    return render(
        <AuthContext.Provider value={authValue}>
            <ThemeContext.Provider value={themeValue}>
                <TaskContext.Provider value={taskValue}>
                    <Dashboard />
                </TaskContext.Provider>
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
}

describe("Dashboard", () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => {
        jest.clearAllTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it("should call loadTasks on mount and show loading spinner when isLoading", () => {
        renderDashboard({ isLoading: true });

        expect(mockLoadTasks).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Tasks")).toBeInTheDocument();
        expect(document.querySelector(".ant-spin")).toBeInTheDocument();
    });

    it("should show ErrorView with retry button when error exists", () => {
        renderDashboard({ error: "Failed to load" });

        expect(screen.getByText("Failed to load")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /retry/i }));
        expect(mockLoadTasks).toHaveBeenCalledTimes(2);
    });

    it("should show EmptyState when no tasks and filter is all, and open form on create click", () => {
        renderDashboard({ tasks: [] });

        expect(screen.getByText("No tasks yet")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /create your first task/i }));

        // modal title specifically in the modal header
        const modalTitle = document.querySelector(".ant-modal-title");
        expect(modalTitle).toHaveTextContent("New Task");
    });

    it("should render tasks, search/filter them, and handle edit/delete actions", async () => {
        renderDashboard({ tasks: mockTasks });

        // Counts  
        expect(screen.getByText(/3 total · 1 to do · 1 in progress · 1 done/)).toBeInTheDocument();

        // All 3 tasks visible
        expect(screen.getByText("Alpha Task")).toBeInTheDocument();
        expect(screen.getByText("Beta Task")).toBeInTheDocument();
        expect(screen.getByText("Gamma Task")).toBeInTheDocument();

        // Search n filters  
        fireEvent.change(screen.getByPlaceholderText("Search tasks..."), { target: { value: "Alpha" } });
        expect(screen.getByText("Alpha Task")).toBeInTheDocument();
        expect(screen.queryByText("Beta Task")).not.toBeInTheDocument();
        expect(screen.queryByText("Gamma Task")).not.toBeInTheDocument();

        // Clear search
        fireEvent.change(screen.getByPlaceholderText("Search tasks..."), { target: { value: "" } });
        expect(screen.getByText("Beta Task")).toBeInTheDocument();

        // Delete task
        const deleteButtons = screen.getAllByRole("button", { name: /delete task/i });
        fireEvent.click(deleteButtons[0]);
        expect(mockRemoveTask).toHaveBeenCalled();

        // Edit task opens modal
        const editButtons = screen.getAllByRole("button", { name: /edit task/i });
        fireEvent.click(editButtons[0]);

        const modalTitle = document.querySelector(".ant-modal-title");
        expect(modalTitle).toHaveTextContent("Edit Task");
    });

    it("should open new task form, submit addTask, and call handleSubmit for new task", async () => {
        renderDashboard({ tasks: [] });

        fireEvent.click(screen.getByRole("button", { name: /create your first task/i }));

        fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), { target: { value: "New" } });
        fireEvent.change(screen.getByPlaceholderText("Add more details..."), { target: { value: "Desc" } });

        // Submit
        fireEvent.click(screen.getByRole("button", { name: /create task/i }));

        await waitFor(() => {
            expect(mockAddTask).toHaveBeenCalledWith({ title: "New", description: "Desc", status: "todo" });
        });
    });

    it("should submit editTask when editing existing task", async () => {
        renderDashboard({ tasks: mockTasks });

        // Edit 
        fireEvent.click(screen.getAllByRole("button", { name: /edit task/i })[0]);

        const titleInput = screen.getByPlaceholderText("What needs to be done?");
        fireEvent.change(titleInput, { target: { value: "Updated Title" } });

        // Submit
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

        await waitFor(() => {
            expect(mockEditTask).toHaveBeenCalled();
        });
    });

});