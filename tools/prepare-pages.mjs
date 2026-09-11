import { access, copyFile } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";

/**
 * Post-build gate. Runs after `next build` and after the static metadata
 * generator, so a missing 404 page, sitemap, feed or route artifact fails the
 * build instead of silently shipping a broken deploy.
 */

const outputDir = path.join(process.cwd(), "out");
const nestedNotFound = path.join(outputDir, "404", "index.html");
const rootNotFound = path.join(outputDir, "404.html");

const requiredArtifacts = [
  "index.html",
  "404.html",
  "sitemap.xml",
  "feed.xml",
  "robots.txt",
  "posts/index.html",
  "archive/index.html",
  "projects/index.html",
  "about/index.html",
  "music/index.html",
  "gallery/index.html"
];

let failed = false;

try {
  await access(nestedNotFound, constants.F_OK);
  await copyFile(nestedNotFound, rootNotFound);
} catch {
  console.error(`Expected static 404 page was not found: ${nestedNotFound}`);
  failed = true;
}

for (const artifact of requiredArtifacts) {
  try {
    await access(path.join(outputDir, artifact), constants.F_OK);
  } catch {
    console.error(`Missing build artifact: out/${artifact}`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`Static output verified: ${requiredArtifacts.length} artifacts present, out/404.html written.`);
}
