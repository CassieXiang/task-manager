import NavCard from "@/components/NavCard";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        My Productivity App
      </h1>
      <p className="mb-12 text-lg text-zinc-500 dark:text-zinc-400">
        What would you like to do today?
      </p>
      <div className="grid w-full max-w-md grid-cols-1 gap-6 sm:grid-cols-2">
        <NavCard
          href="/tasks"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
          title="Task Manager"
          description="Organize tasks with priorities and deadlines"
        />
        <NavCard
          href="/diary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          }
          title="Diary"
          description="Record your thoughts day by day"
        />
      </div>
    </div>
  );
}
