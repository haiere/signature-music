import { SONGS, getAllAlbums, getSongArtwork } from '../../../data-song.js';
import { t } from '../../core/i18n.js';
import { storage } from '../../core/storage.js';
import { escapeHtml } from '../../core/format.js';
import { songRow, albumCard } from '../components.js';

export function renderHome(player) {
  const lastId = storage.get('sig_last_song', null);
  const last = SONGS.find(s => s.id === lastId) || SONGS[0];

  const recentIds = storage.get('sig_recent', []);
  const recent = recentIds
    .map(id => SONGS.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const albums = getAllAlbums().slice(0, 4);

  return `
    <section class="screen">
      <div class="hero-card">
        <img class="hero-art" src="${escapeHtml(getSongArtwork(last))}" alt="" loading="eager" decoding="async" data-cover />
        <div class="hero-info">
          <p class="eyebrow">${t('home.continue')}</p>
          <h1 class="hero-title">${escapeHtml(last.title)}</h1>
          <p class="hero-meta">${escapeHtml(last.artist)} · ${escapeHtml(last.album)}</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="play-song" data-id="${escapeHtml(last.id)}">${t('player.play')}</button>
            <a class="btn ghost" href="/playing/${last.albumSlug}/${last.slug}" data-link>${t('home.openPlayer')}</a>
          </div>
        </div>
      </div>

      ${recent.length ? `
        <section>
          <div class="section-head"><h2>${t('home.recent')}</h2></div>
          <div class="song-list compact">
            ${recent.map(s => songRow(s, { activeId: player.current?.id, compact: true })).join('')}
          </div>
        </section>
      ` : ''}

      <section>
        <div class="section-head"><h2>${t('home.albums')}</h2></div>
        <div class="album-grid">${albums.map(albumCard).join('')}</div>
      </section>
    </section>
  `;
}
