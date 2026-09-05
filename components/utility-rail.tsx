"use client";

import { ArrowUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./theme-toggle";

export default function UtilityRail({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 360);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <aside className="utility-rail" aria-label="页面工具">
    <button className="icon-button focus-ring" onClick={onOpenSearch} aria-label="搜索文章" title="搜索文章"><Search size={18} /></button>
    <ThemeToggle />
    {visible && <button className="icon-button focus-ring utility-rail__top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })} aria-label="回到顶部" title="回到顶部"><ArrowUp size={18} /></button>}
  </aside>;
}
