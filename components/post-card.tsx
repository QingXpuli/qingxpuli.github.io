import Link from "next/link";
import type { Post } from "../lib/content";

export default function PostCard({ post }: { post: Post }) {
  return <article className="glass rounded-lg p-5 transition hover:-translate-y-0.5"><div className="flex items-center justify-between gap-4 text-[11px] text-[var(--muted)]"><time dateTime={post.date}>{post.date}</time><span>{post.tags.join(" · ")}</span></div><h2 className="mt-3 text-lg font-semibold text-[var(--ink)]"><Link className="focus-ring hover:text-[var(--accent)]" href={`/posts/${post.slug}/`}>{post.title}</Link></h2><p className="mt-2 text-sm leading-7 text-[var(--muted)]">{post.summary}</p><Link className="focus-ring mt-4 inline-block text-xs font-semibold text-[var(--accent)]" href={`/posts/${post.slug}/`}>阅读文章 →</Link></article>;
}
