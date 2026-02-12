"use client";

import type { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-12 px-6 text-center dark:border-zinc-600 dark:bg-zinc-900/30"
      role="status"
      aria-label="No tasks"
    >
      <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">
        No tasks yet
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        Add a task above to get started.
      </p>
    </div>
  );
}

export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
  onToggle,
}: TaskListProps) {
  return (
    <section aria-label="Task list">
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
