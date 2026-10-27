import {
  SONGS,
  getSongById,
  getSongBySlug,
  getAdjacentSong,
  getAllAlbums,
  searchSongs,
  getSongUrl
} from './data-song.js';

(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const audio = $('audio');
  if (!audio) return;

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
    lastVolume: 0.7,
    lastPositionSync: 0
  };

  /* ---------- storage ---------- */
  function loadJSON(key, fb) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } }
  function loadNumber(key, fb) { const n = parseFloat(localStorage.getItem(key)); return Number.isFinite(n) ? n : fb; }
  const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const saveNumber = (k, v) => { try { localStorage.setItem(k, String(v)); } catch {} };

  /* ---------- helpers ---------- */
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const formatTime = sec => {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, '0')}`;
  };
  const setText = (id, t) => { const el = $(id); if (el) el.textContent = t; };

  function showToast(msg) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function announce(msg) { setText('srAnnounce', msg); }
  function showError(msg) { setText('errorText', msg); const b = $('errorBanner'); if (b) b.hidden = false; }
  function hideError() { const b = $('errorBanner'); if (b) b.hidden = true; }

  /* ---------- theme ---------- */
  const THEMES = ['dark', 'light', 'signature'];
  function cycleTheme() {
    const root = document.documentElement;
    const next = THEMES[(THEMES.indexOf(root.dataset.theme || 'dark') + 1) % THEMES.length];
    root.dataset.theme = next;
    try { localStorage.setItem('haiere_theme', next); } catch {}
    applySongColors(state.currentSong);
    showToast(next === 'light' ? '☀️ Mode terang' : next === 'signature' ? '✨ Signature theme' : '🌙 Mode gelap');
  }

  /* ---------- colors (tidak menimpa tema) ---------- */
  function hexToRgba(hex, a) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    if (!m) return `rgba(167,139,250,${a})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  function applySongColors(song) {
    const root = document.documentElement;
    if (!song) {
      root.style.removeProperty('--song-a');
      root.style.removeProperty('--song-b');
      root.style.removeProperty('--song-soft');
      return;
    }
    root.style.setProperty('--song-a', song.colors.primary);
    root.style.setProperty('--song-b', song.colors.secondary);
    root.style.setProperty('--song-soft', hexToRgba(song.colors.primary, 0.14));
  }

  /* ---------- cover fallback (reset per lagu) ---------- */
  function attachCoverFallback(img, fallbackEl, fallbackSrc) {
    if (!img || img.dataset.fbBound) return;
    img.dataset.fbBound = '1';
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') {
        img.hidden = true;
        if (fallbackEl) fallbackEl.hidden = false;
        return;
      }
      img.dataset.fallbackApplied = '1';
      img.src = fallbackSrc || '/assets/default-cover.svg';
    });
  }

  function setCover(img, fallbackEl, song) {
    if (!img) return;
    delete img.dataset.fallbackApplied;   // <-- reset agar lagu berikutnya dicoba lagi
    img.hidden = false;
    if (fallbackEl) fallbackEl.hidden = true;
    img.alt = song ? `Cover ${song.title} — ${song.album}` : '';
    img.src = song?.coverSrc || '/assets/default-cover.svg';
  }

  /* ---------- routing ---------- */
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
    try { history[replace ? 'replaceState' : 'pushState']({ songId: song.id }, '', url); } catch {}
  }

  function handleRoute() {
    const route = parseRoute();
    const nf = $('notFoundState');
    const hero = $('heroSection');

    if (route.type === 'home') {
      if (nf) nf.hidden = true;
      if (hero) hero.hidden = !state.currentSong;
      if (!state.currentSong && SONGS[0]) loadSong(SONGS[0], { autoplay: false, updateUrl: false });
      return;
    }

    if (route.type === 'song') {
      const song = getSongBySlug(route.albumSlug, route.songSlug);
      if (song) {
        if (nf) nf.hidden = true;
        if (hero) hero.hidden = false;
        loadSong(song, { autoplay: false, updateUrl: false });
      } else {
        if (hero) hero.hidden = true;
        if (nf) nf.hidden = false;
        setText('notFoundMessage', 'Lagu yang kamu cari tidak ditemukan. Periksa kembali tautannya.');
        updateDocumentMeta(null);
      }
      return;
    }

    if (hero) hero.hidden = true;
    if (nf) nf.hidden = false;
    setText('notFoundMessage', 'URL tidak valid.');
  }

  /* ---------- dynamic SEO / OG ---------- */
  function setMeta(attr, key, value) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  }

  function updateDocumentMeta(song) {
    const base = location.origin;
    const url = song ? base + getSongUrl(song) : base + '/';
    const siteName = 'Haiere Signature Music';
    const title = song ? `${song.title} — ${song.artist} | ${siteName}` : `${siteName} — Muhaajir | Hi-Res Web Player`;
    const desc = song
      ? `Dengarkan "${song.title}" dari album ${song.album} oleh ${song.artist}. ${song.description || ''}`.trim()
      : 'Stream karya orisinal Muhaajir dalam music player Hi-Res yang premium.';
    const image = song?.coverSrc || 'https://i.postimg.cc/8PJ0bhb1/H-Muhaajir.webp';

    document.title = title;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', song ? 'music.song' : 'music.playlist');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'theme-color', song?.colors.primary || '#080814');

    const canonical = $('canonicalLink');
    if (canonical) canonical.href = url;

    const ld = $('songJsonLd');
    if (ld) {
      ld.textContent = song ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: song.title,
        byArtist: { '@type': 'MusicGroup', name: song.artist },
        inAlbum: { '@type': 'MusicAlbum', name: song.album },
        genre: song.genre,
        datePublished: String(song.year),
        url,
        image
      }) : '';
    }
  }

  /* ---------- render hero ---------- */
  function renderHero(song) {
    if (!song) return;
    applySongColors(song);
    const hero = $('heroSection');
    if (hero) hero.hidden = false;

    setCover($('heroCover'), $('heroCoverFallback'), song);
    setCover($('sideArt'), $('sideArtFallback'), song);
    setCover($('playerArt'), null, song);
    setCover($('miniArt'), null, song);

    setText('heroTitle', song.title);
    setText('heroMeta', `${song.artist} · ${song.album} · ${song.year}`);
    setText('heroDesc', song.description || '');
    setText('sideTitle', song.title);
    setText('sideMeta', `${song.artist} · ${song.album}`);
    setText('playerTitle', song.title);
    setText('playerArtist', song.artist);
    setText('miniTitle', song.title);
    setText('miniArtist', song.artist);

    const tags = $('sideTags');
    if (tags) tags.innerHTML = [song.genre, song.year, song.albumSlug]
      .map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');

    syncFavoriteUI();
  }

  /* ---------- render albums ---------- */
  function renderAlbums() {
    const grid = $('albumGrid');
    if (!grid) return;
    grid.innerHTML = getAllAlbums().map(a => `
      <button class="album-card" data-album="${escapeHtml(a.albumSlug)}" aria-pressed="${state.albumFilter === a.albumSlug}" aria-label="Filter album ${escapeHtml(a.album)}">
        <img class="album-cover" src="${escapeHtml(a.coverSrc)}" alt="Cover album ${escapeHtml(a.album)}" loading="lazy" decoding="async" width="200" height="200" />
        <span class="album-info">
          <span class="album-name">${escapeHtml(a.album)}</span>
          <span class="album-meta">${a.songs.length} lagu · ${a.year}</span>
        </span>
      </button>`).join('');

    grid.querySelectorAll('.album-card').forEach(card => {
      attachCoverFallback(card.querySelector('img'), null, '/assets/default-cover.svg');
      card.addEventListener('click', () => {
        const slug = card.dataset.album;
        state.albumFilter = state.albumFilter === slug ? null : slug;
        state.showFavoritesOnly = false;
        renderAlbums();
        renderSongList();
        $('libraryHeading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const showAll = $('showAllAlbums');
    if (showAll) showAll.hidden = !state.albumFilter;
  }

  /* ---------- render songs ---------- */
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

  function songRowHtml(song) {
    const isCurrent = state.currentSong?.id === song.id;
    const fav = !!state.favorites[song.id];
    return `
      <li>
        <button class="song-item" data-song-id="${escapeHtml(song.id)}" aria-current="${isCurrent}" aria-label="Putar ${escapeHtml(song.title)} oleh ${escapeHtml(song.artist)}${fav ? ', favorit' : ''}">
          <img class="song-thumb" src="${escapeHtml(song.coverSrc)}" alt="" loading="lazy" decoding="async" width="40" height="40" />
          <span class="song-info">
            <span class="song-title">${escapeHtml(song.title)}</span>
            <span class="song-artist">${escapeHtml(song.album)} · ${escapeHtml(song.genre)}</span>
          </span>
          <span class="song-dur" data-dur-for="${escapeHtml(song.id)}">${song.duration ? formatTime(song.duration) : ''}</span>
          <span class="song-fav ${fav ? 'on' : ''}" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>
        </button>
      </li>`;
  }

  function renderSongList() {
    const listEl = $('songList');
    if (!listEl) return;
    const songs = getVisibleSongs();
    setText('songCount', `${songs.length} lagu`);
    const emptyEl = $('queueEmpty');
    if (emptyEl) emptyEl.hidden = songs.length > 0;

    listEl.innerHTML = songs.map(songRowHtml).join('');

    listEl.querySelectorAll('.song-item').forEach(btn => {
      attachCoverFallback(btn.querySelector('.song-thumb'), null, '/assets/default-cover.svg');
      btn.addEventListener('click', () => {
        const song = getSongById(btn.dataset.songId);
        if (!song) return;
        loadSong(song, { autoplay: true, updateUrl: true });
        if (window.innerWidth <= 860) $('heroSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function updateSongDuration(song, dur) {
    const el = document.querySelector(`.song-dur[data-dur-for="${CSS.escape(song.id)}"]`);
    if (el) el.textContent = formatTime(dur);
  }

  /* ---------- favorites ---------- */
  function syncFavoriteUI() {
    const on = state.currentSong ? !!state.favorites[state.currentSong.id] : false;
    ['favBtn', 'playerFav'].forEach(id => {
      const el = $(id);
      if (!el) return;
      el.classList.toggle('on', on);
      el.setAttribute('aria-pressed', String(on));
      el.setAttribute('aria-label', on ? 'Hapus dari favorit' : 'Tambah ke favorit');
    });
    setText('favCount', Object.values(state.favorites).filter(Boolean).length);
  }

  function toggleFavorite(song = state.currentSong) {
    if (!song) return;
    state.favorites[song.id] = !state.favorites[song.id];
    saveJSON('haiere_favorites', state.favorites);
    syncFavoriteUI();
    renderSongList();
    showToast(state.favorites[song.id] ? '❤️ Ditambahkan ke favorit' : '💔 Dihapus dari favorit');
  }

  /* ---------- player ---------- */
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
    updateDocumentMeta(song);
    updateMediaSession(song);
    announce(`Sekarang memutar ${song.title} oleh ${song.artist}`);

    audio.pause();
    audio.src = song.audioSrc;
    audio.load();
    if (updateUrl) pushSongRoute(song);
    if (autoplay) attemptPlay(token);
  }

  function attemptPlay(token) {
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => { if (token === state.loadToken) setPlayingState(true); })
       .catch(() => { if (token === state.loadToken) setPlayingState(false); });
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
      if (!el) return;
      el.setAttribute('aria-pressed', String(playing));
      el.setAttribute('aria-label', playing ? 'Jeda' : 'Putar');
    });
  }

  // Repeat hanya memengaruhi event 'ended', TIDAK memblokir next/prev manual
  function playNext() {
    if (!state.currentSong) return;
    const next = state.shuffle ? getRandomSong() : getAdjacentSong(state.currentSong.id, 1);
    loadSong(next, { autoplay: true, updateUrl: true });
  }

  function playPrev() {
    if (!state.currentSong) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadSong(getAdjacentSong(state.currentSong.id, -1), { autoplay: true, updateUrl: true });
  }

  function getRandomSong() {
    if (SONGS.length <= 1) return SONGS[0];
    let r;
    do { r = SONGS[Math.floor(Math.random() * SONGS.length)]; } while (r.id === state.currentSong?.id);
    return r;
  }

  /* ---------- progress ---------- */
  function updateProgressUI() {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || state.currentSong?.duration || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    const fill = $('progressFill'); if (fill) fill.style.width = `${pct}%`;
    const pFill = $('playerProgressFill'); if (pFill) pFill.style.width = `${pct}%`;

    const text = `${formatTime(cur)} dari ${formatTime(dur)}`;
    ['progressBar', 'playerProgress'].forEach(id => {
      const el = $(id);
      if (!el) return;
      el.setAttribute('aria-valuenow', String(Math.round(pct)));
      el.setAttribute('aria-valuetext', text);
    });

    setText('currentTime', formatTime(cur));
    setText('playerCurrent', formatTime(cur));
    if (dur > 0) { setText('durationTime', formatTime(dur)); setText('playerDuration', formatTime(dur)); }

    // setPositionState maksimal 1x/detik
    const now = performance.now();
    if (now - state.lastPositionSync > 1000 && 'mediaSession' in navigator &&
        'setPositionState' in navigator.mediaSession && dur > 0) {
      state.lastPositionSync = now;
      try {
        navigator.mediaSession.setPositionState({
          duration: dur,
          playbackRate: audio.playbackRate || 1,
          position: Math.min(cur, dur)
        });
      } catch {}
    }
  }

  function seekRatio(ratio) {
    if (!audio.duration) return;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    updateProgressUI();
  }

  function bindSeekBar(el) {
    if (!el) return;
    const ratioFrom = e => {
      const r = el.getBoundingClientRect();
      return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    };

    el.addEventListener('pointerdown', e => {
      el.setPointerCapture(e.pointerId);
      state.seeking = true;
      seekRatio(ratioFrom(e));
    });
    el.addEventListener('pointermove', e => { if (state.seeking) seekRatio(ratioFrom(e)); });
    const end = e => {
      if (!state.seeking) return;
      state.seeking = false;
      if (e) seekRatio(ratioFrom(e));
      try { el.releasePointerCapture(e?.pointerId); } catch {}
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    el.addEventListener('keydown', e => {
      const step = 5;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + step);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - step);
      } else if (e.key === 'Home') { e.preventDefault(); audio.currentTime = 0; }
      else if (e.key === 'End') { e.preventDefault(); audio.currentTime = audio.duration || 0; }
    });
  }

  /* ---------- volume ---------- */
  function applyVolume(v, fromUser = false) {
    const vol = Math.max(0, Math.min(1, Number(v)));
    audio.volume = vol;
    audio.muted = vol === 0;
    state.volume = vol;
    state.muted = audio.muted;
    if (fromUser) saveNumber('haiere_volume', vol);
    ['volumeSlider', 'playerVolume'].forEach(id => {
      const el = $(id); if (el && el.value !== String(vol)) el.value = vol;
    });
    const m = $('muteBtn');
    if (m) {
      m.setAttribute('aria-pressed', String(audio.muted));
      m.setAttribute('aria-label', audio.muted ? 'Bunyikan' : 'Bisukan');
    }
  }

  function toggleMute() {
    if (audio.muted || audio.volume === 0) applyVolume(state.lastVolume || 0.7, true);
    else { state.lastVolume = audio.volume; applyVolume(0, true); }
  }

  /* ---------- media session ---------- */
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
        seekbackward: d => { audio.currentTime = Math.max(0, audio.currentTime - (d.seekOffset || 10)); },
        seekforward: d => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (d.seekOffset || 10)); },
        seekto: d => { audio.currentTime = d.seekTime; }
      };
      for (const [a, fn] of Object.entries(handlers)) {
        try { navigator.mediaSession.setActionHandler(a, fn); } catch {}
      }
    } catch {}
  }

  /* ---------- share / download ---------- */
  async function shareCurrent() {
    const song = state.currentSong;
    if (!song) return;
    const url = new URL(getSongUrl(song), location.origin).href;
    try {
      if (navigator.share) await navigator.share({ title: `${song.title} — ${song.artist}`, url });
      else { await navigator.clipboard.writeText(url); showToast('🔗 Tautan disalin'); }
    } catch {
      try { await navigator.clipboard.writeText(url); showToast('🔗 Tautan disalin'); }
      catch { showToast('Tidak dapat membagikan tautan'); }
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

  /* ---------- audio events ---------- */
  function bindAudioEvents() {
    audio.addEventListener('timeupdate', () => { if (!state.seeking) updateProgressUI(); });
    audio.addEventListener('loadedmetadata', () => {
      if (!state.currentSong || !Number.isFinite(audio.duration)) return;
      state.currentSong.duration = audio.duration;
      setText('durationTime', formatTime(audio.duration));
      setText('playerDuration', formatTime(audio.duration));
      updateSongDuration(state.currentSong, audio.duration);
    });
    audio.addEventListener('play', () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));
    audio.addEventListener('waiting', () => { const b = $('buffering'); if (b) b.hidden = false; });
    ['playing', 'canplay'].forEach(ev => audio.addEventListener(ev, () => { const b = $('buffering'); if (b) b.hidden = true; }));
    audio.addEventListener('ended', () => {
      if (state.repeat) { audio.currentTime = 0; attemptPlay(state.loadToken); }
      else playNext();
    });
    audio.addEventListener('error', () => {
      setPlayingState(false);
      const b = $('buffering'); if (b) b.hidden = true;
      showError('Audio tidak dapat diputar. Periksa koneksi atau coba lagi.');
    });
    audio.addEventListener('volumechange', () => {
      state.muted = audio.muted;
      $('muteBtn')?.setAttribute('aria-pressed', String(audio.muted));
    });
  }

  /* ---------- keyboard ---------- */
  function bindKeyboard() {
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let kIdx = 0;

    document.addEventListener('keydown', e => {
      const target = e.target;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (e.key === 'Escape') { closeVisualizer(); return; }
      if (typing) { kIdx = 0; return; }

      // Konami
      if (e.key === KONAMI[kIdx]) {
        kIdx++;
        if (kIdx === KONAMI.length) { kIdx = 0; cycleTheme(); }
      } else kIdx = 0;

      // Jangan dobel dengan handler slider/seek
      if (e.defaultPrevented) return;

      if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'ArrowRight') { if (e.shiftKey) playNext(); else audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); }
      else if (e.key === 'ArrowLeft') { if (e.shiftKey) playPrev(); else audio.currentTime = Math.max(0, audio.currentTime - 5); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); applyVolume(Math.min(1, (audio.volume || 0) + 0.05), true); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); applyVolume(Math.max(0, (audio.volume || 0) - 0.05), true); }
      else if (e.key === 'f') toggleFavorite();
      else if (e.key === 's') toggleShuffle();
      else if (e.key === 'r') toggleRepeat();
      else if (e.key === 'm') toggleMute();
    });
  }

  function toggleShuffle() {
    state.shuffle = !state.shuffle;
    ['shuffleBtn', 'playerShuffle'].forEach(id => {
      const el = $(id);
      if (el) { el.classList.toggle('on', state.shuffle); el.setAttribute('aria-pressed', String(state.shuffle)); }
    });
    showToast(state.shuffle ? '🔀 Acak aktif' : '🔀 Acak nonaktif');
  }

  function toggleRepeat() {
    state.repeat = !state.repeat;
    ['repeatBtn', 'playerRepeat'].forEach(id => {
      const el = $(id);
      if (el) { el.classList.toggle('on', state.repeat); el.setAttribute('aria-pressed', String(state.repeat)); }
    });
    showToast(state.repeat ? '🔁 Ulangi aktif' : '🔁 Ulangi nonaktif');
  }

  /* ---------- easter egg ---------- */
  let audioCtx = null, analyser = null, sourceNode = null, visRaf = null;

  function initVisualizer() {
    const overlay = $('visualizerOverlay');
    const canvas = $('visualizerCanvas');
    if (!overlay || !canvas) return;
    overlay.hidden = false;
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error('AudioContext unsupported');
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (!sourceNode) {
        // analyser dibuat lebih dulu agar audio tidak pernah tersambung ke node mati
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        sourceNode = audioCtx.createMediaElementSource(audio);
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
    const bars = 64;
    const step = Math.floor(data.length / bars);
    const barW = canvas.width / bars;

    const loop = () => {
      visRaf = requestAnimationFrame(loop);
      analyser.getByteFrequencyData(data);
      ctx.fillStyle = 'rgba(5,5,15,0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < bars; i++) {
        const h = (data[i * step] / 255) * canvas.height * 0.65;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - h);
        grad.addColorStop(0, 'rgba(167,139,250,0.9)');
        grad.addColorStop(1, 'rgba(96,165,250,0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(i * barW + 2, canvas.height - h, barW - 4, h);
      }
    };
    loop();
  }

  function closeVisualizer() {
    const overlay = $('visualizerOverlay');
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    cancelAnimationFrame(visRaf);
    visRaf = null;
  }

  function bindEasterEgg() {
    let clicks = 0, timer;
    $('brandLogo')?.addEventListener('click', () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 1800);
      if (clicks >= 5) { clicks = 0; initVisualizer(); }
    });
    $('visualizerClose')?.addEventListener('click', closeVisualizer);
    $('visualizerOverlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeVisualizer(); });
  }

  /* ---------- search ---------- */
  function bindSearch() {
    const input = $('searchInput');
    const clear = $('searchClear');
    if (!input) return;
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.query = input.value.trim();
        state.showFavoritesOnly = false;
        if (clear) clear.hidden = !state.query;
        renderSongList();
      }, 160);
    });
    clear?.addEventListener('click', () => {
      input.value = '';
      state.query = '';
      clear.hidden = true;
      renderSongList();
      input.focus();
    });
  }

  /* ---------- sw ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  /* ---------- init ---------- */
  function init() {
    attachCoverFallback($('heroCover'), $('heroCoverFallback'), '/assets/default-cover.svg');
    attachCoverFallback($('sideArt'), $('sideArtFallback'), '/assets/default-cover.svg');
    attachCoverFallback($('playerArt'), null, '/assets/default-cover.svg');
    attachCoverFallback($('miniArt'), null, '/assets/default-cover.svg');

    $('playBtn')?.addEventListener('click', togglePlay);
    $('playerPlay')?.addEventListener('click', togglePlay);
    $('miniPlay')?.addEventListener('click', togglePlay);
    $('prevBtn')?.addEventListener('click', playPrev);
    $('playerPrev')?.addEventListener('click', playPrev);
    $('nextBtn')?.addEventListener('click', playNext);
    $('playerNext')?.addEventListener('click', playNext);
    $('shuffleBtn')?.addEventListener('click', toggleShuffle);
    $('playerShuffle')?.addEventListener('click', toggleShuffle);
    $('repeatBtn')?.addEventListener('click', toggleRepeat);
    $('playerRepeat')?.addEventListener('click', toggleRepeat);
    $('favBtn')?.addEventListener('click', () => toggleFavorite());
    $('playerFav')?.addEventListener('click', () => toggleFavorite());

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
      $('filterFavBtn')?.setAttribute('aria-pressed', String(state.showFavoritesOnly));
      renderSongList();
    });

    ['volumeSlider', 'playerVolume'].forEach(id => {
      $(id)?.addEventListener('input', e => applyVolume(parseFloat(e.target.value), true));
    });
    applyVolume(state.volume);

    bindSeekBar($('progressBar'));
    bindSeekBar($('playerProgress'));

    bindAudioEvents();
    bindSearch();
    bindKeyboard();
    bindEasterEgg();
    registerSW();

    renderAlbums();
    renderSongList();
    syncFavoriteUI();

    addEventListener('popstate', handleRoute);
    handleRoute();

    if (!state.currentSong && SONGS[0]) loadSong(SONGS[0], { autoplay: false, updateUrl: false });

    requestAnimationFrame(() => {
      document.body.classList.add('ready');
      $('skeleton')?.setAttribute('aria-busy', 'false');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  setTimeout(() => {
    if (!document.body.classList.contains('ready')) {
      document.body.classList.add('ready');
      $('skeleton')?.setAttribute('aria-busy', 'false');
    }
  }, 3500);
})();
