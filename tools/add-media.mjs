import { access, copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Register a media file into the site and its credit manifest in one step.
 *
 * Images are converted to WebP (max edge 1200px, quality 80) so that every
 * future addition matches the existing assets, and the manifest entry always
 * carries the rights classification the media gate requires.
 *
 * Usage:
 *   npm run add:media -- --file "C:\photos\me.jpg" --rights owned --author "Qing" \
 *     --license "站点所有者本人拍摄" --attribution "Qing 本人照片"
 *   npm run add:media -- --file "cover.png" --folder gallery --kind image \
 *     --rights authorized --author "原作者" --license "已获发布许可" \
 *     --source "https://example.com/source" --attribution "版权归原作者所有"
 *   npm run add:media -- --file "song.mp3" --kind audio --name my-track
 *
 * Options:
 *   --file       required, the local file to add
 *   --kind       image (default) | audio | lyrics | font
 *   --rights     required: original | owned | authorized
 *   --author     required
 *   --license    required
 *   --attribution required
 *   --source     required unless --rights original (default: 由站点所有者本地提供)
 *   --name       output file name without extension (default: sanitized input name)
 *   --folder     media (default) | gallery
 *   --force      overwrite an existing file and manifest entry
 */

const publicDir = path.join(process.cwd(), "public");
const manifestPath = path.join(process.cwd(), "content", "media-credits.json");
const RIGHTS = ["original", "owned", "authorized"];
const KINDS = ["image", "audio", "lyrics", "font"];
const OWNER_NAMES = ["qing", "qingxpuli"];
const MAX_EDGE = 1200;
const QUALITY = 80;
const RASTER_EXTENSIONS = /\.(png|jpe?g|webp|avif)$/i;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    if (key === "force") {
      args.force = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`--${key} 需要一个值`);
    args[key] = value;
    i++;
  }
  return args;
}

function sanitizeName(value) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "media";
}

async function ensureUniqueName(directory, name, extension, force) {
  if (force) return name;
  let candidate = name;
  let suffix = 2;
  for (;;) {
    try {
      await access(path.join(directory, `${candidate}${extension}`));
      candidate = `${name}-${suffix++}`;
    } catch {
      return candidate;
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) throw new Error('缺少 --file，例如：npm run add:media -- --file "C:\\photos\\me.jpg" --rights owned --author Qing --license "本人拍摄" --attribution "Qing 本人照片"');

  const kind = args.kind || "image";
  if (!KINDS.includes(kind)) throw new Error(`--kind 必须是 ${KINDS.join(" / ")}`);
  if (!RIGHTS.includes(args.rights)) throw new Error(`--rights 必须是 ${RIGHTS.join(" / ")}（未分类素材不允许发布）`);
  if (!args.author) throw new Error("缺少 --author");
  if (!args.license) throw new Error("缺少 --license");
  if (!args.attribution) throw new Error("缺少 --attribution");
  if (args.rights === "original" && !OWNER_NAMES.includes(String(args.author).toLowerCase())) {
    throw new Error(`--rights original 要求 --author 为站点所有者（Qing / QingXpuli），当前是 "${args.author}"；第三方素材请用 --rights authorized`);
  }

  const source = path.resolve(args.file);
  const info = await stat(source).catch(() => null);
  if (!info || !info.isFile()) throw new Error(`找不到文件：${source}`);

  const folder = args.folder === "gallery" ? path.join(publicDir, "media", "gallery") : path.join(publicDir, "media");
  await mkdir(folder, { recursive: true });

  const baseName = sanitizeName(args.name || path.basename(source));
  let outputName;
  let outputPath;

  if (kind === "image" && RASTER_EXTENSIONS.test(source)) {
    outputName = await ensureUniqueName(folder, baseName, ".webp", args.force);
    outputPath = path.join(folder, `${outputName}.webp`);
    await sharp(source)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);
  } else {
    const extension = path.extname(source).toLowerCase();
    outputName = await ensureUniqueName(folder, baseName, extension, args.force);
    outputPath = path.join(folder, `${outputName}${extension}`);
    await copyFile(source, outputPath);
  }

  const publicPath = `/${path.relative(publicDir, outputPath).replaceAll("\\", "/")}`;
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const entry = {
    kind,
    path: publicPath,
    author: args.author,
    license: args.license,
    sourceUrl: args.source || (args.rights === "original" ? "https://github.com/QingXpuli/qingxpuli.github.io" : "由站点所有者本地提供"),
    attribution: args.attribution,
    rights: args.rights
  };

  const existing = manifest.findIndex((item) => item.path === publicPath);
  if (existing >= 0) {
    if (!args.force) throw new Error(`${publicPath} 已在清单中；如需替换请加 --force`);
    manifest[existing] = entry;
  } else {
    manifest.push(entry);
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const size = Math.round((await stat(outputPath)).size / 1024);
  console.log(`已写入：${publicPath}（${size} KB）`);
  console.log(`${existing >= 0 ? "已更新" : "已登记"} media-credits 条目，共 ${manifest.length} 条`);
  console.log("下一步：npm run verify:media 校验，并在 content/ 中引用该路径。");
}

try {
  await main();
} catch (error) {
  console.error(`素材入库失败：${error.message}`);
  process.exitCode = 1;
}
