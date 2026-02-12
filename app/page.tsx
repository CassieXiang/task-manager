"use client";

import { useState } from "react";
import type { Filter } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";
import { useTasks } from "@/hooks/useTasks";
import ThemeToggle from "@/components/ThemeToggle";
import TaskForm from "@/components/TaskForm";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { displayedTasks, addTask, toggleTask, updateTask, deleteTask } =
    useTasks(activeFilter, searchQuery);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Task Manager
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <section className="mb-10">
          <TaskForm onAddTask={addTask} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Your tasks
          </h2>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
          <TaskList
            tasks={displayedTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggle={toggleTask}
          />
        </section>
      </main>
    </div>
  );
}
