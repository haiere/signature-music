import { SONGS } from './data-song.js';

(function() {
    'use strict';

    // ==================== STATE ====================
    let currentIndex = 0;
    let isPlaying = false;
    let shuffleMode = false;
    let repeatMode = false;
    let favorites = JSON.parse(localStorage.getItem('haiere_fav')) || {};
    let sleepEnd = null;
    let sleepInterval = null;
    let plFilter = 'all';
    let isInteracted = false;
    let fadeRaf = null;

    const aud = document.getElementById('aud');
    const $ = id => document.getElementById(id);

    // ==================== TOAST ====================
    let toastTimeout;
    function showToast(msg) {
        const el = $('toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => el.classList.remove('show'), 2600);
    }

    // ==================== COVER ART ====================
    const coverCache = new Map();
    function drawCover(canvas, url, size) {
        if (!canvas) return;
        const sz = size || canvas.parentElement?.clientWidth || 300;
        canvas.width = sz;
        canvas.height = sz;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#12122a';
        ctx.fillRect(0, 0, sz, sz);
        if (!url) return;
        if (coverCache.has(url)) {
            const img = coverCache.get(url);
            if (img.complete && img.naturalWidth) {
                ctx.drawImage(img, 0, 0, sz, sz);
                return;
            }
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            coverCache.set(url, img);
            ctx.drawImage(img, 0, 0, sz, sz);
        };
        img.src = url;
    }

    function updateAllCovers(index) {
        const s = SONGS[index];
        if (!s) return;
        drawCover($('artCv'), s.cover, $('artCv')?.parentElement?.clientWidth || 320);
        drawCover($('bpCv'), s.cover, 40);
        drawCover($('dpArtCv'), s.cover, 46);
        drawCover($('sbNowCv'), s.cover, $('sbNowCv')?.parentElement?.clientWidth || 180);
    }

    // ==================== LOAD SONG ====================
    function loadSong(index, autoPlay) {
        const s = SONGS[index];
        if (!s) return;
        currentIndex = index;
        $('npTitle').textContent = s.name;
        $('npAlbum').textContent = s.group + ' · Muhaajir';
        $('bpTitle').textContent = s.name;
        $('bpSub').textContent = s.group;
        $('dpTitle').textContent = s.name;
        $('dpSub').textContent = s.group + ' · Muhaajir';
        $('sbNowTitle').textContent = s.name;
        $('sbNowSub').textContent = s.group;
        $('modalSub').textContent = '"' + s.name + '"';
        const opt = $('optCatbox');
        if (opt) opt.dataset.url = s.url;

        updateAllCovers(index);
        syncFavButton();

        aud.src = s.url;
        aud.load();
        if (autoPlay && isInteracted) {
            aud.play().catch(() => {});
        }
        updatePlaylistHighlight();
        updateMediaSession(s);
        saveState();
    }

    // ==================== PLAY / PAUSE ====================
    function togglePlay() {
        isInteracted = true;
        if (aud.paused) {
            aud.volume = 0;
            aud.play().then(() => {
                isPlaying = true;
                fadeTo(getVol(), 400);
                updatePlayButtons();
            }).catch(() => {});
        } else {
            fadeTo(0, 320, () => {
                aud.pause();
                aud.volume = getVol();
                isPlaying = false;
                updatePlayButtons();
            });
        }
    }

    function fadeTo(to, dur, cb) {
        cancelAnimationFrame(fadeRaf);
        const from = aud.volume;
        if (Math.abs(to - from) < 0.004) { aud.volume = to; cb && cb(); return; }
        let t0 = null;
        function step(ts) {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            aud.volume = from + (to - from) * p;
            if (p < 1) { fadeRaf = requestAnimationFrame(step); } 
            else { aud.volume = to; cb && cb(); }
        }
        fadeRaf = requestAnimationFrame(step);
    }

    function getVol() { return parseFloat($('volSl')?.value || 0.7); }

    function updatePlayButtons() {
        const playing = !aud.paused && aud.currentTime > 0;
        isPlaying = playing;
        const icons = ['playSvg', 'bpPlaySvg', 'dpPlaySvg'];
        icons.forEach(id => {
            const el = $(id);
            if (el) {
                el.innerHTML = playing ?
                    '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>' :
                    '<polygon points="5 3 19 12 5 21 5 3"/>';
            }
        });
    }

    // ==================== NAVIGATION ====================
    function getNextIndex(direction) {
        if (shuffleMode) {
            let r;
            do { r = Math.floor(Math.random() * SONGS.length); } while (r === currentIndex && SONGS.length > 1);
            return r;
        }
        return (currentIndex + direction + SONGS.length) % SONGS.length;
    }

    function playNext() { isInteracted = true; loadSong(getNextIndex(1), true); }
    function playPrev() { isInteracted = true; loadSong(getNextIndex(-1), true); }

    // ==================== FAVORITES ====================
    function toggleFav() {
        const name = SONGS[currentIndex].name;
        favorites[name] = !favorites[name];
        localStorage.setItem('haiere_fav', JSON.stringify(favorites));
        syncFavButton();
        updateFavCount();
        if (plFilter === 'fav') renderPlaylist();
        showToast(favorites[name] ? '❤️ Added to favorites' : '💔 Removed from favorites');
        saveState();
    }

    function syncFavButton() {
        const on = !!favorites[SONGS[currentIndex]?.name];
        ['btnFav', 'dpFav', 'bpFav'].forEach(id => {
            const el = $(id);
            if (el) el.classList.toggle('on', on);
        });
        document.querySelectorAll('.pl-item .fav').forEach(el => {
            const name = el.dataset.name;
            el.classList.toggle('liked', !!favorites[name]);
            el.textContent = favorites[name] ? '♥' : '♡';
        });
    }

    function updateFavCount() {
        const count = Object.values(favorites).filter(Boolean).length;
        const el = $('favCount');
        if (el) el.textContent = count || '0';
    }

    // ==================== PLAYLIST ====================
    function renderPlaylist() {
        const container = $('plItems');
        if (!container) return;
        container.innerHTML = '';
        let lastGroup = '';
        let visible = 0;
        SONGS.forEach((s, i) => {
            if (plFilter === 'fav' && !favorites[s.name]) return;
            if (s.group !== lastGroup) {
                lastGroup = s.group;
                const sep = document.createElement('div');
                sep.style.cssText = 'font-size:0.65rem;font-family:var(--font-mono);color:var(--fg4);padding:8px 4px 2px;text-transform:uppercase;';
                sep.textContent = s.group;
                container.appendChild(sep);
            }
            visible++;
            const div = document.createElement('div');
            div.className = 'pl-item' + (i === currentIndex ? ' active' : '');
            div.dataset.index = i;
            div.innerHTML = `
                <span class="num">${i+1}</span>
                <span class="name">${s.name}</span>
                <span class="fav" data-name="${s.name}">${favorites[s.name] ? '♥' : '♡'}</span>
            `;
            div.addEventListener('click', () => {
                loadSong(i, true);
                if (window.innerWidth < 768) showView('player');
            });
            container.appendChild(div);
        });
        const pc = $('plCount');
        if (pc) pc.textContent = visible + ' Songs';
        updateFavCount();
    }

    function setPlaylistFilter(filter) {
        plFilter = filter;
        document.querySelectorAll('.pl-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        renderPlaylist();
    }

    function updatePlaylistHighlight() {
        document.querySelectorAll('.pl-item').forEach(el => {
            const idx = parseInt(el.dataset.index, 10);
            el.classList.toggle('active', idx === currentIndex);
        });
    }

    // ==================== MEDIA SESSION ====================
    function updateMediaSession(song) {
        if ('mediaSession' in navigator) {
            try {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song.name,
                    artist: 'Muhaajir',
                    album: song.group,
                    artwork: [{ src: song.cover, sizes: '512x512' }]
                });
                navigator.mediaSession.setActionHandler('play', () => aud.play());
                navigator.mediaSession.setActionHandler('pause', () => aud.pause());
                navigator.mediaSession.setActionHandler('previoustrack', playPrev);
                navigator.mediaSession.setActionHandler('nexttrack', playNext);
            } catch (_) {}
        }
    }

    // ==================== PROGRESS ====================
    function formatTime(s) {
        if (!isFinite(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return m + ':' + sec;
    }

    function updateProgress() {
        if (!aud.duration) return;
        const pct = (aud.currentTime / aud.duration * 100) + '%';
        ['pFill', 'dpFill'].forEach(id => { const el = $(id); if (el) el.style.width = pct; });
        ['tNow', 'dpTNow'].forEach(id => { const el = $(id); if (el) el.textContent = formatTime(aud.currentTime); });
        ['tEnd', 'dpTEnd'].forEach(id => { const el = $(id); if (el) el.textContent = formatTime(aud.duration); });
    }

    function seekTo(ratio) {
        if (!aud.duration) return;
        aud.currentTime = ratio * aud.duration;
    }

    function bindProgressClick(trackEl) {
        if (!trackEl) return;
        trackEl.addEventListener('click', e => {
            const r = trackEl.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            seekTo(ratio);
        });
    }
    bindProgressClick($('progTrack'));
    bindProgressClick($('dpProgTrack'));

    // ==================== SLEEP TIMER ====================
    function clearSleep() {
        if (sleepInterval) clearInterval(sleepInterval);
        sleepInterval = null; sleepEnd = null;
        $('sleepStop').style.display = 'none';
        $('sleepGo').style.display = 'inline-block';
        if ($('sleepStatus')) $('sleepStatus').textContent = 'Inactive';
    }

    function startSleep(seconds) {
        clearSleep();
        sleepEnd = Date.now() + seconds * 1000;
        $('sleepStop').style.display = 'inline-block';
        $('sleepGo').style.display = 'none';

        sleepInterval = setInterval(() => {
            const rem = sleepEnd - Date.now();
            if (rem <= 0) {
                clearSleep();
                aud.pause();
                isPlaying = false;
                updatePlayButtons();
                showToast('⏰ Sleep timer ended');
                return;
            }
            const mins = Math.floor(rem / 60000);
            const secs = Math.floor((rem % 60000) / 1000);
            if ($('sleepStatus')) $('sleepStatus').textContent = mins + 'm ' + secs + 's left';
        }, 500);
    }

    // ==================== VOLUME ====================
    function updateVolume(value) {
        aud.volume = value;
        ['volSl', 'volSetSl', 'dpVolSl'].forEach(id => { const el = $(id); if (el) el.value = value; });
        ['volPct', 'volSetPct'].forEach(id => { const el = $(id); if (el) el.textContent = Math.round(value * 100) + '%'; });
        localStorage.setItem('haiere_vol', value);
    }

    // ==================== VIEW SWITCHING ====================
    function showView(view) {
        if (window.innerWidth < 768) {
            document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
            const target = $('page-' + view);
            if (target) target.classList.add('active');
            
            document.querySelectorAll('.bottom-nav .nav-btn').forEach(el => {
                el.classList.toggle('on', el.dataset.view === view);
            });
        }
        try { localStorage.setItem('haiere_view', view); } catch (_) {}
    }

    // ==================== STATE ====================
    function saveState() {
        try {
            const state = { index: currentIndex, volume: aud.volume, shuffle: shuffleMode, repeat: repeatMode };
            localStorage.setItem('haiere_state', JSON.stringify(state));
        } catch (_) {}
    }

    function restoreState() {
        try {
            const saved = localStorage.getItem('haiere_state');
            if (!saved) return;
            const state = JSON.parse(saved);
            if (state.volume !== undefined) updateVolume(state.volume);
            shuffleMode = state.shuffle || false;
            repeatMode = state.repeat || false;
            ['btnShuffle', 'dpShuffle'].forEach(id => { $(id)?.classList.toggle('on', shuffleMode); });
            ['btnRepeat', 'dpRepeat'].forEach(id => { $(id)?.classList.toggle('on', repeatMode); });
            if (state.index !== undefined && SONGS[state.index]) loadSong(state.index, false);
        } catch (_) {}
    }

    // ==================== INIT ====================
    function init() {
        renderPlaylist();
        restoreState();
        if (!aud.src) loadSong(0, false);

        aud.addEventListener('timeupdate', updateProgress);
        aud.addEventListener('ended', () => { if (repeatMode) { aud.currentTime = 0; aud.play(); } else playNext(); });
        
        ['btnPlay', 'bpPlay', 'dpPlay'].forEach(id => $(id)?.addEventListener('click', togglePlay));
        ['btnPrev', 'dpPrev'].forEach(id => $(id)?.addEventListener('click', playPrev));
        ['btnNext', 'dpNext'].forEach(id => $(id)?.addEventListener('click', playNext));

        ['btnShuffle', 'dpShuffle'].forEach(id => $(id)?.addEventListener('click', () => {
            shuffleMode = !shuffleMode;
            ['btnShuffle', 'dpShuffle'].forEach(i => $(i)?.classList.toggle('on', shuffleMode));
            showToast(shuffleMode ? '🔀 Shuffle on' : '🔀 Shuffle off');
            saveState();
        }));

        ['btnRepeat', 'dpRepeat'].forEach(id => $(id)?.addEventListener('click', () => {
            repeatMode = !repeatMode;
            ['btnRepeat', 'dpRepeat'].forEach(i => $(i)?.classList.toggle('on', repeatMode));
            showToast(repeatMode ? '🔁 Repeat on' : '🔁 Repeat off');
            saveState();
        }));

        ['btnFav', 'dpFav', 'bpFav'].forEach(id => $(id)?.addEventListener('click', toggleFav));

        ['volSl', 'volSetSl', 'dpVolSl'].forEach(id => {
            $(id)?.addEventListener('input', e => updateVolume(parseFloat(e.target.value)));
        });

        document.querySelectorAll('.bottom-nav .nav-btn[data-view]').forEach(el => {
            el.addEventListener('click', () => showView(el.dataset.view));
        });

        $('bpMini')?.addEventListener('click', () => { if (window.innerWidth < 768) showView('player'); });

        // Desktop Right Panel Toggle Functionality
        $('btnMoreToggle')?.addEventListener('click', () => {
            const mainEl = $('mainArea');
            if (mainEl) {
                mainEl.classList.toggle('more-collapsed');
                const isCollapsed = mainEl.classList.contains('more-collapsed');
                const icon = $('moreToggleIcon');
                if (icon) icon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });

        document.querySelectorAll('.pl-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => setPlaylistFilter(btn.dataset.filter));
        });

        // Mobile drawer toggles
        $('menuToggle')?.addEventListener('click', () => {
            $('menuDrawer')?.classList.add('show');
            $('menuOverlay')?.classList.add('show');
        });
        const closeMenu = () => {
            $('menuDrawer')?.classList.remove('show');
            $('menuOverlay')?.classList.remove('show');
        };
        $('menuClose')?.addEventListener('click', closeMenu);
        $('menuOverlay')?.addEventListener('click', closeMenu);

        window.addEventListener('resize', () => {
            if (SONGS[currentIndex]) updateAllCovers(currentIndex);
        });

        setTimeout(() => { $('loader')?.classList.add('hide'); }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
