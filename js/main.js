import { SONGS, getSongById, getSongUrl, getSongArtwork, DEFAULT_ARTWORK, validateCatalogue } from '../data-song.js';
import { Player } from './core/player.js';
import { initRouter, parseLocation, navigate } from './core/router.js';
import { initTheme, cycleTheme } from './core/theme.js';
import { t, getLang, toggleLang, applyTranslations } from './core/i18n.js';
import { storage } from './core/storage.js';
import { formatDuration } from './core/format.js';
import { loadAudioMetadata, normalizeSongMetadata, extractArtwork } from './core/metadata.js';
import { renderHome } from './ui/screens/home.js';
import { renderMusic, bindMusicEvents, setAlbumFilter } from './ui/screens/music.js';
import { renderSettings, bindSettingsEvents } from './ui/screens/settings.js';
import { renderPlaying } from './ui/screens/playing.js';

const $ = id => document.getElementById(id);
const viewRoot = $('viewRoot');
const audio = $('audio');
const toast = $('toast');

let currentRoute = parseLocation();
let player;

/* ---------- init ---------- */
function init() {
  const errors = validateCatalogue();
  if (errors.length) console.warn('[Signature Music] catalogue:', errors);

  initTheme();

  // Reduce motion persisted
  if (storage.get('sig_reduce_motion', false)) {
    document.documentElement.classList.add('reduce-motion');
  }

  // Cover fallback global
  document.addEventListener('error', e => {
    if (e.target.matches('[data-cover]') && !e.target.dataset.fallbackApplied) {
      e.target.dataset.fallbackApplied = '1';
      e.target.src = DEFAULT_ARTWORK;
    }
  }, true);

  player = new Player(audio, {
    onSongChange: handleSongChange,
    onStateChange: handlePlayerState,
    onTimeUpdate: handleTimeUpdate
  });

  applyTranslations();
  initNavigation();
  initPlayerBar();
  initKeyboard();
  initEasterEgg();
  initRouter(handleRoute);

  registerServiceWorker();

  requestAnimationFrame(() => {
    document.body.classList.add('ready');
    $('skeleton')?.setAttribute('aria-busy', 'false');
  });
}

/* ---------- routing ---------- */
function handleRoute(route) {
  currentRoute = route;

  if (route.name === 'home') {
    viewRoot.innerHTML = renderHome(player);
  } else if (route.name === 'music') {
    viewRoot.innerHTML = renderMusic(player);
    bindMusicEvents(viewRoot, player, rerenderCurrent);
  } else if (route.name === 'settings') {
    viewRoot.innerHTML = renderSettings();
    bindSettingsEvents(viewRoot, rerenderCurrent);
  } else if (route.name === 'playing') {
    viewRoot.innerHTML = renderPlaying(player, route.albumSlug, route.songSlug);
    bindPlayingEvents();
  } else {
    viewRoot.innerHTML = `
      <section class="screen">
        <div class="empty-state">
          <h2>${t('notfound.title')}</h2>
          <p>${t('notfound.desc')}</p>
          <a class="btn primary" href="/" data-link>${t('playing.home')}</a>
        </div>
      </section>`;
  }

  updateNavActive();
  applyTranslations(viewRoot);
  updateDocumentMeta();
  bindLinks();
}

function rerenderCurrent() {
  handleRoute(currentRoute);
}

function bindLinks() {
  viewRoot.querySelectorAll('[data-link]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.getAttribute('href'));
    });
  });
}

/* ---------- navigation ---------- */
function initNavigation() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.getAttribute('href'));
    });
  });
}

function updateNavActive() {
  const path = location.pathname;
  document.querySelectorAll('[data-nav]').forEach(el => {
    const href = el.getAttribute('href');
    const active = href === '/' ? path === '/' : path.startsWith(href);
    el.classList.toggle('is-active', active);
    if (active) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
}

/* ---------- player bar ---------- */
function initPlayerBar() {
  $('btnPlay')?.addEventListener('click', () => player.toggle());
  $('btnPrev')?.addEventListener('click', () => player.prev());
  $('btnNext')?.addEventListener('click', () => player.next());
  $('btnShuffle')?.addEventListener('click', () => player.toggleShuffle());
  $('btnRepeat')?.addEventListener('click', () => player.toggleRepeat());
  $('btnMute')?.addEventListener('click', () => player.toggleMute());

  const volume = $('pbVolume');
  volume?.addEventListener('input', e => player.setVolume(parseFloat(e.target.value)));

  bindSeek($('pbProgress'), ratio => player.seek(ratio));
  bindSeek($('playingProgress'), ratio => player.seek(ratio));

  // Global click delegation for song selection
  document.addEventListener('click', e => {
    const select = e.target.closest('[data-action="select-song"]');
    if (select) {
      const song = getSongById(select.dataset.id);
      if (song) {
        player.load(song, { autoplay: true });
        navigate(getSongUrl(song));
      }
      return;
    }

    const play = e.target.closest('[data-action="play-song"]');
    if (play) {
      const song = getSongById(play.dataset.id);
      if (song) {
        player.load(song, { autoplay: true });
        navigate(getSongUrl(song));
      }
      return;
    }

    const filter = e.target.closest('[data-action="filter-album"]');
    if (filter) {
      setAlbumFilter(filter.dataset.album);
      rerenderCurrent();
      return;
    }

    const togglePlay = e.target.closest('[data-action="toggle-play"]');
    if (togglePlay) {
      player.toggle();
      return;
    }

    const share = e.target.closest('[data-action="share-song"]');
    if (share) { shareCurrent(); return; }

    const copy = e.target.closest('[data-action="copy-link"]');
    if (copy) { copyCurrentLink(); return; }

    const theme = e.target.closest('[data-action="cycle-theme"]');
    if (theme) {
      const next = cycleTheme();
      showToast(t(`toast.theme.${next}`));
      return;
    }

    const lang = e.target.closest('[data-action="toggle-language"]');
    if (lang) {
      toggleLang();
      showToast(t('toast.lang'));
      rerenderCurrent();
      return;
    }

    const reset = e.target.closest('[data-action="reset-player"]');
    if (reset) {
      if (confirm(t('settings.resetConfirm'))) {
        ['sig_last_song', 'sig_recent', 'sig_volume', 'sig_shuffle', 'sig_repeat', 'sig_autoplay', 'sig_reduce_motion']
          .forEach(key => storage.remove(key));
        location.reload();
      }
      return;
    }
  });
}

function bindSeek(el, onSeek) {
  if (!el) return;
  const ratioFrom = e => {
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };
  el.addEventListener('pointerdown', e => {
    el.setPointerCapture(e.pointerId);
    onSeek(ratioFrom(e));
  });
  el.addEventListener('pointermove', e => {
    if (el.hasPointerCapture(e.pointerId)) onSeek(ratioFrom(e));
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); onSeek(Math.min(1, (audio.currentTime / (audio.duration || 1)) + 0.02)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); onSeek(Math.max(0, (audio.currentTime / (audio.duration || 1)) - 0.02)); }
  });
}

/* ---------- player events ---------- */
function handleSongChange(song) {
  $('pbArt').src = getSongArtwork(song);
  $('pbTitle').textContent = song.title;
  $('pbArtist').textContent = `${song.artist} · ${song.album}`;

  // Enrich metadata lazily
  enrichMetadata(song);

  if (currentRoute.name === 'playing') {
    rerenderCurrent();
  }

  updateDocumentMeta();
}

function handlePlayerState(state) {
  const playing = state.playing;
  document.querySelectorAll('.ic-play').forEach(el => { el.hidden = playing; });
  document.querySelectorAll('.ic-pause').forEach(el => { el.hidden = !playing; });

  ['btnPlay'].forEach(id => {
    const el = $(id);
    if (el) {
      el.setAttribute('aria-pressed', String(playing));
      el.setAttribute('aria-label', playing ? t('player.pause') : t('player.play'));
    }
  });

  $('btnShuffle')?.classList.toggle('on', state.shuffle);
  $('btnShuffle')?.setAttribute('aria-pressed', String(state.shuffle));
  $('btnRepeat')?.classList.toggle('on', state.repeat);
  $('btnRepeat')?.setAttribute('aria-pressed', String(state.repeat));

  $('btnMute')?.setAttribute('aria-pressed', String(state.muted));
  $('pbVolume').value = state.volume;

  if (state.extra === 'error') {
    showToast(t('player.error'));
  }
}

function handleTimeUpdate(current, duration) {
  const pct = duration > 0 ? (current / duration) * 100 : 0;
  $('pbProgressFill').style.width = `${pct}%`;
  $('pbProgress')?.setAttribute('aria-valuenow', String(Math.round(pct)));
  $('pbCurrent').textContent = formatDuration(current);
  $('pbDuration').textContent = formatDuration(duration);

  const fill = $('playingProgressFill');
  if (fill) fill.style.width = `${pct}%`;
  const currentEl = $('playingCurrent');
  if (currentEl) currentEl.textContent = formatDuration(current);
  const durEl = $('playingDuration');
  if (durEl) durEl.textContent = formatDuration(duration);
}

/* ---------- metadata enrichment ---------- */
async function enrichMetadata(song) {
  if (song.metadataStatus === 'embedded') return;
  const meta = await loadAudioMetadata(song.audioUrl);
  if (!meta) return;

  const updated = normalizeSongMetadata(song, meta);
  const art = extractArtwork(meta);
  if (art) updated.artworkUrl = art;

  Object.assign(song, updated);

  if (player.current?.id === song.id) {
    $('pbArt').src = getSongArtwork(song);
    if (currentRoute.name === 'playing') rerenderCurrent();
    updateDocumentMeta();
  }
}

/* ---------- SEO ---------- */
function updateDocumentMeta() {
  const song = player.current;
  const base = location.origin;
  const url = song ? base + getSongUrl(song) : base + '/';
  const title = song
    ? `${song.title} — ${song.artist} | Signature Music`
    : 'Signature Music — Music Player';
  const desc = song
    ? `Listen to "${song.title}" from ${song.album} by ${song.artist}.`
    : 'Listen, discover, and enjoy your music with Signature Music.';
  const image = song ? getSongArtwork(song) : DEFAULT_ARTWORK;

  document.title = title;
  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', image);

  const canonical = $('canonicalLink');
  if (canonical) canonical.href = url;
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

/* ---------- share ---------- */
async function shareCurrent() {
  const song = player.current;
  if (!song) return;
  const url = location.origin + getSongUrl(song);
  try {
    if (navigator.share) await navigator.share({ title: song.title, url });
    else { await navigator.clipboard.writeText(url); showToast(t('common.copied')); }
  } catch {
    try { await navigator.clipboard.writeText(url); showToast(t('common.copied')); } catch {}
  }
}

async function copyCurrentLink() {
  const song = player.current;
  if (!song) return;
  try {
    await navigator.clipboard.writeText(location.origin + getSongUrl(song));
    showToast(t('common.copied'));
  } catch {}
}

/* ---------- keyboard ---------- */
function initKeyboard() {
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kIdx = 0;

  document.addEventListener('keydown', e => {
    const tag = e.target?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
    if (typing) { kIdx = 0; return; }

    if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); player.toggle(); }
    else if (e.key === 'ArrowRight') { if (e.shiftKey) player.next(); else audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); }
    else if (e.key === 'ArrowLeft') { if (e.shiftKey) player.prev(); else audio.currentTime = Math.max(0, audio.currentTime - 5); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); player.setVolume(Math.min(1, audio.volume + 0.05)); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); player.setVolume(Math.max(0, audio.volume - 0.05)); }
    else if (e.key === 'm') player.toggleMute();
    else if (e.key === 's') player.toggleShuffle();
    else if (e.key === 'r') player.toggleRepeat();

    if (e.key === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) {
        kIdx = 0;
        activateSignatureMode();
      }
    } else kIdx = 0;
  });
}

/* ---------- easter egg ---------- */
let brandClicks = 0;
let brandTimer;

function initEasterEgg() {
  $('brandBtn')?.addEventListener('click', () => {
    brandClicks++;
    clearTimeout(brandTimer);
    brandTimer = setTimeout(() => { brandClicks = 0; }, 1800);
    if (brandClicks >= 5) {
      brandClicks = 0;
      activateSignatureMode();
    }
  });
}

function activateSignatureMode() {
  document.documentElement.dataset.theme = 'signature';
  showToast(t('toast.easter'));
}

/* ---------- toast ---------- */
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ---------- service worker ---------- */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

/* ---------- boot ---------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Fail-safe skeleton removal
setTimeout(() => {
  if (!document.body.classList.contains('ready')) {
    document.body.classList.add('ready');
    $('skeleton')?.setAttribute('aria-busy', 'false');
  }
}, 3500); 
