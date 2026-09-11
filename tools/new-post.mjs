import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Create a new post with the front matter this site expects.
 *
 * Usage:
 *   npm run new:post -- --title "文章的标题" --tags "随笔,记录"
 *   npm run new:post -- --title "My Post" --slug my-post --summary "摘要" --draft
 *   npm run new:post -- --title "带封面" --cover /media/gallery-1.svg
 *
 * A slug is derived from the title when the title is ASCII. For Chinese titles
 * pass --slug explicitly, otherwise a date based placeholder slug is used so the
 * URL stays readable and stable.
 */

const postsDirectory = path.join(process.cwd(), "content", "posts");

function parseArgs(argv) {
  const args = { tags: [], draft: false };
  for (let i = 0; i < argv.length; i++) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    if (key === "draft") {
      args.draft = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`--${key} 需要一个值`);
    args[key] = value;
    i++;
  }
  return args;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function today() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

async function existingSlugs() {
  try {
    const names = await readdir(postsDirectory);
    return names.filter((name) => name.endsWith(".md")).map((name) => name.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.title) throw new Error('缺少 --title，例如：npm run new:post -- --title "标题" --tags "随笔"');

  const taken = new Set(await existingSlugs());
  const asciiTitle = /^[\x20-\x7e]+$/.test(args.title);
  let hint = "";
  let slug;
  if (args.slug) {
    slug = slugify(args.slug);
    if (!slug) throw new Error("--slug 只能包含字母、数字与连字符");
  } else {
    // A Chinese title that happens to contain an ASCII word ("…让 slug…") would
    // otherwise produce a misleading slug, so only pure ASCII titles are derived.
    slug = asciiTitle ? slugify(args.title) : "";
  }
  if (!slug) {
    const base = `post-${today().replaceAll("-", "")}`;
    slug = base;
    let suffix = 2;
    while (taken.has(slug)) slug = `${base}-${suffix++}`;
    hint = "标题不是纯 ASCII，已使用日期占位 slug；建议加 --slug 指定一个更易读的地址。";
  }
  if (taken.has(slug)) throw new Error(`文章已存在：content/posts/${slug}.md`);

  const tags = Array.isArray(args.tags) ? args.tags : String(args.tags ?? "").split(",");
  const cleanTags = tags.map((tag) => tag.trim()).filter(Boolean);
  if (!cleanTags.length) cleanTags.push("随笔");

  const summary = args.summary?.trim() || "在这里写一句摘要，它会出现在列表、搜索结果与社交分享卡片里。";
  const lines = [
    "---",
    `title: ${args.title}`,
    `date: ${args.date || today()}`,
    `summary: ${summary}`,
    `tags: [${cleanTags.join(", ")}]`
  ];
  if (args.cover) lines.push(`cover: ${args.cover}`);
  if (args.draft) lines.push("draft: true");
  lines.push("---", "", "正文从这里开始。", "");

  const target = path.join(postsDirectory, `${slug}.md`);
  await writeFile(target, lines.join("\n"), "utf8");

  console.log(`已创建：content/posts/${slug}.md`);
  if (hint) console.log(hint);
  console.log(`本地预览：http://localhost:3000/posts/${encodeURIComponent(slug)}/`);
  console.log(`线上地址：https://qingxpuli.github.io/posts/${encodeURIComponent(slug)}/`);
  if (args.draft) console.log("这是草稿（draft: true），不会进入站点、sitemap 与 RSS；发布前删掉该行。");
  console.log("提示：正文里用 ## 标题即可自动获得锚点；标题达到 3 个时会自动生成目录。");
}

try {
  await main();
} catch (error) {
  console.error(`创建文章失败：${error.message}`);
  process.exitCode = 1;
}
