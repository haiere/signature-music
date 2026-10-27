export function slugify(text) {
    if (!text) return "";
    return String(text)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")      // remove diacritics
        .replace(/[^a-z0-9\s-]/g, "")          // keep alphanumerics, spaces, hyphens
        .trim()
        .replace(/\s+/g, "-")                  // spaces → hyphens
        .replace(/-+/g, "-");                   // collapse repeated hyphens
}

export function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export function findSongBySlug(songs, titleSlug, artistSlug) {
    return songs.find(s =>
        slugify(s.title) === titleSlug &&
        slugify(s.artist) === artistSlug
    ) || null;
}

export function findSongById(songs, id) {
    return songs.find(s => s.id === id) || null;
}

export function getSongSlug(song) {
    return { title: slugify(song.title), artist: slugify(song.artist) };
}

export function buildSongPath(song) {
    const { title, artist } = getSongSlug(song);
    return `/playing/${title}/${artist}`;
}

export function buildSearchPath(song) {
    const { title, artist } = getSongSlug(song);
    return `/search/${title}/${artist}`;
} 
