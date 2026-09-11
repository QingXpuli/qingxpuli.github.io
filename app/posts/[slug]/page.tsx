import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, renderMarkdown } from "../../../lib/content";
import GiscusComments from "../../../components/giscus-comments";

export function generateStaticParams() { return getPosts().map((post) => ({ slug: post.slug })); }

const OG_RASTER = /\.(jpe?g|png|webp|avif)$/i;
const DEFAULT_OG_IMAGE = "/media/og-default.png";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章不存在", robots: { index: false, follow: false } };
  const image = post.cover && OG_RASTER.test(post.cover) ? post.cover : DEFAULT_OG_IMAGE;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/posts/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/posts/${post.slug}/`,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: image, alt: post.title }]
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, images: [image] }
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { html, headings } = await renderMarkdown(post.content);
  return <article className="page-wrap page-intro max-w-3xl pb-20">
    <Link className="focus-ring text-xs text-[var(--accent)]" href="/posts/">← 返回文章</Link>
    <header className="mt-8 border-b border-[var(--line)] pb-8">
      <p className="text-xs text-[var(--muted)]">{post.date} · {post.tags.join(" · ")}</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-base leading-8 text-[var(--muted)]">{post.summary}</p>
      {post.cover && <img className="mt-7 aspect-[16/7] w-full rounded-lg object-cover" src={post.cover} alt="" />}
    </header>
    {headings.length >= 3 && <nav className="post-toc" aria-labelledby="post-toc-title">
      <p className="eyebrow" id="post-toc-title">On this page</p>
      <ol className="mt-3 space-y-1.5">
        {headings.map((heading) => <li className={heading.depth === 3 ? "pl-4" : ""} key={heading.id}>
          <a className="focus-ring rounded text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline" href={`#${heading.id}`}>{heading.text}</a>
        </li>)}
      </ol>
    </nav>}
    <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    <section className="mt-12 border-t border-[var(--line)] pt-8">
      <div className="mb-4"><p className="eyebrow">Comments</p><h2 className="mt-2 text-xl font-semibold">留下回应</h2></div>
      <GiscusComments />
    </section>
  </article>;
}
