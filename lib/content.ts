import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import type { Plugin } from "unified";
import type { Root } from "hast";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

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

export type Heading = {
  depth: 2 | 3;
  id: string;
  text: string;
};

export type RenderedMarkdown = {
  html: string;
  headings: Heading[];
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

function headingText(node: Root["children"][number]): string {
  if (node.type === "text") return node.value;
  if ("children" in node && Array.isArray(node.children)) return node.children.map(headingText).join("");
  return "";
}

/**
 * Collects h2/h3 headings after rehype-slug has assigned ids, so the table of
 * contents links to exactly the same anchors as the rendered article body.
 */
const collectHeadings: Plugin<[Heading[]], Root> = (target) => (tree) => {
  const visit = (node: Root["children"][number]) => {
    if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
      const id = typeof node.properties?.id === "string" ? node.properties.id : "";
      const text = headingText(node).replace(/\s+/g, " ").trim();
      if (id && text) target.push({ depth: node.tagName === "h2" ? 2 : 3, id, text });
    }
    if ("children" in node && Array.isArray(node.children)) node.children.forEach(visit);
  };
  tree.children.forEach(visit);
};

export async function renderMarkdown(source: string): Promise<RenderedMarkdown> {
  const headings: Heading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: false })
    .use(collectHeadings, headings)
    .use(rehypeStringify)
    .process(source);
  return { html: String(file), headings };
}

export function getAllTags(posts = getPosts()): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}
