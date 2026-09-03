"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import Companion from "./companion";
import MiniPlayer from "./mini-player";
import BackgroundStage from "./background-stage";
import { MusicProvider } from "./music-context";
import { siteConfig } from "../content/site";

const links = [
  ["首页", "/"],
  ["文章", "/posts/"],
  ["归档", "/archive/"],
  ["项目", "/projects/"],
  ["关于", "/about/"],
  ["音乐", "/music/"],
  ["照片墙", "/gallery/"]
] as const;

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return <MusicProvider>
    <div className="site-bg min-h-screen">
      <BackgroundStage />
      <div className="site-content">
        <header className="site-header">
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
              <ThemeToggle />
              <button
                className="header-icon-button focus-ring md:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "关闭导航" : "打开导航"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
            </div>
          </div>
          {menuOpen && <nav id="mobile-navigation" className="mobile-nav md:hidden" aria-label="移动端主导航">
            {links.map(([label, href]) => <Link
              onClick={() => setMenuOpen(false)}
              className={`mobile-nav__link focus-ring ${isActive(href) ? "mobile-nav__link--active" : ""}`}
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <span>{label}</span><ArrowUpRight size={15} aria-hidden="true" />
            </Link>)}
          </nav>}
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer__row">
            <span>{siteConfig.footer}</span>
            <span>© {new Date().getFullYear()} {siteConfig.author}</span>
          </div>
        </footer>
        <MiniPlayer />
        <Companion />
      </div>
    </div>
  </MusicProvider>;
}
