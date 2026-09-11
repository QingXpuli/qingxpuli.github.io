import { describe, expect, it } from "vitest";
import { activeLyricIndex, parseLrc } from "./lrc";
import { getAllTags, getPosts, renderMarkdown } from "./content";

describe("LRC parser", () => {
  it("parses centiseconds and multiple timestamps", () => {
    const lines = parseLrc("[00:01.50]one\n[00:02:250][00:03.00]two");
    expect(lines).toEqual([
      { time: 1.5, text: "one" },
      { time: 2.25, text: "two" },
      { time: 3, text: "two" }
    ]);
    expect(activeLyricIndex(lines, 2.5)).toBe(1);
  });
});

describe("post content", () => {
  it("returns only published markdown posts", () => {
    const posts = getPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.draft === false)).toBe(true);
    expect(posts.every((post) => /^\d{4}-\d{2}-\d{2}$/.test(post.date))).toBe(true);
  });

  it("sorts posts by date descending", () => {
    const dates = getPosts().map((post) => post.date);
    expect([...dates].sort((a, b) => Date.parse(b) - Date.parse(a))).toEqual(dates);
  });

  it("collects tags from published posts", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(new Set(tags).size).toBe(tags.length);
  });
});

describe("markdown rendering", () => {
  it("highlights fenced code blocks that declare a language", async () => {
    const { html } = await renderMarkdown("```ts\nconst answer: number = 42;\n```\n");
    expect(html).toContain("hljs");
    expect(html).toContain("language-ts");
    expect(html).toContain("hljs-keyword");
  });

  it("does not guess a language for unlabelled code blocks", async () => {
    const { html } = await renderMarkdown("```\nplain text block\n```\n");
    expect(html).toContain("plain text block");
    expect(html).not.toContain("hljs-keyword");
    expect(html).not.toMatch(/language-[a-z]+/);
  });

  it("assigns heading ids and returns them in document order", async () => {
    const { html, headings } = await renderMarkdown("## 第一节\n\n正文\n\n### 子标题\n\n### 子标题\n");
    expect(headings.map((heading) => heading.depth)).toEqual([2, 3, 3]);
    expect(headings.map((heading) => heading.text)).toEqual(["第一节", "子标题", "子标题"]);
    expect(headings[0].id).toBeTruthy();
    expect(new Set(headings.map((heading) => heading.id)).size).toBe(3);
    for (const heading of headings) expect(html).toContain(`id="${heading.id}"`);
  });

  it("returns no headings when the source has none", async () => {
    const { headings } = await renderMarkdown("只有一段普通文字。\n");
    expect(headings).toEqual([]);
  });
});
