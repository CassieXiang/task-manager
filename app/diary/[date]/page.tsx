"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useDiary } from "@/hooks/useDiary";
import Calendar from "@/components/Calendar";
import DiaryEditor from "@/components/DiaryEditor";

export default function DiaryDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const router = useRouter();
  const { getEntry, saveEntry, hasEntry } = useDiary();

  function handleSelectDate(d: string) {
    router.push(`/diary/${d}`);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <Calendar
          selectedDate={date}
          onSelectDate={handleSelectDate}
          hasEntry={hasEntry}
        />
      </aside>
      <main className="flex-1">
        <DiaryEditor
          date={date}
          initialContent={getEntry(date)}
          onSave={saveEntry}
        />
      </main>
    </div>
  );
}
