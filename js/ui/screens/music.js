import { SONGS, getAllAlbums, searchSongs } from '../../../data-song.js';
import { t } from '../../core/i18n.js';
import { songRow } from '../components.js';

let currentQuery = '';
let currentAlbum = null;

export function renderMusic(player) {
  const albums = getAllAlbums();
  const songs = searchSongs(currentQuery, { albumSlug: currentAlbum });

  return `
    <section class="screen">
      <div class="section-head"><h2>${t('music.title')}</h2><span class="muted">${songs.length}</span></div>
      <div class="music-toolbar">
        <input id="musicSearch" class="search-input" type="search" value="${escapeAttr(currentQuery)}"
          placeholder="${t('music.searchPlaceholder')}" data-i18n-placeholder="music.searchPlaceholder"
          aria-label="${t('common.search')}" />
        <div class="filter-chips">
          <button class="chip ${!currentAlbum ? 'is-active' : ''}" data-action="filter-album" data-album="">${t('common.all')}</button>
          ${albums.map(a => `
            <button class="chip ${currentAlbum === a.albumSlug ? 'is-active' : ''}"
              data-action="filter-album" data-album="${a.albumSlug}">${a.album}</button>
          `).join('')}
        </div>
      </div>
      <div id="musicList" class="song-list">
        ${songs.length
          ? songs.map(s => songRow(s, { activeId: player.current?.id })).join('')
          : `<div class="empty-state"><p>${t('music.empty')}</p></div>`}
      </div>
    </section>
  `;
}

export function bindMusicEvents(root, player, rerender) {
  const input = root.querySelector('#musicSearch');
  if (input) {
    input.addEventListener('input', () => {
      currentQuery = input.value;
      updateList(root, player);
    });
  }
}

function updateList(root, player) {
  const list = root.querySelector('#musicList');
  if (!list) return;
  const songs = searchSongs(currentQuery, { albumSlug: currentAlbum });
  list.innerHTML = songs.length
    ? songs.map(s => songRow(s, { activeId: player.current?.id })).join('')
    : `<div class="empty-state"><p>${t('music.empty')}</p></div>`;
}

export function setAlbumFilter(slug) {
  currentAlbum = slug || null;
}

export function getAlbumFilter() {
  return currentAlbum;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
} 
