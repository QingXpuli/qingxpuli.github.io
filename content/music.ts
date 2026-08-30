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
