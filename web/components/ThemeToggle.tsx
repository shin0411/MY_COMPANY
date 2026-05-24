"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const cycle = () => {
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  if (!mounted) {
    return <div className="size-8" aria-hidden />;
  }

  const icon = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "🖥️";
  const label =
    theme === "light"
      ? "ライトモード（クリックでダーク）"
      : theme === "dark"
      ? "ダークモード（クリックでシステム連動）"
      : "システム連動（クリックでライト）";

  return (
    <button
      onClick={cycle}
      title={label}
      aria-label={label}
      className="size-8 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors text-base"
    >
      <span aria-hidden>{icon}</span>
    </button>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}
