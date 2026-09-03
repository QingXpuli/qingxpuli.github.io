"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post } from "../lib/content";

export default function FeaturedPost({ posts }: { posts: Post[] }) {
  const featured = posts.slice(0, 3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (featured.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % featured.length), 6500);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  if (!featured.length) return <div className="glass home-card p-6 text-sm text-[var(--muted)]">还没有公开文章，稍后再回来看看。</div>;
  const post = featured[index];
  return <article className="glass home-card feature-card" aria-live="polite">
    <img className="feature-card__cover" src={post.cover ?? "/media/post-cover.svg"} alt="" />
    <div className="feature-card__body">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">精选记录</span>
        <time className="text-[.68rem] text-[var(--muted)]" dateTime={post.date}>{post.date}</time>
      </div>
      <h3 className="mt-3">{post.title}</h3>
      <p>{post.summary}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link className="section-link focus-ring inline-flex items-center gap-1" href={`/posts/${post.slug}/`}>阅读文章 <ArrowUpRight size={14} /></Link>
        {featured.length > 1 && <div className="flex items-center gap-1" aria-label="精选文章切换">
          <button className="header-icon-button focus-ring" onClick={() => setIndex((current) => (current - 1 + featured.length) % featured.length)} aria-label="上一篇精选文章" title="上一篇">
            <ChevronLeft size={16} />
          </button>
          <span className="px-1 text-[.68rem] text-[var(--muted)]">{index + 1}/{featured.length}</span>
          <button className="header-icon-button focus-ring" onClick={() => setIndex((current) => (current + 1) % featured.length)} aria-label="下一篇精选文章" title="下一篇">
            <ChevronRight size={16} />
          </button>
        </div>}
      </div>
    </div>
  </article>;
}
