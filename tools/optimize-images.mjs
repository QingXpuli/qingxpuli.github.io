import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Manual asset maintenance script (not part of build or CI).
 *
 * 1. Renders `public/media/og-default.png` (1200x630) from the original
 *    `public/media/about-cover.svg`, used as the default Open Graph image.
 * 2. Converts oversized raster media under `public/media/` to WebP
 *    (max edge 1200px, quality 80) and removes the source file, so the site
 *    ships far smaller pages.
 *
 * After running this, update every reference to a converted file
 * (`content/gallery.ts`, `content/site.ts`, `content/media-credits.json`) and
 * re-run `npm run verify:media`.
 *
 * Usage: npm run optimize:images
 */

const mediaDir = path.join(process.cwd(), "public", "media");
const MAX_EDGE = 1200;
const QUALITY = 80;
const OG_SOURCE = path.join(mediaDir, "about-cover.svg");
const OG_TARGET = path.join(mediaDir, "og-default.png");
const SKIP_CONVERSION = new Set(["og-default.png"]);

function relative(file) {
  return path.relative(process.cwd(), file).replaceAll("\\", "/");
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
}

async function renderOgImage() {
  try {
    await sharp(OG_SOURCE).resize(1200, 630, { fit: "cover" }).png({ compressionLevel: 9 }).toFile(OG_TARGET);
    const { size } = await stat(OG_TARGET);
    console.log(`og image rendered: ${relative(OG_TARGET)} (${Math.round(size / 1024)} KB)`);
  } catch (error) {
    console.error(`Failed to render the Open Graph image from ${relative(OG_SOURCE)}: ${error.message}`);
    process.exitCode = 1;
  }
}

async function convertRasters() {
  const targets = (await walk(mediaDir))
    .filter((file) => /\.(png|jpe?g)$/i.test(file))
    .filter((file) => !SKIP_CONVERSION.has(path.basename(file)));

  let before = 0;
  let after = 0;
  const converted = [];
  const kept = [];

  for (const file of targets) {
    const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
    const original = (await stat(file)).size;
    await sharp(file)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webp);
    const compressed = (await stat(webp)).size;

    if (compressed >= original) {
      await unlink(webp);
      kept.push(relative(file));
      continue;
    }

    await unlink(file);
    converted.push(`${relative(file)} -> ${relative(webp)} (${Math.round(original / 1024)} KB -> ${Math.round(compressed / 1024)} KB)`);
    before += original;
    after += compressed;
  }

  for (const line of converted) console.log(`converted: ${line}`);
  for (const line of kept) console.log(`kept original (WebP was not smaller): ${line}`);
  console.log(`converted ${converted.length} file(s): ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
}

await renderOgImage();
await convertRasters();
