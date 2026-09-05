import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10);
  return String(value ?? "1970-01-01");
}

function readPost(filename: string): Post {
  const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: filename.replace(/\.md$/, ""),
    title: String(data.title ?? filename.replace(/\.md$/, "")),
    date: normalizeDate(data.date),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    draft: data.draft === true,
    content
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((name) => name.endsWith(".md")).map(readPost)
    .filter((post) => !post.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export async function renderMarkdown(source: string): Promise<string> {
  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkHtml).process(source);
  return String(file);
}

export function getAllTags(posts = getPosts()): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}
