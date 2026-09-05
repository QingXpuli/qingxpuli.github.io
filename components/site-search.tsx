"use client";

import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "../lib/content";

type SiteSearchProps = {
  open: boolean;
  onClose: () => void;
  posts: Post[];
};

export default function SiteSearch({ open, onClose, posts }: SiteSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    if (!keyword) return posts.slice(0, 5);
    return posts.filter((post) => `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLocaleLowerCase("zh-CN").includes(keyword));
  }, [posts, query]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  function close() {
    onClose();
    window.setTimeout(() => previousFocus.current?.focus(), 0);
  }

  if (!open) return null;

  return <div className="site-search" role="dialog" aria-modal="true" aria-label="搜索文章" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div className="site-search__panel">
      <div className="site-search__bar">
        <Search size={19} aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
          onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); close(); }
            if (event.key === "ArrowDown" && results.length) { event.preventDefault(); setActiveIndex((current) => (current + 1) % results.length); }
            if (event.key === "ArrowUp" && results.length) { event.preventDefault(); setActiveIndex((current) => (current - 1 + results.length) % results.length); }
            if (event.key === "Enter" && results[activeIndex]) { event.preventDefault(); window.location.assign(`/posts/${results[activeIndex].slug}/`); }
          }}
          placeholder="搜索文章"
          aria-label="搜索标题、摘要或标签"
        />
        <button className="icon-button focus-ring" onClick={close} aria-label="关闭搜索" title="关闭搜索"><X size={18} /></button>
      </div>
      <div className="site-search__results" role="listbox" aria-label="文章结果">
        {results.length ? results.map((post, index) => <Link
          className={`site-search__result focus-ring ${index === activeIndex ? "site-search__result--active" : ""}`}
          href={`/posts/${post.slug}/`}
          key={post.slug}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={close}
          role="option"
          aria-selected={index === activeIndex}
        >
          <span><strong>{post.title}</strong><small>{post.summary}</small></span><ArrowUpRight size={16} aria-hidden="true" />
        </Link>) : <p className="site-search__empty">没有匹配的文章。</p>}
      </div>
    </div>
  </div>;
}
