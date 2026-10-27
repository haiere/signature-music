import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const required = [
  'index.html', 'style.css', 'script.js', 'data-song.js', 'sw.js',
  'manifest.webmanifest', 'assets/default-cover.svg', 'vercel.json'
];

let failed = false;
for (const f of required) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error('MISSING:', f);
    failed = true;
  }
}

const { SONGS, validateSlugs } = await import(pathToFileURL(path.join(root, 'data-song.js')).href);
const slugErrors = validateSlugs();
if (slugErrors.length) { console.error(slugErrors); failed = true; }

const ids = new Set(SONGS.map(s => s.id));
if (ids.size !== SONGS.length) { console.error('Duplicate song IDs'); failed = true; }

const routes = SONGS.map(s => `/playing/${s.albumSlug}/${s.slug}`);
if (new Set(routes).size !== routes.length) { console.error('Duplicate routes'); failed = true; }

console.log(`Songs: ${SONGS.length} | Albums: ${new Set(SONGS.map(s => s.albumSlug)).size} | Routes: ${routes.length}`);
if (failed) process.exit(1);
console.log('Build verification OK');
