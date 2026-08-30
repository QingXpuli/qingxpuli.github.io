import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, renderMarkdown } from "../../../lib/content";

export function generateStaticParams() { return getPosts().map((post) => ({ slug: post.slug })); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const html = await renderMarkdown(post.content);
  return <article className="mx-auto max-w-3xl px-5 pb-20 pt-16"><Link className="focus-ring text-xs text-[var(--accent)]" href="/posts/">← 返回文章</Link><header className="mt-8 border-b border-[var(--line)] pb-8"><p className="text-xs text-[var(--muted)]">{post.date} · {post.tags.join(" · ")}</p><h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1><p className="mt-4 text-base leading-8 text-[var(--muted)]">{post.summary}</p>{post.cover && <img className="mt-7 aspect-[16/7] w-full rounded-lg object-cover" src={post.cover} alt="" />}</header><div className="prose mt-10" dangerouslySetInnerHTML={{ __html: html }} /><div className="mt-12 rounded-lg border border-[var(--line)] p-5"><p className="text-xs uppercase tracking-[.18em] text-[var(--accent)]">Comments</p><p className="mt-2 text-sm text-[var(--muted)]">Giscus 评论区将在 GitHub Discussions 配置完成后启用。</p></div></article>;
}
