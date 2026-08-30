import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "../components/site-shell";

export const metadata: Metadata = { title: "QingXpuli Blog", description: "QingXpuli 的个人主页、博客、音乐与照片墙。" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} /></head><body><SiteShell>{children}</SiteShell></body></html>;
}
