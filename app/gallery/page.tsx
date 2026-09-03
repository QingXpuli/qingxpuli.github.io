import GalleryLightbox from "../../components/gallery-lightbox";
import { albums } from "../../content/gallery";

export default function GalleryPage() { return <div className="page-wrap page-intro pb-20"><p className="eyebrow">Gallery</p><h1>照片墙</h1><p>按相册收集日常里值得回看的小场景。</p><div className="mt-12 space-y-14">{albums.map((album) => <section key={album.slug}><div className="flex items-end justify-between border-b border-[var(--line)] pb-3"><div><h2 className="text-2xl font-semibold">{album.title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{album.description}</p></div><span className="text-xs text-[var(--muted)]">{album.photos.length} 张</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><GalleryLightbox photos={album.photos} /></div></section>)}</div></div>; }
