export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) as "Today", "Tomorrow", "In X days", or "Overdue".
 * Returns null for empty/invalid dates so callers can hide the date.
 */
export function formatDueDate(
  dueDate: string | null | undefined
): { formatted: string; isOverdue: boolean } | null {
  if (dueDate == null || dueDate.trim() === "") return null;
  const date = new Date(dueDate + "T00:00:00");
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);

  const diffDays = Math.round((compare.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { formatted: "Overdue", isOverdue: true };
  }
  if (diffDays === 0) {
    return { formatted: "Today", isOverdue: false };
  }
  if (diffDays === 1) {
    return { formatted: "Tomorrow", isOverdue: false };
  }
  return {
    formatted: `In ${diffDays} days`,
    isOverdue: false,
  };
}
