export type Project = {
  title: string;
  summary: string;
  stack: string[];
  repoUrl: string;
  demoUrl?: string;
  cover: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "New for Codex",
    summary: "用于整理实验、学习记录与个人工具的工作区。",
    stack: ["JavaScript", "工具链"],
    repoUrl: "https://github.com/QingXpuli/new-for-codex",
    cover: "/media/project-codex.svg",
    featured: true
  },
  {
    title: "Limbus Lyric Simulator",
    summary: "参考桌面歌词演出的视觉灵感，探索歌词、节奏和界面动效。",
    stack: ["Python", "PyQt", "音频交互"],
    repoUrl: "https://github.com/YouRanCoder/LimbusLyricSimulator",
    cover: "/media/project-lyric.svg",
    featured: true
  }
];
