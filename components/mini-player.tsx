"use client";

import Link from "next/link";
import { Pause, Play, SkipForward } from "lucide-react";
import { useMusic } from "./music-context";

export default function MiniPlayer() {
  const { tracks, currentIndex, playing, currentTime, duration, play, pause, next } = useMusic();
  const track = tracks[currentIndex];
  return <div className="glass fixed bottom-4 left-4 z-30 flex max-w-[calc(100vw-7rem)] items-center gap-3 rounded-lg px-3 py-2 shadow-lg">
    <div className="hidden h-8 w-8 shrink-0 rounded-full border border-white/60 bg-[var(--accent-soft)] sm:block" style={{ backgroundImage: `url(${track.cover})`, backgroundSize: "cover" }} />
    <Link href="/music/" className="min-w-0"><p className="truncate text-xs font-semibold text-[var(--ink)]">{track.title}</p><p className="truncate text-[10px] text-[var(--muted)]">{track.artist} · {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}{duration ? ` / ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}` : ""}</p></Link>
    <button className="focus-ring rounded-full bg-[var(--accent)] p-2 text-white" onClick={playing ? pause : play} aria-label={playing ? "暂停音乐" : "播放音乐"} title={playing ? "暂停" : "播放"}>{playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
    <button className="focus-ring rounded-full p-2 text-[var(--muted)] hover:text-[var(--accent)]" onClick={next} aria-label="下一首" title="下一首"><SkipForward size={15} /></button>
  </div>;
}
