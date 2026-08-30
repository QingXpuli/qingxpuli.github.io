"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return <button className="focus-ring rounded-full border border-[var(--line)] p-2 text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]" onClick={toggle} aria-label={dark ? "切换到浅色主题" : "切换到深色主题"} title={dark ? "浅色主题" : "深色主题"}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
