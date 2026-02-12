"use client";

import { useCallback } from "react";
import type { DiaryEntries } from "@/lib/types";
import { isDiaryEntries } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";

const DIARY_STORAGE_KEY = "diary-entries";

export function useDiary() {
  const [entries, setEntries] = useLocalStorage<DiaryEntries>(
    DIARY_STORAGE_KEY,
    {},
    isDiaryEntries
  );

  const getEntry = useCallback(
    (date: string): string => entries[date] ?? "",
    [entries]
  );

  const saveEntry = useCallback(
    (date: string, content: string) => {
      setEntries((prev) => {
        if (content.trim() === "") {
          const next = { ...prev };
          delete next[date];
          return next;
        }
        return { ...prev, [date]: content };
      });
    },
    [setEntries]
  );

  const hasEntry = useCallback(
    (date: string): boolean =>
      date in entries && entries[date].trim() !== "",
    [entries]
  );

  return { entries, getEntry, saveEntry, hasEntry };
}
