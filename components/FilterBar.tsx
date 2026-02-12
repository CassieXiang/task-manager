"use client";

import type { Filter } from "@/lib/types";

const FILTERS: Filter[] = ["All", "Active", "Completed"];

interface FilterBarProps {
  active: Filter;
  onChange: (filter: Filter) => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      className="mb-4 flex w-full flex-row items-stretch justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-100/50 p-1 dark:border-zinc-700 dark:bg-zinc-800/50"
      role="tablist"
      aria-label="Filter tasks"
    >
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          onClick={() => onChange(filter)}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition ${
            active === filter
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
          aria-selected={active === filter}
          aria-label={`Show ${filter.toLowerCase()} tasks`}
          tabIndex={active === filter ? 0 : -1}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
