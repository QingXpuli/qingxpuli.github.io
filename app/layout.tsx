import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteShell from "../components/site-shell";
import { siteConfig } from "../content/site";
import { getPosts } from "../lib/content";

export const siteUrl = "https://qingxpuli.github.io";
const siteDescription = "QingXpuli 的个人主页、博客、音乐与照片墙。";
const defaultOgImage = "/media/og-default.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
  description: siteDescription,
  applicationName: siteConfig.title,
  authors: [{ name: siteConfig.author, url: siteConfig.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.title,
    locale: "zh_CN",
    url: siteUrl,
    title: siteConfig.title,
    description: siteDescription,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteConfig.title }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteDescription,
    images: [defaultOgImage]
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8eeea" },
    { media: "(prefers-color-scheme: dark)", color: "#10211f" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} /></head><body><SiteShell posts={getPosts()}>{children}</SiteShell></body></html>;
}
