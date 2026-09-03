"use client";

import { Heart, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const messages = ["今天也留下了一点什么。", "慢慢来，页面会长出来。", "欢迎回来。", "这段旋律很适合现在。"];

export default function Companion() {
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(true);
  if (pathname === "/music" || pathname === "/music/") return null;

  return <div className={`fixed bottom-5 right-5 z-40 flex items-end gap-2 ${open ? "" : "translate-x-2"}`}>
    {open && message && <div className="glass max-w-48 rounded-lg px-3 py-2 text-xs text-[var(--muted)] shadow-lg" role="status">{message}</div>}
    <button className="focus-ring group relative h-14 w-14 rounded-full border border-white/70 bg-[var(--accent-soft)] shadow-lg transition hover:-translate-y-1 dark:border-white/10" onClick={() => { setMessage(messages[Math.floor(Math.random() * messages.length)]); }} aria-label="互动挂件" title="互动挂件">
      <span className="absolute left-3 top-4 h-2 w-2 rounded-full bg-[var(--ink)] transition group-hover:scale-125" /><span className="absolute right-3 top-4 h-2 w-2 rounded-full bg-[var(--ink)] transition group-hover:scale-125" />
      <span className="absolute bottom-3 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-[var(--coral)]" /><Sparkles className="absolute -right-1 -top-2 text-[var(--coral)]" size={16} />
    </button>
    <button className="focus-ring glass rounded-full p-2 text-[var(--muted)] transition hover:text-[var(--coral)]" onClick={() => setOpen(!open)} aria-label={open ? "收起互动挂件" : "展开互动挂件"} title={open ? "收起挂件" : "展开挂件"}>{open ? <Heart size={14} fill="currentColor" /> : <Sparkles size={14} />}</button>
  </div>;
}
