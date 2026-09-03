import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, renderMarkdown } from "../../../lib/content";
import GiscusComments from "../../../components/giscus-comments";

export function generateStaticParams() { return getPosts().map((post) => ({ slug: post.slug })); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const html = await renderMarkdown(post.content);
  return <article className="page-wrap page-intro max-w-3xl pb-20"><Link className="focus-ring text-xs text-[var(--accent)]" href="/posts/">← 返回文章</Link><header className="mt-8 border-b border-[var(--line)] pb-8"><p className="text-xs text-[var(--muted)]">{post.date} · {post.tags.join(" · ")}</p><h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1><p className="mt-4 text-base leading-8 text-[var(--muted)]">{post.summary}</p>{post.cover && <img className="mt-7 aspect-[16/7] w-full rounded-[1.25rem] object-cover" src={post.cover} alt="" />}</header><div className="prose mt-10" dangerouslySetInnerHTML={{ __html: html }} /><section className="mt-12 border-t border-[var(--line)] pt-8"><div className="mb-4"><p className="eyebrow">Comments</p><h2 className="mt-2 text-xl font-semibold">留下回应</h2></div><GiscusComments /></section></article>;
}
