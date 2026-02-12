"use client";

import { useCallback, useMemo } from "react";
import type { Task, Priority, Filter } from "@/lib/types";
import { isTaskArray } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { useLocalStorage } from "./useLocalStorage";

const TASKS_STORAGE_KEY = "task-manager-tasks";

export function useTasks(activeFilter: Filter, searchQuery: string) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, [], isTaskArray);

  const displayedTasks = useMemo(() => {
    const byStatus =
      activeFilter === "Active"
        ? tasks.filter((t) => !t.completed)
        : activeFilter === "Completed"
          ? tasks.filter((t) => t.completed)
          : tasks;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byStatus;
    return byStatus.filter((t) => t.title.toLowerCase().includes(query));
  }, [tasks, activeFilter, searchQuery]);

  const addTask = useCallback(
    (title: string, priority: Priority, dueDate: string | null) => {
      setTasks((prev) => [
        ...prev,
        {
          id: generateId(),
          title: title.trim(),
          completed: false,
          priority,
          dueDate,
        },
      ]);
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, title: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: title.trim() } : t))
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );

  return { tasks, displayedTasks, addTask, toggleTask, updateTask, deleteTask };
}
