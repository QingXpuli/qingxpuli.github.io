import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

/**
 * Build-time generator for /sitemap.xml, /feed.xml and /robots.txt.
 *
 * These files are written straight into `out/` after `next build` instead of
 * being produced by app/sitemap.ts or a route handler: with `output: "export"`
 * the metadata-route / route-handler behaviour depends on framework internals,
 * while a post-build script is deterministic, unit-testable and matches the
 * existing `tools/*.mjs` pattern of this repository.
 */

// Keep in sync with `siteConfig.blog` in content/site.ts and `siteUrl` in app/layout.tsx.
export const SITE_URL = "https://qingxpuli.github.io";
export const SITE_TITLE = "QingXpuli 的小窝";
export const SITE_DESCRIPTION = "QingXpuli 的个人主页、博客、音乐与照片墙。";
export const STATIC_ROUTES = ["/", "/posts/", "/archive/", "/projects/", "/about/", "/music/", "/gallery/"];

export function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function absoluteUrl(route) {
  return new URL(route, SITE_URL).toString();
}

export function postPath(slug) {
  return `/posts/${slug}/`;
}

export function toRfc822(date) {
  return new Date(`${date}T00:00:00+08:00`).toUTCString();
}

/** @param {{ path: string, lastmod?: string }[]} entries */
export function buildSitemap(entries) {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      return `  <url><loc>${escapeXml(absoluteUrl(entry.path))}</loc>${lastmod}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/** @param {{ slug: string, title: string, date: string, summary: string }[]} posts */
export function buildFeed(posts) {
  const lastBuildDate = posts.length ? toRfc822(posts[0].date) : new Date(0).toUTCString();
  const items = posts
    .map((post) => {
      const link = absoluteUrl(postPath(post.slug));
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${escapeXml(toRfc822(post.date))}</pubDate>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        "    </item>"
      ].join("\n");
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE_TITLE)}</title>`,
    `    <link>${escapeXml(absoluteUrl("/"))}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>zh-CN</language>",
    `    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");
}

export function buildRobots() {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${absoluteUrl("/sitemap.xml")}`, ""].join("\n");
}

export async function readPosts(postsDirectory) {
  let names = [];
  try {
    names = await readdir(postsDirectory);
  } catch {
    return [];
  }
  const posts = [];
  for (const name of names.filter((entry) => entry.endsWith(".md"))) {
    const { data, content } = matter(await readFile(path.join(postsDirectory, name), "utf8"));
    if (data.draft === true) continue;
    const raw = data.date;
    const date = raw instanceof Date && !Number.isNaN(raw.valueOf())
      ? raw.toISOString().slice(0, 10)
      : String(raw ?? "1970-01-01");
    posts.push({
      slug: name.replace(/\.md$/, ""),
      title: String(data.title ?? name.replace(/\.md$/, "")),
      date,
      summary: String(data.summary ?? ""),
      bodyLength: content.trim().length
    });
  }
  return posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

async function main() {
  const outputDir = path.join(process.cwd(), "out");
  try {
    await access(outputDir);
  } catch {
    console.error(`Static output directory not found: ${outputDir}. Run this after \`next build\`.`);
    process.exitCode = 1;
    return;
  }

  const posts = await readPosts(path.join(process.cwd(), "content", "posts"));
  const sitemap = buildSitemap([
    ...STATIC_ROUTES.map((route) => ({ path: route })),
    ...posts.map((post) => ({ path: postPath(post.slug), lastmod: post.date }))
  ]);
  const feed = buildFeed(posts);
  const robots = buildRobots();

  await writeFile(path.join(outputDir, "sitemap.xml"), sitemap, "utf8");
  await writeFile(path.join(outputDir, "feed.xml"), feed, "utf8");
  await writeFile(path.join(outputDir, "robots.txt"), robots, "utf8");
  console.log(`Static metadata generated: sitemap.xml (${STATIC_ROUTES.length + posts.length} urls), feed.xml (${posts.length} items), robots.txt.`);
}

const invokedDirectly = process.argv[1] ? path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url)) : false;
if (invokedDirectly) {
  await main();
}
