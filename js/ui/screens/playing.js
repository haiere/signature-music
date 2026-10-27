import { getSongBySlug, getSongArtwork } from '../../../data-song.js';
import { t } from '../../core/i18n.js';
import { escapeHtml, formatDuration } from '../../core/format.js';

export function renderPlaying(player, albumSlug, songSlug) {
  const song = getSongBySlug(albumSlug, songSlug);

  if (!song) {
    return `
      <section class="screen">
        <div class="empty-state">
          <h2>${t('playing.notFound')}</h2>
          <p>${t('playing.notFoundDesc')}</p>
          <a class="btn primary" href="/" data-link>${t('playing.home')}</a>
        </div>
      </section>
    `;
  }

  const active = player.current?.id === song.id;

  return `
    <section class="screen playing-screen">
      <img class="playing-art" src="${escapeHtml(getSongArtwork(song))}" alt="" loading="eager" decoding="async" data-cover />
      <div class="playing-info">
        <p class="eyebrow">${escapeHtml(song.album)}</p>
        <h1 class="playing-title">${escapeHtml(song.title)}</h1>
        <p class="playing-meta">${escapeHtml(song.artist)}${song.year ? ` · ${song.year}` : ''}</p>
        <p class="playing-desc">${escapeHtml(song.description || '')}</p>

        <div class="playing-actions">
          <button class="btn primary" data-action="toggle-play">${active && player.audio && !player.audio.paused ? t('player.pause') : t('player.play')}</button>
          <button class="btn ghost" data-action="share-song">${t('common.share')}</button>
          <button class="btn ghost" data-action="copy-link">${t('common.copy')}</button>
        </div>

        <div class="progress-wrap">
          <div class="progress-track" id="playingProgress" role="slider" tabindex="0" aria-label="${t('player.seek')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-fill" id="playingProgressFill"></div>
          </div>
          <div class="time-row"><span id="playingCurrent">0:00</span><span id="playingDuration">${formatDuration(song.duration)}</span></div>
        </div>

        <a class="btn ghost" href="/music" data-link>${t('playing.back')}</a>
      </div>
    </section>
  `;
} 
