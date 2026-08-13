        (function() {
            'use strict';

            // ==================== DATA ====================
            const SONGS = [
                { name: "Lintasan Tak Bermakna", group: "Fragmen Suara",
                    url: "https://files.catbox.moe/7p3gmt.opus",
                    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp" },
                { name: "Padahal Sudah Bilang", group: "Fragmen Suara",
                    url: "https://files.catbox.moe/izfodb.opus",
                    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp" },
                { name: "Mimpi yang Tertunda", group: "Fragmen Suara",
                    url: "https://files.catbox.moe/44mglv.opus",
                    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp" },
                { name: "Langit Masih Sama", group: "Fragmen Suara",
                    url: "https://files.catbox.moe/m1gzfk.opus",
                    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp" },
                { name: "Suatu Hari Nanti", group: "Fragmen Suara",
                    url: "https://files.catbox.moe/j26sgp.opus",
                    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp" },
                { name: "Nada Terpendam", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/suwzc2.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Langit Patah Arah", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/wl8kn9.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Tak Bernama, Tapi Ada", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/vh4bn7.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Resonansi Dalam Diam", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/8l1bkc.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Runtuh Tanpa Suara", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/52dcsz.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Kilau Tanpa Sorotan", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/m28u99.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Gelombang Terakhir", group: "Resonansi Dalam Diam",
                    url: "https://files.catbox.moe/6lkkg2.opus",
                    cover: "https://i.postimg.cc/Tw24GVFB/resonansi.webp" },
                { name: "Saya Akan Lawan", group: "Saya Akan Lawan",
                    url: "https://files.catbox.moe/704z9d.opus",
                    cover: "https://i.postimg.cc/Ghj99yqK/sayaakanlawan(Copy).png" }
            ];

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
            let fading = false;

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
                const sz = $('artCv')?.parentElement?.clientWidth || 400;
                drawCover($('artCv'), s.cover, sz);
                drawCover($('bpCv'), s.cover, 40);
                drawCover($('dpArtCv'), s.cover, 50);
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
                if (Math.abs(to - from) < 0.004) { aud.volume = to;
                    cb && cb(); return; }
                fading = true;
                let t0 = null;

                function step(ts) {
                    if (!t0) t0 = ts;
                    const p = Math.min((ts - t0) / dur, 1);
                    aud.volume = from + (to - from) * (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
                    if (p < 1) { fadeRaf = requestAnimationFrame(step); } else { aud.volume = to;
                        fading = false;
                        fadeRaf = null;
                        cb && cb(); }
                }
                fadeRaf = requestAnimationFrame(step);
            }

            function getVol() {
                return parseFloat($('volSl')?.value || 0.7);
            }

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
                const ao = $('artOuter');
                if (ao) ao.classList.toggle('playing', playing);
                document.querySelectorAll('.pl-item.active').forEach(el => {
                    el.classList.toggle('paused', !playing);
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

            function playNext() { isInteracted = true;
                loadSong(getNextIndex(1), true); }

            function playPrev() { isInteracted = true;
                loadSong(getNextIndex(-1), true); }

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
                        sep.style.cssText =
                            'font-size:var(--text-xs);font-family:var(--font-mono);letter-spacing:var(--letter-spacing-wider);color:var(--fg4);padding:10px 4px 4px;text-transform:uppercase;';
                        sep.textContent = s.group;
                        container.appendChild(sep);
                    }
                    visible++;
                    const div = document.createElement('div');
                    div.className = 'pl-item' + (i === currentIndex ? ' active' : '');
                    div.dataset.index = i;
                    div.setAttribute('role', 'listitem');
                    div.innerHTML = `
                        <span class="num">${i+1}</span>
                        <span class="name">${s.name}</span>
                        <span class="group">${s.group.split(' ').slice(0,2).join(' ')}</span>
                        <span class="fav" data-name="${s.name}">${favorites[s.name] ? '♥' : '♡'}</span>
                        <div class="wave"><span></span><span></span><span></span></div>
                    `;
                    div.addEventListener('click', () => {
                        loadSong(i, true);
                        showView('player');
                    });
                    container.appendChild(div);
                });
                if (visible === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'pl-empty';
                    empty.textContent = 'No favorites yet';
                    container.appendChild(empty);
                }
                const pc = $('plCount');
                if (pc) {
                    pc.dataset.count = visible;
                    pc.textContent = visible + ' Songs';
                }
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
                    const fav = el.querySelector('.fav');
                    if (fav) {
                        const name = fav.dataset.name;
                        fav.classList.toggle('liked', !!favorites[name]);
                        fav.textContent = favorites[name] ? '♥' : '♡';
                    }
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
                        navigator.mediaSession.setActionHandler('play', () => { aud.play(); });
                        navigator.mediaSession.setActionHandler('pause', () => { aud.pause(); });
                        navigator.mediaSession.setActionHandler('previoustrack', playPrev);
                        navigator.mediaSession.setActionHandler('nexttrack', playNext);
                        navigator.mediaSession.setActionHandler('seekto', (d) => { if (d.seekTime) aud.currentTime = d
                                .seekTime; });
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
                ['tNow', 'dpTNow'].forEach(id => { const el = $(id); if (el) el.textContent = formatTime(aud
                    .currentTime); });
                ['tEnd', 'dpTEnd'].forEach(id => { const el = $(id); if (el) el.textContent = formatTime(aud
                    .duration); });
            }

            function seekTo(ratio) {
                if (!aud.duration) return;
                aud.currentTime = ratio * aud.duration;
                if (!aud.paused) aud.volume = getVol();
            }

            function bindProgressDrag(trackEl, fillId) {
                if (!trackEl) return;
                let dragging = false;
                const ratioFromEvent = (clientX) => {
                    const r = trackEl.getBoundingClientRect();
                    return Math.min(1, Math.max(0, (clientX - r.left) / r.width));
                };
                const previewAt = (ratio) => {
                    const el = $(fillId);
                    if (el) el.style.width = (ratio * 100) + '%';
                    if (aud.duration) {
                        const tn = $(fillId === 'pFill' ? 'tNow' : 'dpTNow');
                        if (tn) tn.textContent = formatTime(ratio * aud.duration);
                    }
                };
                trackEl.addEventListener('click', e => { if (!dragging) seekTo(ratioFromEvent(e.clientX)); });
                trackEl.addEventListener('pointerdown', e => {
                    dragging = true;
                    trackEl.classList.add('dragging');
                    previewAt(ratioFromEvent(e.clientX));
                    trackEl.setPointerCapture?.(e.pointerId);
                });
                trackEl.addEventListener('pointermove', e => {
                    if (!dragging) return;
                    previewAt(ratioFromEvent(e.clientX));
                });
                const endDrag = e => {
                    if (!dragging) return;
                    dragging = false;
                    trackEl.classList.remove('dragging');
                    seekTo(ratioFromEvent(e.clientX));
                };
                trackEl.addEventListener('pointerup', endDrag);
                trackEl.addEventListener('pointercancel', () => { dragging = false;
                    trackEl.classList.remove('dragging'); });
            }
            bindProgressDrag($('progTrack'), 'pFill');
            bindProgressDrag($('dpProgTrack'), 'dpFill');

            // ==================== SLEEP TIMER ====================
            function clearSleep() {
                if (sleepInterval) clearInterval(sleepInterval);
                sleepInterval = null;
                sleepEnd = null;
                $('sleepStop').style.display = 'none';
                $('sleepGo').style.display = 'inline-block';
                const st = $('sleepStatus');
                if (st) { st.textContent = 'Inactive';
                    st.className = 'sleep-status'; }
                ['btnTimer', 'dpTimer'].forEach(id => { const el = $(id); if (el) el.classList.remove('has-timer'); });
                saveState();
            }

            function startSleep(seconds) {
                clearSleep();
                sleepEnd = Date.now() + seconds * 1000;
                $('sleepStop').style.display = 'inline-block';
                $('sleepGo').style.display = 'none';
                const st = $('sleepStatus');
                if (st) st.className = 'sleep-status active';
                ['btnTimer', 'dpTimer'].forEach(id => { const el = $(id); if (el) el.classList.add('has-timer'); });

                sleepInterval = setInterval(() => {
                    const rem = sleepEnd - Date.now();
                    if (rem <= 0) {
                        clearSleep();
                        fadeTo(0, 1500, () => {
                            aud.pause();
                            aud.volume = getVol();
                            isPlaying = false;
                            updatePlayButtons();
                            showToast('⏰ Sleep timer ended');
                        });
                        return;
                    }
                    const mins = Math.floor(rem / 60000);
                    const secs = Math.floor((rem % 60000) / 1000);
                    const st2 = $('sleepStatus');
                    if (st2) st2.textContent = mins + 'm ' + secs + 's left';
                }, 500);
                saveState();
            }

            // ==================== VOLUME ====================
            function updateVolume(value) {
                if (!fading) aud.volume = value;
                ['volSl', 'volSetSl', 'dpVolSl'].forEach(id => {
                    const el = $(id);
                    if (el && el.value !== undefined) el.value = value;
                });
                ['volPct', 'volSetPct'].forEach(id => {
                    const el = $(id);
                    if (el) el.textContent = Math.round(value * 100) + '%';
                });
                localStorage.setItem('haiere_vol', value);
            }

            function onVolInput(e) {
                const v = parseFloat(e.target.value);
                updateVolume(v);
            }

            // ==================== VIEW SWITCHING ====================
            function showView(view) {
                document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
                const target = $('page-' + view);
                if (target) {
                    target.classList.remove('hidden');
                    target.classList.add('active');
                }
                document.querySelectorAll('.sb-link[data-view], .nav-btn[data-view]').forEach(el => {
                    el.classList.toggle('active', el.dataset.view === view);
                    if (el.classList.contains('nav-btn')) {
                        el.classList.toggle('on', el.dataset.view === view);
                    }
                });
                document.querySelectorAll('.menu-item[data-view]').forEach(el => {
                    el.classList.toggle('active', el.dataset.view === view && !el.dataset.filter);
                });
                if (window.innerWidth >= 820) {
                    const area = document.getElementById('mainArea');
                    if (area) area.scrollTop = 0;
                } else if (view === 'player') {
                    document.getElementById('mainArea')?.scrollTo(0, 0);
                }
                try { localStorage.setItem('haiere_view', view); } catch (_) {}
            }

            // ==================== SHARE ====================
            function shareSong() {
                const s = SONGS[currentIndex];
                if (s) {
                    window.open(`https://wa.me/?text=${encodeURIComponent('*'+s.name+'* — Muhaajir\n'+location.href)}`,
                        '_blank');
                    showToast('📤 Opening WhatsApp...');
                }
            }

            // ==================== DOWNLOAD ====================
            async function downloadSong(url, fileName) {
                if (!url) { showToast('❌ URL not available'); return; }
                showToast('⬇️ Downloading...');
                try {
                    const r = await fetch(url, { mode: 'cors' });
                    if (!r.ok) throw new Error();
                    const blob = await r.blob();
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = fileName || 'Muhaajir - track.opus';
                    a.click();
                    URL.revokeObjectURL(a.href);
                    showToast('✅ Download complete');
                } catch (_) {
                    window.open(url, '_blank');
                }
            }

            // ==================== STATE ====================
            function saveState() {
                try {
                    const state = {
                        index: currentIndex,
                        time: aud.currentTime || 0,
                        shuffle: shuffleMode,
                        repeat: repeatMode,
                        volume: aud.volume,
                        sleep: sleepEnd ? sleepEnd - Date.now() : 0
                    };
                    localStorage.setItem('haiere_state', JSON.stringify(state));
                } catch (_) {}
            }

            function restoreState() {
                try {
                    const saved = localStorage.getItem('haiere_state');
                    if (!saved) return;
                    const state = JSON.parse(saved);
                    if (state.volume !== undefined) {
                        aud.volume = state.volume;
                        updateVolume(state.volume);
                    }
                    shuffleMode = state.shuffle || false;
                    repeatMode = state.repeat || false;
                    ['btnShuffle', 'dpShuffle'].forEach(id => {
                        const el = $(id);
                        if (el) el.classList.toggle('on', shuffleMode);
                    });
                    ['btnRepeat', 'dpRepeat'].forEach(id => {
                        const el = $(id);
                        if (el) el.classList.toggle('on', repeatMode);
                    });
                    if (state.index !== undefined && SONGS[state.index]) {
                        loadSong(state.index, false);
                        if (state.time) aud.currentTime = state.time;
                    }
                    if (state.sleep > 0 && state.sleep < 5400000) {
                        startSleep(Math.ceil(state.sleep / 1000));
                    }
                } catch (_) {}
            }

            // ==================== KEYBOARD SHORTCUTS ====================
            document.addEventListener('keydown', (e) => {
                const tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'select') return;
                switch (e.key.toLowerCase()) {
                    case ' ':
                    case 'k':
                        e.preventDefault();
                        togglePlay();
                        break;
                    case 'arrowright':
                        e.preventDefault();
                        if (e.shiftKey) playNext();
                        else if (aud.duration) aud.currentTime = Math.min(aud.duration, aud.currentTime + 5);
                        break;
                    case 'arrowleft':
                        e.preventDefault();
                        if (e.shiftKey) playPrev();
                        else if (aud.duration) aud.currentTime = Math.max(0, aud.currentTime - 5);
                        break;
                    case 'arrowup':
                        e.preventDefault();
                        const up = Math.min(1, getVol() + 0.05);
                        updateVolume(up);
                        break;
                    case 'arrowdown':
                        e.preventDefault();
                        const dn = Math.max(0, getVol() - 0.05);
                        updateVolume(dn);
                        break;
                    case 'f':
                        toggleFav();
                        break;
                    case 's':
                        shuffleMode = !shuffleMode;
                        ['btnShuffle', 'dpShuffle'].forEach(id => { const el = $(id); if (el) el.classList.toggle('on',
                                shuffleMode); });
                        showToast(shuffleMode ? '🔀 Shuffle on' : '🔀 Shuffle off');
                        saveState();
                        break;
                    case 'r':
                        repeatMode = !repeatMode;
                        ['btnRepeat', 'dpRepeat'].forEach(id => { const el = $(id); if (el) el.classList.toggle('on',
                                repeatMode); });
                        showToast(repeatMode ? '🔁 Repeat on' : '🔁 Repeat off');
                        saveState();
                        break;
                    case 'm':
                        $('modalBg')?.classList.add('show');
                        break;
                    case 't':
                        showView('settings');
                        break;
                    case 'escape':
                        $('modalBg')?.classList.remove('show');
                        window.closeMenu?.();
                        break;
                }
            });

            // ==================== INIT ====================
            function init() {
                // Favorites
                favorites = JSON.parse(localStorage.getItem('haiere_fav')) || {};

                // Render playlist
                renderPlaylist();

                // Restore state
                restoreState();

                // If no song loaded, load first
                if (!aud.src) loadSong(0, false);

                updatePlayButtons();
                updateFavCount();
                updateProgress();

                // --- Audio events ---
                aud.addEventListener('play', () => { isPlaying = true;
                    updatePlayButtons(); });
                aud.addEventListener('pause', () => { isPlaying = false;
                    updatePlayButtons(); });
                aud.addEventListener('timeupdate', updateProgress);
                aud.addEventListener('ended', () => {
                    if (repeatMode) { aud.currentTime = 0;
                        aud.play().catch(() => {}); } else playNext();
                });
                aud.addEventListener('error', () => {
                    showToast('❌ URL not available');
                    setTimeout(playNext, 1500);
                });

                // --- Play buttons ---
                ['btnPlay', 'bpPlay', 'dpPlay'].forEach(id => {
                    const el = $(id);
                    if (el) el.addEventListener('click', togglePlay);
                });

                // --- Prev/Next ---
                ['btnPrev', 'dpPrev'].forEach(id => { const el = $(id); if (el) el.addEventListener('click',
                        playPrev); });
                ['btnNext', 'dpNext'].forEach(id => { const el = $(id); if (el) el.addEventListener('click',
                        playNext); });
                // --- Shuffle ---
                ['btnShuffle', 'dpShuffle'].forEach(id => {
                    const el = $(id);
                    if (el) {
                        el.addEventListener('click', () => {
                            shuffleMode = !shuffleMode;
                            el.classList.toggle('on', shuffleMode);
                            showToast(shuffleMode ? '🔀 Shuffle on' : '🔀 Shuffle off');
                            saveState();
                        });
                    }
                });

                // --- Repeat ---
                ['btnRepeat', 'dpRepeat'].forEach(id => {
                    const el = $(id);
                    if (el) {
                        el.addEventListener('click', () => {
                            repeatMode = !repeatMode;
                            el.classList.toggle('on', repeatMode);
                            showToast(repeatMode ? '🔁 Repeat on' : '🔁 Repeat off');
                            saveState();
                        });
                    }
                });

                // --- Favorites ---
                ['btnFav', 'dpFav', 'bpFav'].forEach(id => {
                    const el = $(id);
                    if (el) el.addEventListener('click', toggleFav);
                });

                // --- Share ---
                ['btnShare', 'setShare'].forEach(id => {
                    const el = $(id);
                    if (el) el.addEventListener('click', shareSong);
                });

                // --- Download ---
                ['btnDl', 'setDl', 'dpDl'].forEach(id => {
                    const el = $(id);
                    if (el) el.addEventListener('click', () => $('modalBg')?.classList.add('show'));
                });
                $('optCatbox')?.addEventListener('click', () => {
                    const url = $('optCatbox')?.dataset.url || SONGS[currentIndex]?.url;
                    const name = SONGS[currentIndex]?.name || 'track';
                    downloadSong(url, `Muhaajir - ${name}.opus`);
                    $('modalBg')?.classList.remove('show');
                });
                $('modalBg')?.addEventListener('click', (e) => {
                    if (e.target === $('modalBg')) $('modalBg').classList.remove('show');
                });

                // --- Timer ---
                ['btnTimer', 'dpTimer'].forEach(id => {
                    const el = $(id);
                    if (el) el.addEventListener('click', () => showView('settings'));
                });

                // --- Sleep timer ---
                $('sleepGo')?.addEventListener('click', () => {
                    const v = parseInt($('sleepSel')?.value);
                    if (v) { startSleep(v);
                        showToast('⏰ Sleep timer set'); }
                });
                $('sleepStop')?.addEventListener('click', () => { clearSleep();
                    showToast('⏰ Sleep timer off'); });

                // --- Volume ---
                ['volSl', 'volSetSl', 'dpVolSl'].forEach(id => {
                    const el = $(id);
                    if (el) {
                        el.value = parseFloat(localStorage.getItem('haiere_vol') || 0.7);
                        el.addEventListener('input', onVolInput);
                    }
                });
                updateVolume(parseFloat(localStorage.getItem('haiere_vol') || 0.7));

                // --- Navigation ---
                document.querySelectorAll('.sb-link[data-view], .nav-btn[data-view]').forEach(el => {
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        const view = el.dataset.view;
                        if (view) showView(view);
                    });
                });
                // Mobile bottom nav click on the mini player area
                $('bpMini')?.addEventListener('click', () => showView('player'));

                // --- Playlist filter tabs ---
                document.querySelectorAll('.pl-filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => setPlaylistFilter(btn.dataset.filter));
                });

                // --- Menu drawer (mobile) ---
                const menuToggle = $('menuToggle');
                const menuDrawer = $('menuDrawer');
                const menuOverlay = $('menuOverlay');
                function openMenu() {
                    menuDrawer?.classList.add('show');
                    menuOverlay?.classList.add('show');
                    menuToggle?.classList.add('open');
                    menuToggle?.setAttribute('aria-expanded', 'true');
                }
                window.closeMenu = function closeMenu() {
                    menuDrawer?.classList.remove('show');
                    menuOverlay?.classList.remove('show');
                    menuToggle?.classList.remove('open');
                    menuToggle?.setAttribute('aria-expanded', 'false');
                };
                menuToggle?.addEventListener('click', () => {
                    menuDrawer?.classList.contains('show') ? closeMenu() : openMenu();
                });
                $('menuClose')?.addEventListener('click', closeMenu);
                menuOverlay?.addEventListener('click', closeMenu);

                document.querySelectorAll('.menu-item[data-view]').forEach(el => {
                    el.addEventListener('click', () => {
                        const view = el.dataset.view;
                        const filter = el.dataset.filter;
                        if (view === 'playlist') setPlaylistFilter(filter || 'all');
                        if (view) showView(view);
                        closeMenu();
                    });
                });
                $('menuShare')?.addEventListener('click', () => { shareSong();
                    closeMenu(); });

                // --- Header scroll ---
                const header = document.getElementById('header');
                window.addEventListener('scroll', () => {
                    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
                }, { passive: true });

                // --- Rotating name ---
                const names = ['Muhaajir', 'Regina', 'FL', 'MHJR', 'HJST', 'Brava', 'Hajirstein', 'Hajir'];
                let ni = 0;
                setInterval(() => {
                    const el = $('rotName');
                    if (!el) return;
                    el.style.opacity = '0';
                    setTimeout(() => {
                        ni = (ni + 1) % names.length;
                        el.innerHTML = 'Created by <span>' + names[ni] + '</span>';
                        el.style.opacity = '1';
                    }, 300);
                }, 3200);

                // --- Resize cover ---
                let resizeTimer;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        if (SONGS[currentIndex]) updateAllCovers(currentIndex);
                    }, 300);
                });

                // --- Save state periodically ---
                setInterval(saveState, 10000);

                // --- Restore last view (mobile) ---
                try {
                    const lastView = localStorage.getItem('haiere_view');
                    if (lastView && lastView !== 'player') {
                        setTimeout(() => showView(lastView), 100);
                    }
                } catch (_) {}

                // --- Hide loader ---
                setTimeout(() => { $('loader')?.classList.add('hide'); }, 700);

                console.log('🎵 Haiere Signature Music · ' + SONGS.length + ' tracks loaded');
            }

            // Start
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

        })();