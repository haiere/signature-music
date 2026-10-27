/**
 * Signature Music — canonical song catalogue.
 * Semua field konsisten. Jangan memakai alias `name`, `group`, `cover`, `url`.
 */

const ALBUM_DEFS = {
  'fragmen-suara': {
    album: 'Fragmen Suara',
    albumSlug: 'fragmen-suara',
    albumArtworkUrl: 'https://i.postimg.cc/W3pHjGCQ/fragmen.webp',
    year: 2025,
    genre: 'Indie',
    colors: { primary: '#a78bfa', secondary: '#7c3aed' },
    description: 'Kumpulan fragmen yang tidak selalu utuh, tetapi tetap berarti.'
  },
  'resonansi-dalam-diam': {
    album: 'Resonansi Dalam Diam',
    albumSlug: 'resonansi-dalam-diam',
    albumArtworkUrl: 'https://i.postimg.cc/Tw24GVFB/resonansi.webp',
    year: 2025,
    genre: 'Alternative',
    colors: { primary: '#60a5fa', secondary: '#2563eb' },
    description: 'Getaran yang tidak terdengar, namun paling terasa.'
  },
  'saya-akan-lawan': {
    album: 'Saya Akan Lawan',
    albumSlug: 'saya-akan-lawan',
    albumArtworkUrl: 'https://i.postimg.cc/Ghj99yqK/sayaakanlawan(Copy).png',
    year: 2026,
    genre: 'Alternative',
    colors: { primary: '#f472b6', secondary: '#db2777' },
    description: 'Satu suara untuk tetap berdiri.'
  }
};

const ALBUM_BY_NAME = Object.values(ALBUM_DEFS).reduce((acc, a) => {
  acc[a.album] = a;
  return acc;
}, {});

export const DEFAULT_ARTWORK = 'https://i.postimg.cc/W3pHjGCQ/fragmen.webp';

const RAW_TRACKS = [
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

export function createSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildSong([album, title, slug, audioUrl], index) {
  const meta = ALBUM_BY_NAME[album] || null;
  const albumSlug = meta?.albumSlug || createSlug(album);
  const safeSlug = createSlug(slug || title);

  return {
    id: `${albumSlug}--${safeSlug}`,
    title,
    slug: safeSlug,
    artist: 'Muhaajir',
    album,
    albumSlug,
    albumArtist: 'Muhaajir',
    genre: meta?.genre || null,
    year: meta?.year || null,
    trackNumber: index + 1,
    discNumber: 1,
    duration: 0,
    audioUrl,
    artworkUrl: meta?.albumArtworkUrl || DEFAULT_ARTWORK,
    fallbackArtwork: DEFAULT_ARTWORK,
    colors: meta?.colors || { primary: '#a78bfa', secondary: '#7c3aed' },
    description: meta?.description || '',
    metadataStatus: 'local',
    order: index
  };
}

export const SONGS = RAW_TRACKS.map(buildSong);

/* ---------- validation ---------- */
export function validateCatalogue(songs = SONGS) {
  const seenIds = new Set();
  const seenRoutes = new Set();
  const errors = [];

  for (const s of songs) {
    if (seenIds.has(s.id)) errors.push(`Duplicate id: ${s.id}`);
    seenIds.add(s.id);

    const route = `${s.albumSlug}/${s.slug}`;
    if (seenRoutes.has(route)) errors.push(`Duplicate route: ${route}`);
    seenRoutes.add(route);

    if (!s.title || !s.artist || !s.album || !s.audioUrl) {
      errors.push(`Missing required field: ${s.id || s.title}`);
    }
  }
  return errors;
}

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
  return SONGS[(idx + direction + SONGS.length) % SONGS.length];
}

export function getAllAlbums() {
  const map = new Map();
  for (const s of SONGS) {
    if (!map.has(s.albumSlug)) {
      map.set(s.albumSlug, {
        album: s.album,
        albumSlug: s.albumSlug,
        albumArtworkUrl: s.artworkUrl,
        year: s.year,
        genre: s.genre,
        description: s.description,
        colors: s.colors,
        songs: []
      });
    }
    map.get(s.albumSlug).songs.push(s);
  }
  return Array.from(map.values());
}

export function searchSongs(query, { albumSlug = null, genre = null } = {}) {
  const q = String(query || '').trim().toLowerCase();
  return SONGS.filter(s => {
    if (albumSlug && s.albumSlug !== albumSlug) return false;
    if (genre && s.genre !== genre) return false;
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      (s.genre || '').toLowerCase().includes(q)
    );
  });
}

export function getSongArtwork(song) {
  return song?.artworkUrl || song?.fallbackArtwork || DEFAULT_ARTWORK;
}

export function getSongUrl(song) {
  return `/playing/${song.albumSlug}/${song.slug}`;
}
