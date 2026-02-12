export type Priority = "High" | "Medium" | "Low";

export type Filter = "All" | "Active" | "Completed";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string | null;
}

/** Date string → diary text mapping. */
export interface DiaryEntries {
  [date: string]: string;
}

/** Runtime check that a value is a valid DiaryEntries object. */
export function isDiaryEntries(value: unknown): value is DiaryEntries {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return Object.entries(value as Record<string, unknown>).every(
    ([key, val]) => typeof key === "string" && typeof val === "string"
  );
}

/** Runtime check that a value is a valid Task array. */
export function isTaskArray(value: unknown): value is Task[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.completed === "boolean" &&
      (item.priority === "High" || item.priority === "Medium" || item.priority === "Low")
  );
}
