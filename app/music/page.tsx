import type { Metadata } from "next";
import MusicPage from "../../components/music-page";

export const metadata: Metadata = {
  title: "音乐",
  description: "QingXpuli 的音乐页面：网易云官方外链播放器，以及可同步歌词的本地演示音轨。",
  alternates: { canonical: "/music/" }
};

export default function MusicRoute() { return <div className="page-wrap page-intro pb-20"><p className="eyebrow" style={{ color: "var(--coral)" }}>Soundtrack</p><h1>音乐</h1><p>歌曲与歌词来自可替换的本地内容，来源链接仅用于说明与跳转。</p><div className="mt-10"><MusicPage /></div></div>; }
