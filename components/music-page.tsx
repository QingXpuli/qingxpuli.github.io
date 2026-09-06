"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMusic } from "./music-context";
import { musicLinks } from "../content/music";

export default function MusicPage() {
  const { tracks, currentIndex, currentTime, duration, progress, playing, lyrics, lyricIndex, audioStatus, play, pause, next, previous, select, seek } = useMusic();
  const current = tracks[currentIndex];
  const lyricViewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = lyricViewport.current?.querySelector<HTMLElement>(`[data-lyric-index="${lyricIndex}"]`);
    active?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [lyricIndex]);

  return <div className="grid gap-5 lg:grid-cols-[minmax(280px,380px)_1fr]">
    <section className="glass home-card p-5 md:p-6">
      <div className="mx-auto aspect-square max-w-[280px] overflow-hidden rounded-lg border border-white/60 shadow-xl">
        <img className={`h-full w-full object-cover ${playing ? "animate-[spin_24s_linear_infinite]" : ""}`} src={current.cover} alt={`${current.title} 封面`} />
      </div>
      <p className="mt-6 text-center eyebrow" style={{ color: "var(--coral)" }}>Now playing</p>
      <h1 className="mt-2 text-center text-2xl font-semibold">{current.title}</h1>
      <p className="mt-1 text-center text-sm text-[var(--muted)]">{current.artist}</p>
      <input className="mt-7 w-full accent-[var(--accent)]" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 1)} onChange={(event) => seek(Number(event.target.value))} aria-label="播放进度" aria-valuenow={Math.round(progress)} />
      <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]"><span>{format(currentTime)}</span><span>{format(duration)}</span></div>
      <div className="mt-5 flex items-center justify-center gap-5">
        <button className="focus-ring rounded-full p-2 text-[var(--muted)] hover:text-[var(--accent)]" onClick={previous} aria-label="上一首" title="上一首"><SkipBack size={18} /></button>
        <button className="focus-ring rounded-full bg-[var(--accent)] p-4 text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={playing ? pause : play} disabled={audioStatus === "error"} aria-label={playing ? "暂停" : "播放"} title={playing ? "暂停" : "播放"}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
        <button className="focus-ring rounded-full p-2 text-[var(--muted)] hover:text-[var(--accent)]" onClick={next} aria-label="下一首" title="下一首"><SkipForward size={18} /></button>
      </div>
      <p className="mt-5 text-center text-[11px] text-[var(--muted)]" role="status">{statusText(audioStatus, playing)}{current.note ? ` · ${current.note}` : ""}</p>
      <a className="focus-ring mx-auto mt-3 block w-fit text-xs text-[var(--accent)] underline underline-offset-4" href={current.neteaseUrl} target="_blank" rel="noreferrer">查看来源链接</a>
    </section>

    <section className="glass home-card p-4 md:p-5">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4"><div><p className="eyebrow">Lyrics</p><h2 className="mt-1 text-lg font-semibold">同步歌词</h2></div><span className="text-xs text-[var(--muted)]">{tracks.length} 首示例</span></div>
      <div ref={lyricViewport} className="mt-2 max-h-[520px] overflow-x-hidden overflow-y-auto py-16 text-center" aria-label="同步歌词">
        {lyrics.length ? lyrics.map((line, index) => <button data-lyric-index={index} key={`${line.time}-${index}`} onClick={() => seek(line.time)} className={`focus-ring block w-full break-words px-3 py-2 text-sm transition ${index === lyricIndex ? "scale-[1.03] font-semibold text-[var(--accent)]" : "text-[var(--muted)] opacity-60 hover:opacity-100"}`} aria-current={index === lyricIndex ? "true" : undefined}>{line.text}</button>) : <p className="text-sm text-[var(--muted)]">这首歌还没有 LRC，添加文件后会自动显示。</p>}
      </div>
      <div className="mt-4 border-t border-[var(--line)] pt-4"><p className="mb-2 text-xs text-[var(--muted)]">歌单</p>{tracks.map((track, index) => <button className={`focus-ring flex w-full items-center justify-between gap-3 border-b border-[var(--line)] py-3 text-left text-sm ${index === currentIndex ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} key={track.id} onClick={() => select(index)}><span className="truncate">{track.title}</span><span className="shrink-0 text-xs">{track.artist}</span></button>)}</div>
    </section>
    <section className="glass home-card p-5 md:p-6 lg:col-span-2" aria-labelledby="music-links-title">
      <p className="eyebrow">Music bookmarks</p>
      <h2 id="music-links-title" className="mt-1 text-lg font-semibold">网易云收藏</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">使用网易云官方外链播放器；本站不托管、不代理商业音频。</p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {musicLinks.map((song) => <li className="border-b border-[var(--line)] pb-4" key={song.id}>
          <strong className="block break-words text-[var(--accent)]">{song.title}</strong>
          <span className="mt-1 block text-sm text-[var(--muted)]">{song.artist}</span>
          <iframe className="mt-3 h-[86px] w-full border-0" title={`网易云官方播放器：${song.title}`} src={`https://music.163.com/outchain/player?type=2&id=${song.id}&auto=1&height=66`} loading="lazy" allow="autoplay" />
          <a className="focus-ring mt-2 inline-block text-xs text-[var(--accent)] underline underline-offset-4" href={song.url} target="_blank" rel="noopener noreferrer" aria-label={`${song.title}，在网易云打开（新窗口）`}>在网易云打开 ↗</a>
        </li>)}
      </ul>
    </section>
  </div>;
}

function statusText(status: "idle" | "loading" | "ready" | "error", playing: boolean) {
  if (status === "error") return "音频暂时无法加载，请检查本地音频文件。";
  if (status === "loading") return "正在准备音频…";
  return playing ? "正在播放" : "已暂停";
}

function format(seconds: number) { if (!seconds || Number.isNaN(seconds)) return "00:00"; return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`; }
