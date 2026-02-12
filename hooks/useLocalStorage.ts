"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Persists state in localStorage with JSON serialization.
 * Safe when localStorage is empty, unavailable, or contains invalid JSON.
 * Loads from localStorage only after mount to avoid hydration mismatch.
 *
 * @param key - localStorage key
 * @param initialValue - default value when nothing is stored
 * @param validate - optional function to validate parsed data; return false to reject
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const isFirstSaveRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.localStorage.getItem(key);
      if (item != null && item !== "") {
        const parsed: unknown = JSON.parse(item);
        if (validate) {
          if (validate(parsed)) {
            setValue(parsed);
          } else {
            console.warn(`useLocalStorage: validation failed for key "${key}", using initialValue`);
          }
        } else {
          setValue(parsed as T);
        }
      }
    } catch {
      // keep initialValue
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstSaveRef.current) {
      isFirstSaveRef.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("useLocalStorage: failed to save", e);
    }
  }, [key, value]);

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue
    );
  }, []);

  return [value, setStoredValue];
}
