"use client";

interface SortToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SortToggle({ enabled, onToggle }: SortToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`mb-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
        enabled
          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
      }`}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable sorting" : "Sort by priority and deadline"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <line x1="4" y1="6" x2="16" y2="6" />
        <line x1="4" y1="12" x2="12" y2="12" />
        <line x1="4" y1="18" x2="8" y2="18" />
        <polyline points="15 15 18 18 21 15" />
        <line x1="18" y1="12" x2="18" y2="18" />
      </svg>
      {enabled ? "Sorted by priority & deadline" : "Sort by priority & deadline"}
    </button>
  );
}
