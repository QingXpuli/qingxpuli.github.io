"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Post } from "../lib/content";

export default function PostBrowser({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const filtered = useMemo(() => posts.filter((post) => { const text = `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase(); return (!query || text.includes(query.toLowerCase())) && (tag === "全部" || post.tags.includes(tag)); }), [posts, query, tag]);
  return <><div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 sm:flex-row"><label className="glass flex flex-1 items-center gap-2 rounded-full px-4"><Search size={16} className="text-[var(--muted)]" /><input className="w-full bg-transparent py-2 text-sm outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索标题、标签或摘要" /></label><div className="flex flex-wrap gap-2">{["全部", ...tags].map((item) => <button key={item} onClick={() => setTag(item)} className={`focus-ring rounded-full px-3 py-2 text-xs ${tag === item ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}>{item}</button>)}</div></div><div className="mt-6 grid gap-4">{filtered.length ? filtered.map((post) => <article className="glass rounded-lg p-5 transition hover:-translate-y-0.5" key={post.slug}><div className="flex items-center justify-between gap-4 text-[11px] text-[var(--muted)]"><time dateTime={post.date}>{post.date}</time><span>{post.tags.join(" · ")}</span></div><h2 className="mt-3 text-lg font-semibold"><Link className="focus-ring hover:text-[var(--accent)]" href={`/posts/${post.slug}/`}>{post.title}</Link></h2><p className="mt-2 text-sm leading-7 text-[var(--muted)]">{post.summary}</p></article>) : <div className="glass rounded-lg p-10 text-center text-sm text-[var(--muted)]">没有匹配的文章。</div>}</div></>;
}
