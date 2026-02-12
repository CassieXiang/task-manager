"use client";

import { useState, useRef, memo, FormEvent } from "react";
import type { Task, Priority } from "@/lib/types";
import { formatDueDate } from "@/lib/utils";

const priorityBadgeClasses: Record<Priority, string> = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

function TaskItem({ task, onUpdate, onDelete, onToggle }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const due = formatDueDate(task.dueDate);

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = editValue.trim();
    if (trimmed) {
      onUpdate(task.id, trimmed);
      setIsEditing(false);
      requestAnimationFrame(() => editBtnRef.current?.focus());
    }
  }

  function handleCancel() {
    setEditValue(task.title);
    setIsEditing(false);
    requestAnimationFrame(() => editBtnRef.current?.focus());
  }

  const cardBase =
    "rounded-xl border border-zinc-200 bg-white shadow-sm transition dark:border-zinc-700 dark:bg-zinc-800/80 dark:shadow-zinc-900/50";

  if (isEditing) {
    return (
      <li className={cardBase}>
        <form
          onSubmit={handleSave}
          className="flex flex-1 flex-wrap items-center gap-2 p-4"
        >
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
            autoFocus
            aria-label="Edit task"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center justify-between gap-4 p-4 ${cardBase}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="checkbox"
          id={`checkbox-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-zinc-400"
          aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
        />
        <label
          htmlFor={`checkbox-${task.id}`}
          className={`min-w-0 flex-1 cursor-pointer ${
            task.completed
              ? "text-zinc-500 line-through dark:text-zinc-400"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {task.title}
        </label>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeClasses[task.priority]}`}
          aria-label={`Priority: ${task.priority}`}
        >
          {task.priority}
        </span>
        {due && (
          <span
            className={`shrink-0 text-xs ${
              due.isOverdue && !task.completed
                ? "font-medium text-red-600 dark:text-red-400"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
            aria-label={`Due: ${due.formatted}`}
          >
            {due.formatted}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          ref={editBtnRef}
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.confirm("Delete this task?")) {
              onDelete(task.id);
            }
          }}
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default memo(TaskItem);
