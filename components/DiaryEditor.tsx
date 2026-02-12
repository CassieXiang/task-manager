"use client";

import { useState, useEffect } from "react";

interface DiaryEditorProps {
  date: string;
  initialContent: string;
  onSave: (date: string, content: string) => void;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("default", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DiaryEditor({ date, initialContent, onSave }: DiaryEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setSaved(false);
  }, [date, initialContent]);

  function handleSave() {
    onSave(date, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {formatDisplayDate(date)}
      </h2>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        placeholder="Write about your day..."
        className="min-h-[300px] flex-1 resize-y rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 placeholder-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-600 sm:min-h-[400px]"
        aria-label={`Diary entry for ${date}`}
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
        >
          Save
        </button>
        {saved && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Saved!
          </span>
        )}
      </div>
    </div>
  );
}
