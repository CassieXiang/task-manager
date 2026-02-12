"use client";

import { useState } from "react";
import type { Filter } from "@/lib/types";
import { useTasks } from "@/hooks/useTasks";
import TaskForm from "@/components/TaskForm";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import SortToggle from "@/components/SortToggle";
import TaskList from "@/components/TaskList";

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortEnabled, setSortEnabled] = useState(false);
  const { displayedTasks, addTask, toggleTask, updateTask, deleteTask } =
    useTasks(activeFilter, searchQuery, sortEnabled);

  return (
    <>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Task Manager
      </h1>

      <section className="mb-10">
        <TaskForm onAddTask={addTask} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
          Your tasks
        </h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar active={activeFilter} onChange={setActiveFilter} />
        <SortToggle
          enabled={sortEnabled}
          onToggle={() => setSortEnabled((prev) => !prev)}
        />
        <TaskList
          tasks={displayedTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onToggle={toggleTask}
        />
      </section>
    </>
  );
}
