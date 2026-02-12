"use client";

import { useRouter } from "next/navigation";
import { useDiary } from "@/hooks/useDiary";
import Calendar from "@/components/Calendar";
import DiaryEditor from "@/components/DiaryEditor";

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DiaryPage() {
  const router = useRouter();
  const today = getTodayString();
  const { getEntry, saveEntry, hasEntry } = useDiary();

  function handleSelectDate(date: string) {
    router.push(`/diary/${date}`);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <Calendar
          selectedDate={today}
          onSelectDate={handleSelectDate}
          hasEntry={hasEntry}
        />
      </aside>
      <main className="flex-1">
        <DiaryEditor
          date={today}
          initialContent={getEntry(today)}
          onSave={saveEntry}
        />
      </main>
    </div>
  );
}
