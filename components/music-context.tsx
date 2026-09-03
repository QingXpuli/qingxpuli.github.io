"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { tracks } from "../content/music";
import { activeLyricIndex, LyricLine, parseLrc } from "../lib/lrc";

type MusicContextValue = {
  tracks: typeof tracks; currentIndex: number; currentTime: number; duration: number; progress: number; playing: boolean; lyrics: LyricLine[]; lyricIndex: number; audioStatus: "idle" | "loading" | "ready" | "error";
  play: () => void; pause: () => void; next: () => void; previous: () => void; select: (index: number) => void; seek: (value: number) => void;
};
const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [audioStatus, setAudioStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const current = tracks[currentIndex];
  useEffect(() => { const saved = sessionStorage.getItem("music-index"); if (saved) { const parsed = Number(saved); if (Number.isFinite(parsed)) setCurrentIndex(Math.min(Math.max(parsed, 0), tracks.length - 1)); } }, []);
  useEffect(() => { sessionStorage.setItem("music-index", String(currentIndex)); setCurrentTime(0); setDuration(0); setAudioStatus("loading"); fetch(current.lrcSrc).then((res) => { if (!res.ok) throw new Error("歌词加载失败"); return res.text(); }).then((text) => setLyrics(parseLrc(text))).catch(() => setLyrics([])); }, [currentIndex, current.lrcSrc]);
  useEffect(() => { if (!audioRef.current) return; if (playing) audioRef.current.play().catch(() => setPlaying(false)); else audioRef.current.pause(); }, [playing, currentIndex]);
  const value = useMemo(() => ({ tracks, currentIndex, currentTime, duration, progress: duration ? currentTime / duration * 100 : 0, playing, lyrics, lyricIndex: activeLyricIndex(lyrics, currentTime), audioStatus, play: () => setPlaying(true), pause: () => setPlaying(false), next: () => setCurrentIndex((i) => (i + 1) % tracks.length), previous: () => setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length), select: (i: number) => { setCurrentIndex(i); setPlaying(true); }, seek: (value: number) => { if (audioRef.current) audioRef.current.currentTime = value; setCurrentTime(value); } }), [currentIndex, currentTime, duration, playing, lyrics, audioStatus]);
  return <MusicContext.Provider value={value}><audio ref={audioRef} src={current.audioSrc} onLoadStart={() => setAudioStatus("loading")} onTimeUpdate={(event) => { setCurrentTime(event.currentTarget.currentTime); setDuration(event.currentTarget.duration || 0); }} onLoadedMetadata={(event) => { setDuration(event.currentTarget.duration || 0); setAudioStatus("ready"); }} onError={() => { setAudioStatus("error"); setPlaying(false); }} onEnded={() => value.next()} preload="metadata" />{children}</MusicContext.Provider>;
}
export function useMusic() { const value = useContext(MusicContext); if (!value) throw new Error("useMusic must be used inside MusicProvider"); return value; }
