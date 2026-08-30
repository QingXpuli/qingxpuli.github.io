import { describe, expect, it } from "vitest";
import { activeLyricIndex, parseLrc } from "./lrc";
import { getPosts } from "./content";

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
  });
});
