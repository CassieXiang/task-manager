"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface NavCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export default function NavCard({ href, icon, title, description }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80 dark:hover:border-zinc-600 dark:hover:shadow-zinc-900/50"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-zinc-200 group-hover:text-zinc-900 dark:bg-zinc-700 dark:text-zinc-300 dark:group-hover:bg-zinc-600 dark:group-hover:text-zinc-100">
        {icon}
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
