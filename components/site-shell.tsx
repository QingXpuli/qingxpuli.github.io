"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";
import Companion from "./companion";
import MiniPlayer from "./mini-player";
import { MusicProvider } from "./music-context";
import { siteConfig } from "../content/site";

const links = [["首页", "/"], ["文章", "/posts/"], ["归档", "/archive/"], ["项目", "/projects/"], ["关于", "/about/"], ["音乐", "/music/"], ["照片墙", "/gallery/"]];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <MusicProvider><div className="site-bg min-h-screen"><header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--paper)]/80 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Link href="/" className="focus-ring text-sm font-semibold tracking-[.12em] text-[var(--ink)]">{siteConfig.title}</Link><nav className="hidden items-center gap-6 text-xs text-[var(--muted)] md:flex">{links.map(([label, href]) => <Link className="focus-ring transition hover:text-[var(--accent)]" key={href} href={href}>{label}</Link>)}<ThemeToggle /></nav><div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button className="focus-ring rounded-full border border-[var(--line)] p-2 text-[var(--muted)]" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "关闭导航" : "打开导航"}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button></div></div>{menuOpen && <nav className="border-t border-[var(--line)] px-5 py-3 md:hidden">{links.map(([label, href]) => <Link onClick={() => setMenuOpen(false)} className="focus-ring block border-b border-[var(--line)] py-3 text-sm text-[var(--muted)]" key={href} href={href}>{label}</Link>)}</nav>}</header><main>{children}</main><footer className="mx-auto max-w-6xl px-5 pb-24 pt-16 text-xs text-[var(--muted)]"><div className="border-t border-[var(--line)] pt-5">{siteConfig.footer}<span className="float-right">© {new Date().getFullYear()} {siteConfig.author}</span></div></footer><MiniPlayer /><Companion /></div></MusicProvider>;
}
