"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "../content/gallery";

export default function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (index === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") setIndex((current) => current === null ? null : (current + 1) % photos.length);
      if (event.key === "ArrowLeft") setIndex((current) => current === null ? null : (current - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, photos.length]);

  function close() {
    setIndex(null);
    window.setTimeout(() => trigger.current?.focus(), 0);
  }

  return <>
    {photos.map((photo, photoIndex) => <GalleryThumb
      key={`${photo.src}-${photoIndex}`}
      photo={photo}
      onOpen={(button) => { trigger.current = button; setIndex(photoIndex); }}
    />)}
    {index !== null && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0c1718]/90 p-4 sm:p-5" role="dialog" aria-modal="true" aria-label="照片预览" onClick={close}>
      <button ref={closeButton} className="focus-ring absolute right-4 top-4 rounded-full p-2 text-white" onClick={close} aria-label="关闭照片预览" title="关闭"><X /></button>
      <button className="focus-ring absolute left-2 rounded-full p-2 text-white sm:left-5" onClick={(event) => { event.stopPropagation(); setIndex((index - 1 + photos.length) % photos.length); }} aria-label="上一张" title="上一张"><ChevronLeft /></button>
      <figure className="max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
        <img className="max-h-[78vh] w-auto max-w-full rounded-[1.1rem] object-contain" src={photos[index].src} alt={photos[index].alt} onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <figcaption className="mt-3 text-center text-sm text-white/80">{photos[index].caption} · {photos[index].date}</figcaption>
      </figure>
      <button className="focus-ring absolute right-2 rounded-full p-2 text-white sm:right-5" onClick={(event) => { event.stopPropagation(); setIndex((index + 1) % photos.length); }} aria-label="下一张" title="下一张"><ChevronRight /></button>
    </div>}
  </>;
}

function GalleryThumb({ photo, onOpen }: { photo: GalleryPhoto; onOpen: (button: HTMLButtonElement) => void }) {
  const [failed, setFailed] = useState(false);
  return <button
    className="focus-ring group overflow-hidden rounded-[1.1rem] border border-[var(--line)] bg-[var(--panel)] text-left shadow-sm"
    onClick={(event) => onOpen(event.currentTarget)}
  >
    {failed ? <span className="grid aspect-[4/3] w-full place-items-center bg-[var(--accent-soft)] px-4 text-center text-xs text-[var(--muted)]">图片暂不可用</span> : <img className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" src={photo.src} alt={photo.alt} loading="lazy" onError={() => setFailed(true)} />}
    <span className="block p-3 text-xs text-[var(--muted)]">{photo.caption}</span>
  </button>;
}
