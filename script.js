import {
  SONGS,
  getSongById,
  getSongBySlug,
  getAdjacentSong,
  getAllAlbums,
  getAlbumBySlug,
  searchSongs,
  getSongUrl
} from './data-song.js';

(() => {
  'use strict';

  /* ================= STATE ================= */
  const $ = id => document.getElementById(id);

  const state = {
    currentSong: null,
    isPlaying: false,
    shuffle: false,
    repeat: false,
    favorites: loadJSON('haiere_favorites', {}),
    volume: loadNumber('haiere_volume', 0.7),
    query: '',
    albumFilter: null,
    showFavoritesOnly: false,
    loadToken: 0,
    seeking: false,
    muted: false,
    lastVolume: 0.7
  };

  const audio = $('audio');
  if (!audio) return;

  /* ================= STORAGE ================= */
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function loadNumber(key, fallback) {
    const n = parseFloat(localStorage.getItem(key));
    return Number.isFinite(n) ? n : fallback;
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
  function saveNumber(key, value) {
    try { localStorage.setItem(key, String(value)); } catch {}
  }

  /* ================= HELPERS ================= */
  const escapeHtml = str => String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const formatTime = sec => {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  function showToast(msg) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function showError(msg) {
    const b = $('errorBanner');
    const txt = $('errorText');
    if (!b || !txt) return;
    txt.textContent = msg;
    b.hidden = false;
  }
  function hideError() {
    const b = $('errorBanner');
    if (b) b.hidden = true;
  }

  /* ================= THEME ================= */
  function cycleTheme() {
    const root = document.documentElement;
    const order = ['dark', 'light', 'signature'];
    const current = root.dataset.theme || 'dark';
    const next = order[(order.indexOf(current) + 1) % order.length];
    root.dataset.theme = next;
    try { localStorage.setItem('haiere_theme', next); } catch {}
    showToast(next === 'light' ? '☀️ Mode terang' : next === 'signature' ? '✨ Signature theme' : '🌙 Mode gelap');
  }

  /* ================= COVER FALLBACK ================= */
  function attachCoverFallback(img, fallbackEl, fallbackSrc) {
    if (!img) return;
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) {
        img.hidden = true;
        if (fallbackEl) fallbackEl.hidden = false;
        return;
      }
      img.dataset.fallbackApplied = '1';
      img.src = fallbackSrc || '/assets/default-cover.svg';
    }, { once: false });
  }

  function setCover(img, fallbackEl, song, alt) {
    if (!img) return;
    img.hidden = false;
    if (fallbackEl) fallbackEl.hidden = true;
    img.alt = alt || (song ? `Cover ${song.title} — ${song.album}` : '');
    img.src = song?.coverSrc || '/assets/default-cover.svg';
  }

  /* ================= ROUTING ================= */
  function parseRoute() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/') return { type: 'home' };
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'playing' && parts.length >= 3) {
      return { type: 'song', albumSlug: decodeURIComponent(parts[1]), songSlug: decodeURIComponent(parts[2]) };
    }
    return { type: 'unknown' };
  }

  function pushSongRoute(song, replace = false) {
    if (!song) return;
    const url = getSongUrl(song);
    if (location.pathname === url) return;
    try {
      history[replace ? 'replaceState' : 'pushState']({ songId: song.id }, '', url);
    } catch {}
  }

  function handleRoute({ initial = false } = {}) {
    const route = parseRoute();
    hideNotFound();

    if (route.type === 'home') {
      if (!state.currentSong && SONGS[0]) loadSong(SONGS[0], { autoplay: false, updateUrl: false });
      return;
    }

    if (route.type === 'song') {
      const song = getSongBySlug(route.albumSlug, route.songSlug);
      if (song) {
        loadSong(song, { autoplay: false, updateUrl: false });
      } else {
        showNotFound('Lagu yang kamu cari tidak ditemukan. Periksa kembali tautannya.');
      }
      return;
    }

    showNotFound('URL tidak valid.');
    if (!initial && SONGS[0]) loadSong(SONGS[0], { autoplay: false, updateUrl: false });
  }

  function showNotFound(message) {
    const hero = $('heroSection');
    const nf = $('notFoundState');
    const msg = $('notFoundMessage');
    if (hero) hero.hidden = true;
    if (nf) nf.hidden = false;
    if (msg && message) msg.textContent = message;
  }
  function hideNotFound() {
    const hero = $('heroSection');
    const nf = $('notFoundState');
    if (hero) hero.hidden = false;
    if (nf) nf.hidden = true;
  }

  /* ================= RENDER: HERO ================= */
  function renderHero(song) {
    if (!song) return;
    const root = document.documentElement;
    root.style.setProperty('--accent', song.colors.primary);
    root.style.setProperty('--accent-2', song.colors.secondary);
    root.style.setProperty('--accent-soft', hexToRgba(song.colors.primary, 0.14));

    setCover($('heroCover'), $('heroCoverFallback'), song);
    setText('heroTitle', song.title);
    setText('heroMeta', `${song.artist} · ${song.album} · ${song.year}`);
    setText('heroDesc', song.description || '');

    setCover($('sideArt'), $('sideArtFallback'), song);
    setText('sideTitle', song.title);
    setText('sideMeta', `${song.artist} · ${song.album}`);

    const tags = $('sideTags');
    if (tags) {
      tags.innerHTML = [song.genre, song.year, song.albumSlug]
        .map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    }

    setCover($('playerArt'), null, song);
    setText('playerTitle', song.title);
    setText('playerArtist', song.artist);

    setCover($('miniArt'), null, song);
    setText('miniTitle', song.title);
    setText('miniArtist', song.artist);

    syncFavoriteUI();
  }

  function hexToRgba(hex, alpha) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    if (!m) return `rgba(167,139,250,${alpha})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${alpha})`;
  }
  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  /* ================= RENDER: ALBUMS ================= */
  function renderAlbums() {
    const grid = $('albumGrid');
    if (!grid) return;
    const albums = getAllAlbums();
    grid.innerHTML = albums.map(a => `
      <button class="album-card" data-album="${escapeHtml(a.albumSlug)}" aria-pressed="${state.albumFilter === a.albumSlug ? 'true' : 'false'}" aria-label="Filter album ${escapeHtml(a.album)}">
        <img class="album-cover" src="${escapeHtml(a.coverSrc)}" alt="Cover album ${escapeHtml(a.album)}" loading="lazy" decoding="async" width="200" height="200" />
        <span class="album-info">
          <span class="album-name">${escapeHtml(a.album)}</span>
          <span class="album-meta">${a.songs.length} lagu · ${a.year}</span>
        </span>
      </button>
    `).join('');

    grid.querySelectorAll('.album-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.album;
        state.albumFilter = state.albumFilter === slug ? null : slug;
        state.showFavoritesOnly = false;
        renderAlbums();
        renderSongList();
        const heading = $('libraryHeading');
        if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const img = card.querySelector('img');
      attachCoverFallback(img, null, '/assets/default-cover.svg');
    });

    const showAll = $('showAllAlbums');
    if (showAll) showAll.hidden = !state.albumFilter;
  }

  /* ================= RENDER: SONG LIST ================= */
  function getVisibleSongs() {
    let list = SONGS.slice();
    if (state.albumFilter) list = list.filter(s => s.albumSlug === state.albumFilter);
    if (state.showFavoritesOnly) list = list.filter(s => state.favorites[s.id]);
    if (state.query) {
      const ids = new Set(searchSongs(state.query).map(s => s.id));
      list = list.filter(s => ids.has(s.id));
    }
    return list;
  }

  function renderSongList() {
    const listEl = $('songList');
    const emptyEl = $('queueEmpty');
    const countEl = $('songCount');
    if (!listEl) return;

    const songs = getVisibleSongs();
    if (countEl) countEl.textContent = `${songs.length} lagu`;
    if (emptyEl) emptyEl.hidden = songs.length > 0;

    listEl.innerHTML = songs.map(song => {
      const isCurrent = state.currentSong?.id === song.id;
      const fav = !!state.favorites[song.id];
      return `
        <li>
          <button class="song-item" data-song-id="${escapeHtml(song.id)}" aria-current="${isCurrent ? 'true' : 'false'}" aria-label="Putar ${escapeHtml(song.title)} oleh ${escapeHtml(song.artist)}">
            <img class="song-thumb" src="${escapeHtml(song.coverSrc)}" alt="" loading="lazy" decoding="async" width="40" height="40" />
            <span class="song-info">
              <span class="song-title">${escapeHtml(song.title)}</span>
              <span class="song-artist">${escapeHtml(song.album)} · ${escapeHtml(song.genre)}</span>
            </span>
            <span class="song-dur">${song.duration ? formatTime(song.duration) : ''}</span>
            <span class="song-fav ${fav ? 'on' : ''}" role="img" aria-label="${fav ? 'Favorit' : 'Bukan favorit'}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </span>
          </button>
        </li>
      `;
    }).join('');

    listEl.querySelectorAll('.song-item').forEach(btn => {
      const img = btn.querySelector('.song-thumb');
      attachCoverFallback(img, null, '/assets/default-cover.svg');
      btn.addEventListener('click', () => {
        const song = getSongById(btn.dataset.songId);
        if (song) {
          loadSong(song, { autoplay: true, updateUrl: true });
          if (window.innerWidth <= 860) $('heroSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ================= FAVORITES ================= */
  function syncFavoriteUI() {
    const id = state.currentSong?.id;
    const on = id ? !!state.favorites[id] : false;
    ['favBtn', 'playerFav'].forEach(elId => {
      const el = $(elId);
      if (el) {
        el.classList.toggle('on', on);
        el.setAttribute('aria-pressed', String(on));
        el.setAttribute('aria-label', on ? 'Hapus dari favorit' : 'Tambah ke favorit');
      }
    });
    const count = Object.values(state.favorites).filter(Boolean).length;
    const countEl = $('favCount');
    if (countEl) countEl.textContent = count;
  }

  function toggleFavorite(song = state.currentSong) {
    if (!song) return;
    state.favorites[song.id] = !state.favorites[song.id];
    saveJSON('haiere_favorites', state.favorites);
    syncFavoriteUI();
    renderSongList();
    showToast(state.favorites[song.id] ? '❤️ Ditambahkan ke favorit' : '💔 Dihapus dari favorit');
  }

  /* ================= PLAYER ================= */
  function loadSong(song, { autoplay = false, updateUrl = true } = {}) {
    if (!song) return;
    if (state.currentSong?.id === song.id && audio.src) {
      if (autoplay) attemptPlay(state.loadToken);
      if (updateUrl) pushSongRoute(song);
      return;
    }

    const token = ++state.loadToken;
    state.currentSong = song;
    hideError();
    renderHero(song);
    renderSongList();
    updateMediaSession(song);

    audio.pause();
    audio.src = song.audioSrc;
    audio.load();

    if (updateUrl) pushSongRoute(song);

    if (autoplay) attemptPlay(token);

    // Restore duration if cached
    if (song.duration > 0) updateDurationDisplay(song.duration);
  }

  function attemptPlay(token) {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        if (token !== state.loadToken) return;
        setPlayingState(true);
      }).catch(() => {
        if (token !== state.loadToken) return;
        setPlayingState(false);
        showToast('Tekan tombol putar untuk memulai');
      });
    }
  }

  function togglePlay() {
    if (!state.currentSong) return;
    if (audio.paused) {
      attemptPlay(state.loadToken);
      if (!location.pathname.startsWith('/playing/')) pushSongRoute(state.currentSong);
    } else {
      audio.pause();
    }
  }

  function setPlayingState(playing) {
    state.isPlaying = playing;
    document.querySelectorAll('.ic-play').forEach(el => { el.hidden = playing; });
    document.querySelectorAll('.ic-pause').forEach(el => { el.hidden = !playing; });
    ['playBtn', 'playerPlay', 'miniPlay'].forEach(id => {
      const el = $(id);
      if (el) {
        el.setAttribute('aria-pressed', String(playing));
        el.setAttribute('aria-label', playing ? 'Jeda' : 'Putar');
      }
    });
  }

  function playNext() {
    if (!state.currentSong) return;
    if (state.repeat) {
      audio.currentTime = 0;
      attemptPlay(state.loadToken);
      return;
    }
    const next = state.shuffle ? getRandomSong() : getAdjacentSong(state.currentSong.id, 1);
    loadSong(next, { autoplay: true, updateUrl: true });
  }

  function playPrev() {
    if (!state.currentSong) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prev = getAdjacentSong(state.currentSong.id, -1);
    loadSong(prev, { autoplay: true, updateUrl: true });
  }

  function getRandomSong() {
    if (SONGS.length <= 1) return SONGS[0];
    let r;
    do { r = SONGS[Math.floor(Math.random() * SONGS.length)]; }
    while (r.id === state.currentSong?.id);
    return r;
  }

  /* ================= PROGRESS ================= */
  function updateProgressUI() {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || state.currentSong?.duration || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    const fill = $('progressFill');
    const pFill = $('playerProgressFill');
    if (fill) fill.style.width = `${pct}%`;
    if (pFill) pFill.style.width = `${pct}%`;

    const bar = $('progressBar');
    const pBar = $('playerProgress');
    if (bar) bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    if (pBar) pBar.setAttribute('aria-valuenow', String(Math.round(pct)));

    setText('currentTime', formatTime(cur));
    setText('playerCurrent', formatTime(cur));
    if (dur > 0) updateDurationDisplay(dur);

    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && dur > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: dur,
          playbackRate: audio.playbackRate || 1,
          position: Math.min(cur, dur)
        });
      } catch {}
    }
  }

  function updateDurationDisplay(dur) {
    setText('durationTime', formatTime(dur));
    setText('playerDuration', formatTime(dur));
  }

  function seekRatio(ratio) {
    if (!audio.duration) return;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    updateProgressUI();
  }

  function bindSeekBar(el) {
    if (!el) return;
    const onPointer = e => {
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seekRatio(ratio);
    };
    el.addEventListener('click', onPointer);
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      } else if (e.key === 'Home') {
        e.preventDefault(); audio.currentTime = 0;
      } else if (e.key === 'End') {
        e.preventDefault(); audio.currentTime = audio.duration || 0;
      }
    });
  }

  /* ================= VOLUME ================= */
  function applyVolume(v, fromUser = false) {
    const vol = Math.max(0, Math.min(1, Number(v)));
    audio.volume = vol;
    audio.muted = vol === 0;
    state.volume = vol;
    state.muted = audio.muted;
    if (fromUser) saveNumber('haiere_volume', vol);
    ['volumeSlider', 'playerVolume'].forEach(id => {
      const el = $(id);
      if (el && el.value !== String(vol)) el.value = vol;
    });
    const muteBtn = $('muteBtn');
    if (muteBtn) {
      muteBtn.setAttribute('aria-pressed', String(audio.muted));
      muteBtn.setAttribute('aria-label', audio.muted ? 'Bunyikan' : 'Bisukan');
    }
  }

  function toggleMute() {
    if (audio.muted || audio.volume === 0) {
      applyVolume(state.lastVolume || 0.7, true);
    } else {
      state.lastVolume = audio.volume;
      applyVolume(0, true);
    }
  }

  /* ================= MEDIA SESSION ================= */
  function updateMediaSession(song) {
    if (!('mediaSession' in navigator) || !song) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [{ src: song.coverSrc, sizes: '512x512', type: 'image/webp' }]
      });
      const handlers = {
        play: () => attemptPlay(state.loadToken),
        pause: () => audio.pause(),
        previoustrack: playPrev,
        nexttrack: playNext,
        seekbackward: (d) => { audio.currentTime = Math.max(0, audio.currentTime - (d.seekOffset || 10)); },
        seekforward: (d) => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (d.seekOffset || 10)); },
        seekto: (d) => {
          if (d.fastSeek && 'fastSeek' in audio) audio.fastSeek(d.seekTime);
          else audio.currentTime = d.seekTime;
        }
      };
      for (const [action, fn] of Object.entries(handlers)) {
        try { navigator.mediaSession.setActionHandler(action, fn); } catch {}
      }
    } catch {}
  }

  /* ================= SHARE / DOWNLOAD ================= */
  async function shareCurrent() {
    const song = state.currentSong;
    if (!song) return;
    const url = new URL(getSongUrl(song), location.origin).href;
    const shareData = { title: `${song.title} — ${song.artist}`, text: `Dengarkan ${song.title} di Haiere Signature Music`, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        showToast('🔗 Tautan disalin');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        showToast('🔗 Tautan disalin');
      } catch {
        showToast('Tidak dapat membagikan tautan');
      }
    }
  }

  function downloadCurrent() {
    const song = state.currentSong;
    if (!song) return;
    const a = document.createElement('a');
    a.href = song.audioSrc;
    a.download = `${song.artist} - ${song.title}.opus`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('⬇️ Mengunduh…');
  }

  /* ================= SEARCH / FILTERS ================= */
  function bindSearch() {
    const input = $('searchInput');
    const clear = $('searchClear');
    if (!input) return;
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.query = input.value.trim();
        state.showFavoritesOnly = false;
        if (clear) clear.hidden = !state.query;
        renderSongList();
      }, 160);
    });
    if (clear) {
      clear.addEventListener('click', () => {
        input.value = '';
        state.query = '';
        clear.hidden = true;
        renderSongList();
        input.focus();
      });
    }
  }

  /* ================= AUDIO EVENTS ================= */
  function bindAudioEvents() {
    audio.addEventListener('timeupdate', () => {
      if (!state.seeking) updateProgressUI();
    });
    audio.addEventListener('loadedmetadata', () => {
      if (state.currentSong && Number.isFinite(audio.duration)) {
        state.currentSong.duration = audio.duration;
        updateDurationDisplay(audio.duration);
        renderSongList();
      }
    });
    audio.addEventListener('play', () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));
    audio.addEventListener('waiting', () => { const b = $('buffering'); if (b) b.hidden = false; });
    audio.addEventListener('playing', () => { const b = $('buffering'); if (b) b.hidden = true; });
    audio.addEventListener('canplay', () => { const b = $('buffering'); if (b) b.hidden = true; });
    audio.addEventListener('ended', () => {
      if (state.repeat) {
        audio.currentTime = 0;
        attemptPlay(state.loadToken);
      } else {
        playNext();
      }
    });
    audio.addEventListener('error', () => {
      setPlayingState(false);
      showError('Audio tidak dapat diputar. Periksa koneksi atau coba lagi.');
      const b = $('buffering'); if (b) b.hidden = true;
    });
    audio.addEventListener('volumechange', () => {
      state.muted = audio.muted;
      const muteBtn = $('muteBtn');
      if (muteBtn) muteBtn.setAttribute('aria-pressed', String(audio.muted));
    });
  }

  /* ================= KEYBOARD ================= */
  function bindKeyboard() {
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', e => {
      const tag = e.target?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;

      // Konami code
      if (e.key === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length) {
          konamiIndex = 0;
          cycleTheme();
        }
      } else {
        konamiIndex = 0;
      }

      if (typing) return;

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault(); togglePlay();
      } else if (e.key === 'ArrowRight') {
        if (e.shiftKey) { playNext(); } else { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); }
      } else if (e.key === 'ArrowLeft') {
        if (e.shiftKey) { playPrev(); } else { audio.currentTime = Math.max(0, audio.currentTime - 5); }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); applyVolume(Math.min(1, (audio.volume || 0) + 0.05), true);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); applyVolume(Math.max(0, (audio.volume || 0) - 0.05), true);
      } else if (e.key === 'f') {
        toggleFavorite();
      } else if (e.key === 's') {
        toggleShuffle();
      } else if (e.key === 'r') {
        toggleRepeat();
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'Escape') {
        closeVisualizer();
      }
    });
  }

  /* ================= SHUFFLE / REPEAT ================= */
  function toggleShuffle() {
    state.shuffle = !state.shuffle;
    ['shuffleBtn', 'playerShuffle'].forEach(id => {
      const el = $(id);
      if (el) {
        el.classList.toggle('on', state.shuffle);
        el.setAttribute('aria-pressed', String(state.shuffle));
      }
    });
    showToast(state.shuffle ? '🔀 Acak aktif' : '🔀 Acak nonaktif');
  }

  function toggleRepeat() {
    state.repeat = !state.repeat;
    ['repeatBtn', 'playerRepeat'].forEach(id => {
      const el = $(id);
      if (el) {
        el.classList.toggle('on', state.repeat);
        el.setAttribute('aria-pressed', String(state.repeat));
      }
    });
    showToast(state.repeat ? '🔁 Ulangi aktif' : '🔁 Ulangi nonaktif');
  }

  /* ================= EASTER EGG: VISUALIZER ================= */
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let visRaf = null;

  function initVisualizer() {
    const overlay = $('visualizerOverlay');
    const canvas = $('visualizerCanvas');
    if (!overlay || !canvas) return;
    overlay.hidden = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error('AudioContext unsupported');
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (!sourceNode) {
        sourceNode = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
      }
      drawVisualizer();
    } catch {
      showToast('Visualizer tidak tersedia di browser ini');
      overlay.hidden = true;
    }
  }

  function drawVisualizer() {
    const canvas = $('visualizerCanvas');
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    const data = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      visRaf = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      ctx.fillStyle = 'rgba(5,5,15,0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const bars = 64;
      const step = Math.floor(data.length / bars);
      const barW = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const v = data[i * step] / 255;
        const h = v * canvas.height * 0.65;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - h);
        grad.addColorStop(0, 'rgba(167,139,250,0.9)');
        grad.addColorStop(1, 'rgba(96,165,250,0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(i * barW + 2, canvas.height - h, barW - 4, h);
      }
    };
    draw();
  }

  function closeVisualizer() {
    const overlay = $('visualizerOverlay');
    if (overlay) overlay.hidden = true;
    cancelAnimationFrame(visRaf);
    visRaf = null;
  }

  function bindEasterEgg() {
    let clicks = 0;
    let timer;
    $('brandLogo')?.addEventListener('click', () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 1800);
      if (clicks >= 5) {
        clicks = 0;
        initVisualizer();
      }
    });
    $('visualizerClose')?.addEventListener('click', closeVisualizer);
    $('visualizerOverlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeVisualizer();
    });
  }

  /* ================= SERVICE WORKER ================= */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  /* ================= INIT ================= */
  function init() {
    // Attach cover fallbacks
    attachCoverFallback($('heroCover'), $('heroCoverFallback'), '/assets/default-cover.svg');
    attachCoverFallback($('sideArt'), $('sideArtFallback'), '/assets/default-cover.svg');
    attachCoverFallback($('playerArt'), null, '/assets/default-cover.svg');
    attachCoverFallback($('miniArt'), null, '/assets/default-cover.svg');

    // Controls
    [['playBtn', togglePlay], ['playerPlay', togglePlay], ['miniPlay', togglePlay]].forEach(([id, fn]) => {
      $(id)?.addEventListener('click', fn);
    });
    [['prevBtn', playPrev], ['playerPrev', playPrev]].forEach(([id, fn]) => $(id)?.addEventListener('click', fn));
    [['nextBtn', playNext], ['playerNext', playNext]].forEach(([id, fn]) => $(id)?.addEventListener('click', fn));
    [['shuffleBtn', toggleShuffle], ['playerShuffle', toggleShuffle]].forEach(([id, fn]) => $(id)?.addEventListener('click', fn));
    [['repeatBtn', toggleRepeat], ['playerRepeat', toggleRepeat]].forEach(([id, fn]) => $(id)?.addEventListener('click', fn));
    [['favBtn', () => toggleFavorite()], ['playerFav', () => toggleFavorite()]].forEach(([id, fn]) => $(id)?.addEventListener('click', fn));

    $('shareBtn')?.addEventListener('click', shareCurrent);
    $('downloadBtn')?.addEventListener('click', downloadCurrent);
    $('muteBtn')?.addEventListener('click', toggleMute);
    $('errorRetry')?.addEventListener('click', () => { hideError(); attemptPlay(state.loadToken); });
    $('errorClose')?.addEventListener('click', hideError);
    $('miniOpen')?.addEventListener('click', () => $('heroSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $('themeToggle')?.addEventListener('click', cycleTheme);
    $('showAllAlbums')?.addEventListener('click', () => { state.albumFilter = null; renderAlbums(); renderSongList(); });
    $('filterFavBtn')?.addEventListener('click', () => {
      state.showFavoritesOnly = !state.showFavoritesOnly;
      state.albumFilter = null;
      const btn = $('filterFavBtn');
      if (btn) btn.setAttribute('aria-pressed', String(state.showFavoritesOnly));
      renderSongList();
    });

    // Volume
    ['volumeSlider', 'playerVolume'].forEach(id => {
      $(id)?.addEventListener('input', e => applyVolume(parseFloat(e.target.value), true));
    });
    applyVolume(state.volume);

    // Seek bars
    bindSeekBar($('progressBar'));
    bindSeekBar($('playerProgress'));

    bindAudioEvents();
    bindSearch();
    bindKeyboard();
    bindEasterEgg();
    registerSW();

    // Render
    renderAlbums();
    renderSongList();
    syncFavoriteUI();

    // Routing
    window.addEventListener('popstate', () => handleRoute());
    handleRoute({ initial: true });

    if (!state.currentSong && SONGS[0]) {
      loadSong(SONGS[0], { autoplay: false, updateUrl: false });
    }

    // Hide skeleton
    requestAnimationFrame(() => {
      document.body.classList.add('ready');
      const skeleton = $('skeleton');
      if (skeleton) skeleton.setAttribute('aria-busy', 'false');
      const root = $('appRoot');
      if (root) root.removeAttribute('aria-hidden');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Fail-safe: never leave the skeleton stuck
  setTimeout(() => {
    if (!document.body.classList.contains('ready')) {
      document.body.classList.add('ready');
      const skeleton = $('skeleton');
      if (skeleton) skeleton.setAttribute('aria-busy', 'false');
    }
  }, 3500);
})();
