"use client";

import { useCallback, useMemo } from "react";
import type { Task, Priority, Filter } from "@/lib/types";
import { isTaskArray } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { useLocalStorage } from "./useLocalStorage";

const TASKS_STORAGE_KEY = "task-manager-tasks";

const PRIORITY_ORDER: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function getDaysUntilDue(dueDate?: string | null): number {
  if (!dueDate) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  if (Number.isNaN(due.getTime())) return Infinity;
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function sortByPriorityAndDeadline(tasks: Task[]): Task[] {
  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  active.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return getDaysUntilDue(a.dueDate) - getDaysUntilDue(b.dueDate);
  });

  return [...active, ...completed];
}

export function useTasks(
  activeFilter: Filter,
  searchQuery: string,
  sortEnabled: boolean
) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, [], isTaskArray);

  const displayedTasks = useMemo(() => {
    const byStatus =
      activeFilter === "Active"
        ? tasks.filter((t) => !t.completed)
        : activeFilter === "Completed"
          ? tasks.filter((t) => t.completed)
          : tasks;

    const query = searchQuery.trim().toLowerCase();
    const searched = query
      ? byStatus.filter((t) => t.title.toLowerCase().includes(query))
      : byStatus;

    if (sortEnabled) {
      return sortByPriorityAndDeadline(searched);
    }
    return searched;
  }, [tasks, activeFilter, searchQuery, sortEnabled]);

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
