import type { Metadata } from "next";
import GalleryLightbox from "../../components/gallery-lightbox";
import { albums } from "../../content/gallery";

export const metadata: Metadata = {
  title: "照片墙",
  description: "按相册整理 QingXpuli 日常与收藏里值得回看的小场景。",
  alternates: { canonical: "/gallery/" }
};

export default function GalleryPage() { return <div className="page-wrap page-intro pb-20"><p className="eyebrow">Gallery</p><h1>照片墙</h1><p>按相册收集日常里值得回看的小场景。</p><p className="mt-3 text-xs text-[var(--muted)]">本页图片由站点所有者提供并公开发布，版权归原作者所有；如需下架请联系站点所有者。</p><div className="mt-12 space-y-14">{albums.map((album) => <section key={album.slug}><div className="flex items-end justify-between border-b border-[var(--line)] pb-3"><div><h2 className="text-2xl font-semibold">{album.title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{album.description}</p></div><span className="text-xs text-[var(--muted)]">{album.photos.length} 张</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><GalleryLightbox photos={album.photos} /></div></section>)}</div></div>; }
