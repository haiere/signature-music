import { t } from '../core/i18n.js';
import { formatDuration, escapeHtml } from '../core/format.js';
import { getSongArtwork } from '../../data-song.js';

export function songRow(song, { activeId = null, compact = false } = {}) {
  const active = song.id === activeId;
  return `
    <button class="song-row ${active ? 'is-active' : ''}" data-action="select-song" data-id="${escapeHtml(song.id)}" aria-current="${active}">
      <img class="song-thumb" src="${escapeHtml(getSongArtwork(song))}" alt="" loading="lazy" decoding="async" width="40" height="40" data-cover />
      <span class="song-info">
        <span class="song-title">${escapeHtml(song.title)}</span>
        <span class="song-meta">${escapeHtml(song.album)}${song.genre ? ` · ${escapeHtml(song.genre)}` : ''}</span>
      </span>
      <span class="song-duration">${song.duration ? formatDuration(song.duration) : ''}</span>
    </button>
  `;
}

export function albumCard(album) {
  return `
    <button class="album-card" data-action="filter-album" data-album="${escapeHtml(album.albumSlug)}">
      <img src="${escapeHtml(album.albumArtworkUrl)}" alt="" loading="lazy" decoding="async" width="200" height="200" data-cover />
      <span class="album-info">
        <span class="album-name">${escapeHtml(album.album)}</span>
        <span class="album-meta">${album.songs.length} ${t('nav.music').toLowerCase()} · ${album.year || ''}</span>
      </span>
    </button>
  `;
}
