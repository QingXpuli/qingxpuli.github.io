import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Media credit gate. Every public media file must be registered, must resolve to
 * a real file, and must declare where its publication rights come from.
 *
 * `rights` is deliberately mandatory: the earlier manifest could pass while
 * attributing third-party artwork to the site owner, because only field
 * presence was checked. Allowed values are:
 *   - "original"    the site owner created the asset
 *   - "owned"       the site owner holds the asset (for example their own photo)
 *   - "authorized"  third-party material published with permission
 * Unclassified material cannot be published.
 */

const root = process.cwd();
const publicDir = path.join(root, "public");
const manifestPath = path.join(root, "content", "media-credits.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const registered = new Map(manifest.map((entry) => [entry.path, entry]));
const failures = [];

const RIGHTS = ["original", "owned", "authorized"];
const OWNER_NAMES = ["qing", "qingxpuli"];

if (!Array.isArray(manifest) || manifest.length === 0) {
  failures.push("media credit manifest is empty");
}

for (const [index, entry] of manifest.entries()) {
  const where = `entry ${index + 1}${entry?.path ? ` (${entry.path})` : ""}`;
  if (!entry || !["image", "audio", "lyrics", "font"].includes(entry.kind)) failures.push(`${where}: invalid kind`);
  if (!entry?.path || !entry.author || !entry.license) failures.push(`${where}: path, author and license are required`);
  if (!entry?.attribution) failures.push(`${where}: attribution is required`);
  if (!entry?.sourceUrl) failures.push(`${where}: sourceUrl is required`);

  if (!RIGHTS.includes(entry?.rights)) {
    failures.push(`${where}: rights must be one of ${RIGHTS.join(", ")}`);
  } else if (entry.rights === "original" && !OWNER_NAMES.includes(String(entry.author).toLowerCase())) {
    failures.push(`${where}: rights "original" requires the site owner as author, got "${entry.author}"`);
  }

  if (entry?.path?.startsWith("/")) {
    try {
      await access(path.join(publicDir, entry.path.slice(1)));
    } catch {
      failures.push(`missing local media: ${entry.path}`);
    }
  }
}

async function collectFiles(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    const filePath = path.join(relative, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) files.push(...await collectFiles(file, filePath));
    else files.push(`/${filePath}`);
  }
  return files;
}

for (const file of await collectFiles(publicDir)) {
  if (!registered.has(file)) failures.push(`unregistered public media: ${file}`);
}

if (failures.length) {
  console.error("Media credit verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Media credit verification passed: ${manifest.length} entries registered.`);
}
