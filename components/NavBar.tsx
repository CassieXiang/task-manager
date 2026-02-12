"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/diary", label: "Diary" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Productivity
          </Link>
          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(href)
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </nav>
  );
}
