import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  SITE_URL,
  STATIC_ROUTES,
  absoluteUrl,
  buildFeed,
  buildRobots,
  buildSitemap,
  escapeXml,
  postPath,
  readPosts,
  toRfc822
} from "./generate-static-meta.mjs";

const posts = [
  { slug: "newer", title: "较新 & 特殊", date: "2026-08-30", summary: '含 "引号" 与 <标签>' },
  { slug: "older", title: "较旧", date: "2026-08-24", summary: "普通摘要" }
];

describe("sitemap", () => {
  it("lists every static route plus each post with a trailing slash", () => {
    const xml = buildSitemap([
      ...STATIC_ROUTES.map((route) => ({ path: route })),
      ...posts.map((post) => ({ path: postPath(post.slug), lastmod: post.date }))
    ]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<urlset");
    for (const route of STATIC_ROUTES) expect(xml).toContain(`<loc>${absoluteUrl(route)}</loc>`);
    for (const post of posts) {
      expect(xml).toContain(`<loc>${SITE_URL}/posts/${post.slug}/</loc>`);
      expect(xml).toContain(`<lastmod>${post.date}</lastmod>`);
    }
    expect(xml.match(/<url>/g)).toHaveLength(STATIC_ROUTES.length + posts.length);
  });

  it("escapes XML in urls", () => {
    const xml = buildSitemap([{ path: "/posts/a&b/" }]);
    expect(xml).toContain("/posts/a&amp;b/");
    expect(xml).not.toContain("a&b<");
  });
});

describe("feed", () => {
  it("renders one item per post with absolute links and rfc822 dates", () => {
    const xml = buildFeed(posts);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<language>zh-CN</language>");
    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml).toContain(`<link>${SITE_URL}/posts/newer/</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${SITE_URL}/posts/newer/</guid>`);
    expect(xml).toContain(`<pubDate>${toRfc822("2026-08-30")}</pubDate>`);
    expect(xml).toContain(absoluteUrl("/feed.xml"));
  });

  it("escapes special characters in titles and summaries", () => {
    const xml = buildFeed(posts);
    expect(xml).toContain("较新 &amp; 特殊");
    expect(xml).toContain("&quot;引号&quot;");
    expect(xml).toContain("&lt;标签&gt;");
    expect(xml).not.toContain("<标签>");
  });

  it("stays valid with no posts", () => {
    const xml = buildFeed([]);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});

describe("robots", () => {
  it("points at the absolute sitemap url", () => {
    const txt = buildRobots();
    expect(txt).toContain("User-agent: *");
    expect(txt).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});

describe("helpers", () => {
  it("builds absolute urls from routes", () => {
    expect(absoluteUrl("/posts/")).toBe(`${SITE_URL}/posts/`);
    expect(escapeXml("<a>\"b\"</a>")).toBe("&lt;a&gt;&quot;b&quot;&lt;/a&gt;");
  });
});

describe("readPosts", () => {
  let fixture;

  beforeAll(async () => {
    fixture = await mkdtemp(path.join(tmpdir(), "qingxpuli-posts-"));
    await writeFile(path.join(fixture, "a-newer.md"), '---\ntitle: "Newer"\ndate: 2026-05-02\nsummary: "newer"\n---\n\nbody\n');
    await writeFile(path.join(fixture, "b-older.md"), "---\ntitle: Older\ndate: 2026-01-01\nsummary: older\n---\n\nbody\n");
    await writeFile(path.join(fixture, "c-draft.md"), "---\ntitle: Draft\ndate: 2026-09-09\ndraft: true\n---\n\nbody\n");
  });

  afterAll(async () => {
    if (fixture) await rm(fixture, { recursive: true, force: true });
  });

  it("skips drafts and sorts newest first", async () => {
    const result = await readPosts(fixture);
    expect(result.map((post) => post.slug)).toEqual(["a-newer", "b-older"]);
    expect(result[0].date).toBe("2026-05-02");
  });

  it("returns an empty list for a missing directory", async () => {
    await expect(readPosts(path.join(fixture, "missing"))).resolves.toEqual([]);
  });
});
