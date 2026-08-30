import MusicPage from "../../components/music-page";

export default function MusicRoute() { return <div className="mx-auto max-w-6xl px-5 pb-20 pt-16"><p className="text-xs uppercase tracking-[.2em] text-[var(--coral)]">Soundtrack</p><h1 className="mt-2 text-4xl font-semibold">音乐</h1><p className="mt-3 text-sm text-[var(--muted)]">歌曲与歌词来自可替换的本地内容，网易云主页仅作为来源链接。</p><div className="mt-10"><MusicPage /></div></div>; }
