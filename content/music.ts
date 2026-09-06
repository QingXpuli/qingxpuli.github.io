export type Track = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioSrc: string;
  lrcSrc: string;
  neteaseUrl: string;
  note: string;
};

// Official song-page links only; these entries are not local audio tracks.
export const musicLinks = [
  { id: "29777821", title: "This Will Be the Day (Acoustic)", artist: "Jeff Williams, Casey Lee Williams", url: "https://music.163.com/#/song?id=29777821" },
  { id: "672188", title: "You", artist: "雪野五月", url: "https://music.163.com/#/song?id=672188" },
  { id: "484365652", title: "Home (feat. Casey Lee Williams)", artist: "Jeff Williams, Casey Lee Williams", url: "https://music.163.com/#/song?id=484365652" }
] as const;

export const tracks: Track[] = [
  {
    id: "first-signal",
    title: "First Signal",
    artist: "QingXpuli Demo",
    cover: "/media/music-cover.svg",
    audioSrc: "/audio/demo.wav",
    lrcSrc: "/audio/demo.lrc",
    neteaseUrl: "https://music.163.com/",
    note: "示例音轨。替换为你有合法使用权的音频与 LRC。"
  }
];
