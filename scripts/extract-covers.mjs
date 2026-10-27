/**
 * Build-time cover extractor.
 * Usage:
 *   npm i -D music-metadata
 *   node scripts/extract-covers.mjs ./public/music ./public/music/covers
 *
 * Reads every audio file in the input folder, extracts embedded cover art,
 * and writes it to the output folder using the song slug.
 */
import { parseFile } from 'music-metadata';
import fs from 'node:fs/promises';
import path from 'node:path';

const inputDir = process.argv[2] || './public/music';
const outputDir = process.argv[3] || './public/music/covers';

const AUDIO_EXT = new Set(['.mp3', '.m4a', '.flac', '.ogg', '.opus', '.wav']);

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!AUDIO_EXT.has(ext)) continue;

    const filePath = path.join(inputDir, entry.name);
    const slug = path.basename(entry.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      const meta = await parseFile(filePath, { duration: false });
      const picture = meta.common.picture?.[0];
      if (!picture) {
        console.warn(`[skip] No embedded cover: ${entry.name}`);
        continue;
      }
      const extMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
      const outExt = extMap[picture.format] || '.jpg';
      const outPath = path.join(outputDir, `${slug}${outExt}`);
      await fs.writeFile(outPath, picture.data);
      console.log(`[ok] ${entry.name} → ${outPath}`);
    } catch (err) {
      console.error(`[fail] ${entry.name}:`, err.message);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
