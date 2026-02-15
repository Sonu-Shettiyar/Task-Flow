import { renderHook } from "@testing-library/react";
import { useTasks, TaskContext } from "../../src/hooks/useTasks";
import type { ReactNode } from "react";

describe("useTasks", () => {
  it("should return context value when used within TaskProvider", () => {
    const mockValue = {
      tasks: [],
      isLoading: false,
      error: null,
      loadTasks: jest.fn(),
      addTask: jest.fn(),
      editTask: jest.fn(),
      removeTask: jest.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskContext.Provider value={mockValue}>{children}</TaskContext.Provider>
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    expect(result.current).toBe(mockValue);
  });

  it("should throw when used outside TaskProvider", () => {
    expect(() => renderHook(() => useTasks())).toThrow(
      "useTasks must be used within TaskProvider"
    );
  });
});