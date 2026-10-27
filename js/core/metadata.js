const cache = new Map();

export async function loadAudioMetadata(url, { signal } = {}) {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url);

  try {
    const res = await fetch(url, {
      headers: { Range: 'bytes=0-524287' },
      signal
    });
    if (!res.ok) throw new Error('fetch failed');
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const parsed = parseContainer(bytes);
    cache.set(url, parsed);
    return parsed;
  } catch {
    cache.set(url, null);
    return null;
  }
}

function parseContainer(bytes) {
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return parseID3(bytes);
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return parseOgg(bytes);
  return null;
}

/* ---------- ID3v2 ---------- */
function parseID3(bytes) {
  const version = bytes[3];
  const size = syncSafe(bytes, 6);
  const end = Math.min(bytes.length, 10 + size);
  let offset = 10;
  const tags = {};
  let picture = null;

  while (offset + 10 <= end) {
    const id = ascii(bytes, offset, 4);
    if (!/^[A-Z0-9]{4}$/.test(id)) break;

    const frameSize = version === 4
      ? syncSafe(bytes, offset + 4)
      : (bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | (bytes[offset + 6] << 8) | bytes[offset + 7];

    if (frameSize <= 0 || offset + 10 + frameSize > end) break;
    const data = bytes.slice(offset + 10, offset + 10 + frameSize);

    if (id === 'APIC') {
      picture = parseAPIC(data);
    } else if (id.startsWith('T')) {
      const text = decodeText(data);
      if (text) tags[id] = text;
    }

    offset += 10 + frameSize;
  }

  return normalize({
    title: tags.TIT2,
    artist: tags.TPE1,
    album: tags.TALB,
    genre: tags.TCON,
    year: tags.TYER || tags.TDRC,
    trackNumber: tags.TRCK,
    discNumber: tags.TPOS,
    picture
  });
}

function parseAPIC(data) {
  try {
    let i = 0;
    const encoding = data[i++];
    const mimeEnd = data.indexOf(0, i);
    const mime = ascii(data, i, mimeEnd - i);
    i = mimeEnd + 1;
    i++; // picture type
    const descEnd = data.indexOf(0, i);
    i = descEnd + 1;
    const picData = data.slice(i);
    return { mime, data: picData };
  } catch {
    return null;
  }
}

function decodeText(data) {
  if (!data?.length) return null;
  const encoding = data[0];
  const body = data.slice(1);
  try {
    if (encoding === 0) return new TextDecoder('latin1').decode(body).replace(/\0/g, '').trim();
    if (encoding === 3) return new TextDecoder('utf-8').decode(body).replace(/\0/g, '').trim();
    if (encoding === 1) return new TextDecoder('utf-16').decode(body).replace(/\0/g, '').trim();
    return new TextDecoder('utf-8').decode(body).replace(/\0/g, '').trim();
  } catch {
    return null;
  }
}

/* ---------- Ogg Opus ---------- */
function parseOgg(bytes) {
  const index = findAscii(bytes, 'OpusTags');
  if (index === -1) return null;

  let offset = index + 8;
  const vendorLen = readUint32LE(bytes, offset);
  offset += 4 + vendorLen;
  const count = readUint32LE(bytes, offset);
  offset += 4;

  const tags = {};
  let picture = null;

  for (let i = 0; i < count && offset + 4 <= bytes.length; i++) {
    const len = readUint32LE(bytes, offset);
    offset += 4;
    if (offset + len > bytes.length) break;
    const comment = new TextDecoder('utf-8').decode(bytes.slice(offset, offset + len));
    offset += len;

    const eq = comment.indexOf('=');
    if (eq === -1) continue;
    const key = comment.slice(0, eq).toUpperCase();
    const value = comment.slice(eq + 1);
    if (key === 'METADATA_BLOCK_PICTURE') {
      picture = parseFlacPicture(value);
    } else {
      tags[key] = value;
    }
  }

  return normalize({
    title: tags.TITLE,
    artist: tags.ARTIST,
    album: tags.ALBUM,
    genre: tags.GENRE,
    year: tags.DATE,
    trackNumber: tags.TRACKNUMBER,
    discNumber: tags.DISCNUMBER,
    picture
  });
}

function parseFlacPicture(base64) {
  try {
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    let offset = 4; // picture type
    const mimeLen = readUint32BE(bytes, offset); offset += 4;
    const mime = ascii(bytes, offset, mimeLen); offset += mimeLen;
    const descLen = readUint32BE(bytes, offset); offset += 4 + descLen;
    offset += 16; // width, height, depth, colors
    const dataLen = readUint32BE(bytes, offset); offset += 4;
    return { mime, data: bytes.slice(offset, offset + dataLen) };
  } catch {
    return null;
  }
}

/* ---------- normalize ---------- */
export function normalizeSongMetadata(song, metadata) {
  if (!metadata) return song;
  return {
    ...song,
    title: metadata.title || song.title,
    artist: metadata.artist || song.artist,
    album: metadata.album || song.album,
    genre: metadata.genre || song.genre,
    year: metadata.year ? String(metadata.year).slice(0, 4) : song.year,
    trackNumber: metadata.trackNumber || song.trackNumber,
    discNumber: metadata.discNumber || song.discNumber,
    metadataStatus: 'embedded'
  };
}

export function extractArtwork(metadata) {
  if (!metadata?.picture?.data?.length) return null;
  const blob = new Blob([metadata.picture.data], { type: metadata.picture.mime || 'image/jpeg' });
  return URL.createObjectURL(blob);
}

/* ---------- byte helpers ---------- */
function syncSafe(bytes, offset) {
  return ((bytes[offset] & 0x7f) << 21) |
         ((bytes[offset + 1] & 0x7f) << 14) |
         ((bytes[offset + 2] & 0x7f) << 7) |
         (bytes[offset + 3] & 0x7f);
}
function readUint32LE(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
}
function readUint32BE(bytes, offset) {
  return (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
}
function ascii(bytes, offset, length) {
  let out = '';
  for (let i = 0; i < length; i++) out += String.fromCharCode(bytes[offset + i]);
  return out;
}
function findAscii(bytes, needle) {
  const target = [...needle].map(c => c.charCodeAt(0));
  outer: for (let i = 0; i <= bytes.length - target.length; i++) {
    for (let j = 0; j < target.length; j++) {
      if (bytes[i + j] !== target[j]) continue outer;
    }
    return i;
  }
  return -1;
  } 
