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
  }
];
