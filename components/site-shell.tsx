"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import Companion from "./companion";
import MiniPlayer from "./mini-player";
import BackgroundStage from "./background-stage";
import ClickFeedback from "./click-feedback";
import { MusicProvider } from "./music-context";
import { siteConfig } from "../content/site";
import type { Post } from "../lib/content";
import SiteSearch from "./site-search";
import UtilityRail from "./utility-rail";

const links = [
  ["首页", "/"],
  ["文章", "/posts/"],
  ["归档", "/archive/"],
  ["项目", "/projects/"],
  ["关于", "/about/"],
  ["音乐", "/music/"],
  ["照片墙", "/gallery/"]
] as const;

export default function SiteShell({ children, posts }: { children: React.ReactNode; posts: Post[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return <MusicProvider>
    <ClickFeedback>
      <div className="site-bg min-h-screen">
        <BackgroundStage />
        <div className="site-content">
        <header className={`site-header ${pathname === "/" ? "site-header--home" : ""} ${scrolled ? "site-header--scrolled" : ""}`}>
          <div className="site-header__inner">
            <Link href="/" className="site-brand focus-ring" aria-label="返回首页">
              <span className="site-brand__mark" aria-hidden="true">Q</span>
              <span>{siteConfig.title}</span>
            </Link>
            <nav className="site-nav hidden md:flex" aria-label="主导航">
              {links.map(([label, href]) => <Link
                className={`site-nav__link focus-ring ${isActive(href) ? "site-nav__link--active" : ""}`}
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
              >{label}</Link>)}
            </nav>
            <div className="site-header__actions">
              <button className="header-icon-button focus-ring" onClick={() => setSearchOpen(true)} aria-label="搜索文章" title="搜索文章"><Search size={18} /></button>
              <span className="site-header__theme"><ThemeToggle /></span>
              <button
                className="header-icon-button focus-ring md:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "关闭导航" : "打开导航"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
            </div>
          </div>
        </header>
        {menuOpen && <div className="mobile-nav-drawer md:hidden" role="dialog" aria-modal="true" aria-label="移动端主导航" onClick={() => setMenuOpen(false)}>
          <nav id="mobile-navigation" className="mobile-nav" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-nav__title"><span>导航</span><span className="mobile-nav__actions"><ThemeToggle /><button className="icon-button focus-ring" onClick={() => setMenuOpen(false)} aria-label="关闭导航" title="关闭导航"><X size={18} /></button></span></div>
            {links.map(([label, href]) => <Link
              onClick={() => setMenuOpen(false)}
              className={`mobile-nav__link focus-ring ${isActive(href) ? "mobile-nav__link--active" : ""}`}
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <span>{label}</span><ArrowUpRight size={15} aria-hidden="true" />
            </Link>)}
          </nav>
        </div>}
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer__row">
            <span>{siteConfig.footer}</span>
            <span>© {new Date().getFullYear()} {siteConfig.author}</span>
          </div>
        </footer>
        <MiniPlayer />
        <Companion />
        <UtilityRail onOpenSearch={() => setSearchOpen(true)} />
        <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} posts={posts} />
        </div>
      </div>
    </ClickFeedback>
  </MusicProvider>;
}
