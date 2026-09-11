import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getPosts, renderMarkdown } from "../../lib/content";
import { siteConfig } from "../../content/site";

export const metadata: Metadata = {
  title: "关于",
  description: `${siteConfig.displayName} 的个人介绍：正在学习的技术、做过的项目与记录下来的日常。`,
  alternates: { canonical: "/about/" }
};

export default async function AboutPage() { const source = fs.readFileSync(path.join(process.cwd(), "content", "about.md"), "utf8").replace(/^---[\s\S]*?---/, ""); const { html } = await renderMarkdown(source); const posts = getPosts(); return <div className="page-wrap page-intro max-w-4xl pb-20"><div className="glass home-card overflow-hidden"><img className="h-52 w-full object-cover md:h-64" src="/media/about-cover.svg" alt="" /><div className="p-6 md:p-10"><img className="-mt-16 h-24 w-24 rounded-full border-4 border-[var(--paper)] object-cover" src={siteConfig.avatar} alt={`${siteConfig.author} 头像`} /><h1 className="mt-5 text-4xl font-semibold">关于我</h1><p className="mt-2 text-sm text-[var(--accent)]">{siteConfig.bio}</p><div className="prose mt-8" dangerouslySetInnerHTML={{ __html: html }} /><div className="mt-10 border-t border-[var(--line)] pt-6"><h2 className="text-lg font-semibold">最近留下的痕迹</h2><div className="mt-4 grid grid-cols-12 gap-1">{Array.from({ length: 48 }, (_, i) => <span className={`aspect-square rounded-sm ${i % 9 === 0 ? "bg-[var(--coral)]" : i % 4 === 0 ? "bg-[var(--accent)]" : "bg-[var(--accent-soft)]"}`} key={i} title={`${posts.length} 篇文章`} />)}</div><Link className="focus-ring mt-5 inline-block text-xs text-[var(--accent)]" href="/archive/">查看完整归档 →</Link></div></div></div></div>; }
