import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../../content/projects";

export const metadata: Metadata = {
  title: "项目",
  description: "QingXpuli 正在做、做过或值得再次打开的项目。",
  alternates: { canonical: "/projects/" }
};

export default function ProjectsPage() { return <div className="page-wrap page-intro pb-20"><p className="eyebrow">Selected work</p><h1>项目</h1><p>手工挑选一些正在做、做过或值得再次打开的项目。</p><div className="mt-10 grid gap-5 md:grid-cols-2">{projects.map((project) => <article className="glass home-card overflow-hidden" key={project.title}><img className="aspect-[16/9] w-full object-cover" src={project.cover} alt="" /><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold">{project.title}</h2><a className="focus-ring rounded-full p-1 text-[var(--accent)]" href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`打开 ${project.title} 仓库`} title="打开仓库"><ArrowUpRight size={18} /></a></div><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{project.summary}</p><div className="mt-4 flex flex-wrap gap-2">{project.stack.map((item) => <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] text-[var(--accent)]" key={item}>{item}</span>)}</div></div></article>)}</div></div>; }
