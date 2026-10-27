/**
 * Haiere Signature Music — canonical song data.
 * One schema for every track. Do not introduce aliases like `name`, `cover`, `image`.
 */

const ALBUM_META = {
  'fragmen-suara': {
    album: 'Fragmen Suara',
    albumSlug: 'fragmen-suara',
    coverSrc: 'https://i.postimg.cc/W3pHjGCQ/fragmen.webp',
    colors: { primary: '#a78bfa', secondary: '#7c3aed' },
    year: 2025,
    genre: 'Indie',
    description: 'Kumpulan fragmen yang tidak selalu utuh, tetapi tetap berarti.'
  },
  'resonansi-dalam-diam': {
    album: 'Resonansi Dalam Diam',
    albumSlug: 'resonansi-dalam-diam',
    coverSrc: 'https://i.postimg.cc/Tw24GVFB/resonansi.webp',
    colors: { primary: '#60a5fa', secondary: '#2563eb' },
    year: 2025,
    genre: 'Alternative',
    description: 'Getaran yang tidak terdengar, namun paling terasa.'
  },
  'saya-akan-lawan': {
    album: 'Saya Akan Lawan',
    albumSlug: 'saya-akan-lawan',
    coverSrc: 'https://i.postimg.cc/Ghj99yqK/sayaakanlawan(Copy).png',
    colors: { primary: '#f472b6', secondary: '#db2777' },
    year: 2026,
    genre: 'Alternative',
    description: 'Satu suara untuk tetap berdiri.'
  }
};

const FALLBACK_COVER = '/assets/default-cover.svg';

const RAW = [
  ['Fragmen Suara', 'Lintasan Tak Bermakna', 'lintasan-tak-bermakna', 'https://files.catbox.moe/7p3gmt.opus'],
  ['Fragmen Suara', 'Padahal Sudah Bilang', 'padahal-sudah-bilang', 'https://files.catbox.moe/izfodb.opus'],
  ['Fragmen Suara', 'Mimpi yang Tertunda', 'mimpi-yang-tertunda', 'https://files.catbox.moe/44mglv.opus'],
  ['Fragmen Suara', 'Langit Masih Sama', 'langit-masih-sama', 'https://files.catbox.moe/m1gzfk.opus'],
  ['Fragmen Suara', 'Suatu Hari Nanti', 'suatu-hari-nanti', 'https://files.catbox.moe/j26sgp.opus'],
  ['Resonansi Dalam Diam', 'Nada Terpendam', 'nada-terpendam', 'https://files.catbox.moe/suwzc2.opus'],
  ['Resonansi Dalam Diam', 'Langit Patah Arah', 'langit-patah-arah', 'https://files.catbox.moe/wl8kn9.opus'],
  ['Resonansi Dalam Diam', 'Tak Bernama, Tapi Ada', 'tak-bernama-tapi-ada', 'https://files.catbox.moe/vh4bn7.opus'],
  ['Resonansi Dalam Diam', 'Resonansi Dalam Diam', 'resonansi-dalam-diam', 'https://files.catbox.moe/8l1bkc.opus'],
  ['Resonansi Dalam Diam', 'Runtuh Tanpa Suara', 'runtuh-tanpa-suara', 'https://files.catbox.moe/52dcsz.opus'],
  ['Resonansi Dalam Diam', 'Kilau Tanpa Sorotan', 'kilau-tanpa-sorotan', 'https://files.catbox.moe/m28u99.opus'],
  ['Resonansi Dalam Diam', 'Gelombang Terakhir', 'gelombang-terakhir', 'https://files.catbox.moe/6lkkg2.opus'],
  ['Saya Akan Lawan', 'Saya Akan Lawan', 'saya-akan-lawan', 'https://files.catbox.moe/704z9d.opus']
];

function buildSong([album, title, slug, audioSrc], index) {
  const meta = ALBUM_META[slug]?.album === album
    ? ALBUM_META[slug]
    : Object.values(ALBUM_META).find(a => a.album === album);

  const albumSlug = meta?.albumSlug || album.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const coverSrc = meta?.coverSrc || FALLBACK_COVER;
  const colors = meta?.colors || { primary: '#a78bfa', secondary: '#7c3aed' };

  return {
    id: `${albumSlug}-${slug}`,
    title,
    artist: 'Muhaajir',
    album,
    albumSlug,
    slug,
    audioSrc,
    coverSrc,
    coverFallback: FALLBACK_COVER,
    duration: 0,
    year: meta?.year || 2025,
    genre: meta?.genre || 'Indie',
    description: meta?.description || '',
    colors,
    metadata: { source: 'remote', embeddedCover: false },
    order: index
  };
}

export const SONGS = RAW.map(buildSong);

/* ---------- validation ---------- */
export function validateSlugs(songs = SONGS) {
  const seen = new Set();
  const errors = [];
  for (const s of songs) {
    const key = `${s.albumSlug}/${s.slug}`;
    if (seen.has(key)) errors.push(`Duplicate slug: ${key}`);
    seen.add(key);
    if (!s.id || !s.albumSlug || !s.slug) errors.push(`Missing slug/id: ${s.title}`);
  }
  if (errors.length) console.error('[Haiere] Song data validation:', errors);
  return errors;
}
validateSlugs();

/* ---------- helpers ---------- */
export function getSongById(id) {
  return SONGS.find(s => s.id === id) || null;
}

export function getSongBySlug(albumSlug, songSlug) {
  return SONGS.find(s => s.albumSlug === albumSlug && s.slug === songSlug) || null;
}

export function getAdjacentSong(currentId, direction) {
  const idx = SONGS.findIndex(s => s.id === currentId);
  if (idx === -1) return SONGS[0] || null;
  const next = (idx + direction + SONGS.length) % SONGS.length;
  return SONGS[next];
}

export function getAllAlbums() {
  const map = new Map();
  for (const s of SONGS) {
    if (!map.has(s.albumSlug)) {
      map.set(s.albumSlug, {
        album: s.album,
        albumSlug: s.albumSlug,
        coverSrc: s.coverSrc,
        coverFallback: s.coverFallback,
        colors: s.colors,
        year: s.year,
        genre: s.genre,
        description: s.description,
        songs: []
      });
    }
    map.get(s.albumSlug).songs.push(s);
  }
  return Array.from(map.values());
}

export function searchSongs(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return SONGS.slice();
  return SONGS.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.album.toLowerCase().includes(q) ||
    s.genre.toLowerCase().includes(q)
  );
}

export function getSongUrl(song) {
  return `/playing/${song.albumSlug}/${song.slug}`;
}

export function getAlbumBySlug(albumSlug) {
  return getAllAlbums().find(a => a.albumSlug === albumSlug) || null;
        }
