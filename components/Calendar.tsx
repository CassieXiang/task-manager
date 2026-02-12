"use client";

import { useState, useMemo } from "react";

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  hasEntry?: (date: string) => boolean;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Calendar({
  selectedDate,
  onSelectDate,
  hasEntry,
}: CalendarProps) {
  const selParts = selectedDate.split("-").map(Number);
  const [viewYear, setViewYear] = useState(selParts[0] || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(
    selParts[1] != null ? selParts[1] - 1 : new Date().getMonth()
  );

  const todayStr = useMemo(() => {
    const d = new Date();
    return toDateString(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-1 font-medium text-zinc-500 dark:text-zinc-400"
          >
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }
          const dateStr = toDateString(viewYear, viewMonth, day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const hasContent = hasEntry?.(dateStr) ?? false;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={`relative rounded-lg py-1.5 text-sm transition ${
                isSelected
                  ? "bg-zinc-900 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : isToday
                    ? "font-semibold text-zinc-900 ring-1 ring-zinc-300 dark:text-zinc-100 dark:ring-zinc-600"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
              aria-label={`${day}`}
              aria-current={isToday ? "date" : undefined}
            >
              {day}
              {hasContent && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
