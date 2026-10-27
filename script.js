import { SONGS } from "./data-song.js";
import { formatTime, findSongBySlug, getSongSlug } from "./utils.js";
import { getLang, setLang, t, applyTranslations } from "./i18n.js";
import { initRouter, navigate, buildShareUrl } from "./router.js";

(function () {
    "use strict";

    // ==================== DOM SHORTCUT ====================
    const $ = (id) => document.getElementById(id);

    // ==================== SKELETON ====================
    // Hide skeleton after app is ready (data + first render). Fallback after 4 s.
    function hideSkeleton() {
        const sk = $("skeleton");
        if (!sk) return;
        sk.classList.add("hide");
        setTimeout(() => sk.remove(), 600);
    }
    setTimeout(hideSkeleton, 4000);

    // ==================== STATE ====================
    let currentIndex = 0;
    let isPlaying = false;
    let shuffleMode = false;
    let repeatMode = false;
    let favorites = {};
    let sleepEnd = null;
    let sleepInterval = null;
    let plFilter = "all";
    let musicQuery = "";
    let isInteracted = false;
    let fadeRaf = null;
    let currentRoute = "home";

    try {
        favorites = JSON.parse(localStorage.getItem("haiere_fav")) || {};
    } catch (_) {
        favorites = {};
    }

    const aud = $("aud");

    // ==================== TOAST ====================
    let toastTimeout;
    function showToast(msg) {
        const el = $("toast");
        if (!el) return;
        el.textContent = msg;
        el.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => el.classList.remove("show"), 2800);
    }

    // ==================== COVER ART ====================
    const coverCache = new Map();
    const SAFE_COVER = "https://i.postimg.cc/8PJ0bhb1/H-Muhaajir.webp";

    function drawCover(canvas, url, size) {
        if (!canvas) return;
        const sz = size || canvas.parentElement?.clientWidth || 300;
        canvas.width = sz;
        canvas.height = sz;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#12122a";
        ctx.fillRect(0, 0, sz, sz);
        const src = url || SAFE_COVER;

        function paint(img) {
            try {
                ctx.drawImage(img, 0, 0, sz, sz);
            } catch (_) {
                drawFallback();
            }
        }
        function drawFallback() {
            const fb = new Image();
            fb.crossOrigin = "anonymous";
            fb.onload = () => ctx.drawImage(fb, 0, 0, sz, sz);
            fb.onerror = () => {
                ctx.fillStyle = "#12122a";
                ctx.fillRect(0, 0, sz, sz);
                ctx.fillStyle = "#565280";
                ctx.font = `${Math.max(12, sz / 8)}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Haiere", sz / 2, sz / 2);
            };
            fb.src = SAFE_COVER;
        }

        if (coverCache.has(src)) {
            const img = coverCache.get(src);
            if (img.complete && img.naturalWidth) {
                paint(img);
                return;
            }
        }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            coverCache.set(src, img);
            paint(img);
        };
        img.onerror = () => {
            if (src !== SAFE_COVER) drawFallback();
            else drawFallback();
        };
        img.src = src;
    }

    function updateAllCovers(index) {
        const s = SONGS[index];
        if (!s) return;
        drawCover($("artCv"), s.coverUrl, $("artCv")?.parentElement?.clientWidth || 320);
        drawCover($("bpCv"), s.coverUrl, 40);
        drawCover($("dpArtCv"), s.coverUrl, 46);
    }

    // ==================== SEO ====================
    function updateSeo(song) {
        const title = song
            ? `${song.title} — ${song.artist} | Haiere Signature Music`
            : "Haiere Signature Music — Muhaajir";
        document.title = title;
        const desc = song
            ? `Listen to ${song.title} by ${song.artist} from ${song.album}.`
            : "Stream Muhaajir's original albums Fragmen Suara and Resonansi Dalam Diam.";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", desc);
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", title);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", desc);
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg && song) ogImg.setAttribute("content", song.coverUrl || SAFE_COVER);
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute("content", title);
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.setAttribute("content", desc);
        const twImg = document.querySelector('meta[name="twitter:image"]');
        if (twImg && song) twImg.setAttribute("content", song.coverUrl || SAFE_COVER);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const base = window.location.origin;
            canonical.setAttribute("href", song ? base + buildSongPath(song) : base + "/");
        }
    }

    // ==================== LOAD SONG ====================
    function loadSong(index, autoPlay = false, pushRoute = true) {
        const s = SONGS[index];
        if (!s) return;
        currentIndex = index;

        const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };

        setText("npTitle", s.title);
        setText("npAlbum", `${s.album} · ${s.artist}`);
        setText("bpTitle", s.title);
        setText("bpSub", s.album);
        setText("dpTitle", s.title);
        setText("dpSub", `${s.album} · ${s.artist}`);
        setText("modalSub", `"${s.title}"`);

        const opt = $("optCatbox");
        if (opt) opt.dataset.url = s.audioUrl;

        updateAllCovers(index);
        syncFavButton();
        updateSeo(s);

        // Audio source
        if (aud.src !== s.audioUrl) {
            aud.src = s.audioUrl;
            aud.load();
        }
        aud.onerror = () => {
            showToast(t("toast.audioError"));
            aud.onerror = null;
        };

        if (autoPlay && isInteracted) {
            aud.play().catch(() => {});
        }
        updatePlaylistHighlight();
        updateMediaSession(s);
        saveState();

        // Routing
        if (pushRoute) {
            const path = `/playing/${getSongSlug(s).title}/${getSongSlug(s).artist}`;
            if (window.location.pathname !== path) navigate(path, true);
        }

        // Hide not-found if visible
        const nf = $("notFound");
        if (nf) nf.hidden = true;
        const center = $("page-player");
        if (center) center.classList.remove("has-not-found");
    }

    // ==================== ROUTE HANDLER ====================
    function handleRouteChange({ type, song }) {
        currentRoute = type;
        const nf = $("notFound");
        const playerPage = $("page-player");

        if (type === "not-found") {
            if (nf) nf.hidden = false;
            if (playerPage) playerPage.classList.add("has-not-found");
            showToast(t("toast.routeNotFound"));
            return;
        }

        if (nf) nf.hidden = true;
        if (playerPage) playerPage.classList.remove("has-not-found");

        if (song) {
            const idx = SONGS.findIndex((s) => s.id === song.id);
            if (idx >= 0) {
                loadSong(idx, false, false);
                if (type === "playing") showView("player");
            }
        } else if (type === "home") {
            // home route: no forced song change
        }
    }

    // ==================== PLAY / PAUSE ====================
    function togglePlay() {
        isInteracted = true;
        if (aud.paused) {
            aud.volume = 0;
            aud.play()
                .then(() => {
                    isPlaying = true;
                    fadeTo(getVol(), 400);
                    updatePlayButtons();
                })
                .catch(() => {
                    showToast(t("toast.audioError"));
                });
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
        if (Math.abs(to - from) < 0.004) {
            aud.volume = to;
            if (cb) cb();
            return;
        }
        let t0 = null;
        function step(ts) {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            aud.volume = from + (to - from) * p;
            if (p < 1) {
                fadeRaf = requestAnimationFrame(step);
            } else {
                aud.volume = to;
                if (cb) cb();
            }
        }
        fadeRaf = requestAnimationFrame(step);
    }

    function getVol() {
        return parseFloat($("volSl")?.value || 0.7);
    }

    function updatePlayButtons() {
        const playing = !aud.paused && aud.currentTime > 0;
        isPlaying = playing;
        ["playSvg", "bpPlaySvg", "dpPlaySvg"].forEach((id) => {
            const el = $(id);
            if (el) {
                el.innerHTML = playing
                    ? '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'
                    : '<polygon points="5 3 19 12 5 21 5 3"/>';
            }
        });
    }

    // ==================== NAVIGATION ====================
    function getNextIndex(direction) {
        if (shuffleMode) {
            let r;
            do {
                r = Math.floor(Math.random() * SONGS.length);
            } while (r === currentIndex && SONGS.length > 1);
            return r;
        }
        return (currentIndex + direction + SONGS.length) % SONGS.length;
    }

    function playNext() {
        isInteracted = true;
        loadSong(getNextIndex(1), true);
    }

    function playPrev() {
        isInteracted = true;
        loadSong(getNextIndex(-1), true);
    }

    // ==================== FAVORITES ====================
    function toggleFav() {
        const song = SONGS[currentIndex];
        if (!song) return;
        const name = song.title;
        favorites[name] = !favorites[name];
        try {
            localStorage.setItem("haiere_fav", JSON.stringify(favorites));
        } catch (_) {}
        syncFavButton();
        updateFavCount();
        if (plFilter === "fav") renderPlaylist();
        showToast(favorites[name] ? t("toast.addedFav") : t("toast.removedFav"));
        saveState();
    }

    function syncFavButton() {
        const song = SONGS[currentIndex];
        if (!song) return;
        const on = !!favorites[song.title];
        ["btnFav", "dpFav", "bpFav"].forEach((id) => {
            const el = $(id);
            if (el) el.classList.toggle("on", on);
        });
        document.querySelectorAll(".pl-item .fav").forEach((el) => {
            const name = el.dataset.name;
            el.classList.toggle("liked", !!favorites[name]);
            el.textContent = favorites[name] ? "♥" : "♡";
        });
    }

    function updateFavCount() {
        const count = Object.values(favorites).filter(Boolean).length;
        const el = $("favCount");
        if (el) el.textContent = String(count || 0);
    }

    // ==================== PLAYLIST ====================
    function renderPlaylist() {
        const container = $("plItems");
        if (!container) return;
        container.innerHTML = "";

        let lastGroup = "";
        let visible = 0;

        SONGS.forEach((s, i) => {
            if (plFilter === "fav" && !favorites[s.title]) return;
            if (musicQuery) {
                const q = musicQuery.toLowerCase();
                if (
                    !s.title.toLowerCase().includes(q) &&
                    !s.album.toLowerCase().includes(q) &&
                    !s.artist.toLowerCase().includes(q)
                ) return;
            }

            if (s.album !== lastGroup) {
                lastGroup = s.album;
                const sep = document.createElement("div");
                sep.style.cssText =
                    "font-size:0.65rem;font-family:var(--font-mono);color:var(--fg4);padding:8px 4px 2px;text-transform:uppercase;";
                sep.textContent = s.album;
                container.appendChild(sep);
            }

            visible++;
            const div = document.createElement("div");
            div.className = "pl-item" + (i === currentIndex ? " active" : "");
            div.dataset.index = i;
            div.innerHTML = `
                <span class="num">${i + 1}</span>
                <span class="name">${s.title}</span>
                <span class="fav" data-name="${s.title}">${favorites[s.title] ? "♥" : "♡"}</span>
            `;
            div.addEventListener("click", () => {
                loadSong(i, true);
                if (window.innerWidth < 768) showView("player");
            });
            container.appendChild(div);
        });

        const pc = $("plCount");
        if (pc) pc.textContent = visible + " " + t("music.totalSongs");
        if (visible === 0) {
            const empty = document.createElement("div");
            empty.className = "pl-empty";
            empty.textContent = t("music.empty");
            container.appendChild(empty);
        }
        updateFavCount();
    }

    function setPlaylistFilter(filter) {
        plFilter = filter;
        document.querySelectorAll(".pl-filter-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });
        renderPlaylist();
    }

    function updatePlaylistHighlight() {
        document.querySelectorAll(".pl-item").forEach((el) => {
            const idx = parseInt(el.dataset.index, 10);
            el.classList.toggle("active", idx === currentIndex);
        });
    }

    // ==================== MEDIA SESSION ====================
    function updateMediaSession(song) {
        if ("mediaSession" in navigator) {
            try {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song.title,
                    artist: song.artist,
                    album: song.album,
                    artwork: [{ src: song.coverUrl || SAFE_COVER, sizes: "512x512" }],
                });
                navigator.mediaSession.setActionHandler("play", () => aud.play());
                navigator.mediaSession.setActionHandler("pause", () => aud.pause());
                navigator.mediaSession.setActionHandler("previoustrack", playPrev);
                navigator.mediaSession.setActionHandler("nexttrack", playNext);
            } catch (_) {}
        }
    }

    // ==================== PROGRESS ====================
    function updateProgress() {
        if (!aud.duration) return;
        const pct = (aud.currentTime / aud.duration) * 100 + "%";
        ["pFill", "dpFill"].forEach((id) => {
            const el = $(id);
            if (el) el.style.width = pct;
        });
        ["tNow", "dpTNow"].forEach((id) => {
            const el = $(id);
            if (el) el.textContent = formatTime(aud.currentTime);
        });
        ["tEnd", "dpTEnd"].forEach((id) => {
            const el = $(id);
            if (el) el.textContent = formatTime(aud.duration);
        });
    }

    function seekTo(ratio) {
        if (!aud.duration) return;
        aud.currentTime = ratio * aud.duration;
    }

    function bindProgressClick(trackEl) {
        if (!trackEl) return;
        trackEl.addEventListener("click", (e) => {
            const r = trackEl.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            seekTo(ratio);
        });
    }
    bindProgressClick($("progTrack"));
    bindProgressClick($("dpProgTrack"));

    // ==================== SLEEP TIMER ====================
    function clearSleep() {
        if (sleepInterval) clearInterval(sleepInterval);
        sleepInterval = null;
        sleepEnd = null;
        const stop = $("sleepStop");
        if (stop) stop.style.display = "none";
        const go = $("sleepGo");
        if (go) go.style.display = "inline-block";
        const st = $("sleepStatus");
        if (st) {
            st.textContent = t("settings.inactive");
            st.classList.remove("active");
        }
    }

    function startSleep(seconds) {
        clearSleep();
        sleepEnd = Date.now() + seconds * 1000;
        const stop = $("sleepStop");
        if (stop) stop.style.display = "inline-block";
        const go = $("sleepGo");
        if (go) go.style.display = "none";
        const st = $("sleepStatus");
        if (st) st.classList.add("active");

        sleepInterval = setInterval(() => {
            const rem = sleepEnd - Date.now();
            if (rem <= 0) {
                clearSleep();
                aud.pause();
                isPlaying = false;
                updatePlayButtons();
                showToast(t("toast.sleepEnded"));
                return;
            }
            const mins = Math.floor(rem / 60000);
            const secs = Math.floor((rem % 60000) / 1000);
            const st2 = $("sleepStatus");
            if (st2) st2.textContent = mins + "m " + secs + "s left";
        }, 500);
    }

    // ==================== VOLUME ====================
    function updateVolume(value) {
        aud.volume = value;
        ["volSl", "volSetSl", "dpVolSl"].forEach((id) => {
            const el = $(id);
            if (el) el.value = value;
        });
        ["volPct", "volSetPct"].forEach((id) => {
            const el = $(id);
            if (el) el.textContent = Math.round(value * 100) + "%";
        });
        try {
            localStorage.setItem("haiere_vol", String(value));
        } catch (_) {}
    }

    // ==================== VIEW SWITCHING ====================
    function showView(view) {
        if (window.innerWidth < 768) {
            document.querySelectorAll(".page").forEach((el) => el.classList.remove("active"));
            const target = $("page-" + view);
            if (target) target.classList.add("active");

            document.querySelectorAll(".bottom-nav .nav-btn").forEach((el) => {
                el.classList.toggle("on", el.dataset.view === view);
            });
        }
        try {
            localStorage.setItem("haiere_view", view);
        } catch (_) {}
    }

    // ==================== STATE ====================
    function saveState() {
        try {
            const state = {
                index: currentIndex,
                volume: aud.volume,
                shuffle: shuffleMode,
                repeat: repeatMode,
            };
            localStorage.setItem("haiere_state", JSON.stringify(state));
        } catch (_) {}
    }

    function restoreState() {
        try {
            const saved = localStorage.getItem("haiere_state");
            if (!saved) return;
            const state = JSON.parse(saved);
            if (state.volume !== undefined) updateVolume(state.volume);
            shuffleMode = state.shuffle || false;
            repeatMode = state.repeat || false;
            ["btnShuffle", "dpShuffle"].forEach((id) => $(id)?.classList.toggle("on", shuffleMode));
            ["btnRepeat", "dpRepeat"].forEach((id) => $(id)?.classList.toggle("on", repeatMode));
            if (state.index !== undefined && SONGS[state.index]) {
                // Do not force route on restore; route handler will do it if URL has a song.
                if (!window.location.pathname.match(/^\/playing\//)) {
                    loadSong(state.index, false, false);
                }
            }
        } catch (_) {}
    }

    // ==================== SHARE ====================
    async function shareCurrentSong() {
        const song = SONGS[currentIndex];
        if (!song) return;
        const url = buildShareUrl(song);
        const data = {
            title: `${song.title} — ${song.artist}`,
            text: `Listen to ${song.title} by ${song.artist} on Haiere Signature Music.`,
            url,
        };
        if (navigator.share) {
            try {
                await navigator.share(data);
                return;
            } catch (err) {
                if (err.name === "AbortError") return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            showToast(t("toast.linkCopied"));
        } catch (_) {
            showToast(t("toast.clipboardFailed"));
        }
    }

    // ==================== EASTER EGG ====================
    let eggClicks = 0;
    let eggTimer = null;
    function registerEggClick() {
        eggClicks++;
        clearTimeout(eggTimer);
        eggTimer = setTimeout(() => { eggClicks = 0; }, 3000);
        if (eggClicks >= 5) {
            eggClicks = 0;
            clearTimeout(eggTimer);
            showToast(t("toast.easterEgg"));
            const logo = $("headerLogo");
            if (logo) {
                logo.style.transition = "transform 0.6s ease";
                logo.style.transform = "rotate(360deg) scale(1.08)";
                setTimeout(() => {
                    logo.style.transform = "";
                }, 700);
            }
        }
    }

    // ==================== INIT ====================
    function init() {
        // Apply language
        const langSel = $("langSel");
        if (langSel) {
            langSel.value = getLang();
            langSel.addEventListener("change", (e) => {
                setLang(e.target.value);
                showToast(t("toast.languageChanged"));
                renderPlaylist();
                if (SONGS[currentIndex]) loadSong(currentIndex, false, false);
            });
        }
        applyTranslations();

        // Render
        renderPlaylist();
        restoreState();
        if (!aud.src) loadSong(0, false, false);

        // Router
        initRouter(handleRouteChange);

        // Audio events
        aud.addEventListener("timeupdate", updateProgress);
        aud.addEventListener("ended", () => {
            if (repeatMode) {
                aud.currentTime = 0;
                aud.play();
            } else {
                playNext();
            }
        });
        aud.addEventListener("play", updatePlayButtons);
        aud.addEventListener("pause", updatePlayButtons);

        // Play buttons
        ["btnPlay", "bpPlay", "dpPlay"].forEach((id) =>
            $(id)?.addEventListener("click", togglePlay)
        );

        // Prev / next
        ["btnPrev", "dpPrev"].forEach((id) =>
            $(id)?.addEventListener("click", playPrev)
        );
        ["btnNext", "dpNext"].forEach((id) =>
            $(id)?.addEventListener("click", playNext)
        );

        // Shuffle
        ["btnShuffle", "dpShuffle"].forEach((id) =>
            $(id)?.addEventListener("click", () => {
                shuffleMode = !shuffleMode;
                ["btnShuffle", "dpShuffle"].forEach((i) =>
                    $(i)?.classList.toggle("on", shuffleMode)
                );
                showToast(shuffleMode ? t("toast.shuffleOn") : t("toast.shuffleOff"));
                saveState();
            })
        );

        // Repeat
        ["btnRepeat", "dpRepeat"].forEach((id) =>
            $(id)?.addEventListener("click", () => {
                repeatMode = !repeatMode;
                ["btnRepeat", "dpRepeat"].forEach((i) =>
                    $(i)?.classList.toggle("on", repeatMode)
                );
                showToast(repeatMode ? t("toast.repeatOn") : t("toast.repeatOff"));
                saveState();
            })
        );

        // Favorites
        ["btnFav", "dpFav", "bpFav"].forEach((id) =>
            $(id)?.addEventListener("click", toggleFav)
        );

        // Volume
        ["volSl", "volSetSl", "dpVolSl"].forEach((id) => {
            $(id)?.addEventListener("input", (e) =>
                updateVolume(parseFloat(e.target.value))
            );
        });

        // Navigation
        document.querySelectorAll(".bottom-nav .nav-btn[data-view]").forEach((el) => {
            el.addEventListener("click", () => showView(el.dataset.view));
        });
        document.querySelectorAll(".menu-item[data-view]").forEach((el) => {
            el.addEventListener("click", () => {
                showView(el.dataset.view);
                $("menuDrawer")?.classList.remove("show");
                $("menuOverlay")?.classList.remove("show");
            });
        });

        // Mini player → open player
        $("bpMini")?.addEventListener("click", () => {
            if (window.innerWidth < 768) showView("player");
        });

        // Desktop right-panel toggle
        $("btnMoreToggle")?.addEventListener("click", () => {
            const mainEl = $("mainArea");
            if (mainEl) {
                mainEl.classList.toggle("more-collapsed");
                const collapsed = mainEl.classList.contains("more-collapsed");
                const icon = $("moreToggleIcon");
                if (icon) icon.style.transform = collapsed ? "rotate(180deg)" : "rotate(0deg)";
            }
        });

        // Playlist filter
        document.querySelectorAll(".pl-filter-btn").forEach((btn) => {
            btn.addEventListener("click", () => setPlaylistFilter(btn.dataset.filter));
        });

        // Music search
        $("musicSearch")?.addEventListener("input", (e) => {
            musicQuery = e.target.value.trim();
            renderPlaylist();
        });

        // Mobile drawer
        $("menuToggle")?.addEventListener("click", () => {
            $("menuDrawer")?.classList.add("show");
            $("menuOverlay")?.classList.add("show");
        });
        const closeMenu = () => {
            $("menuDrawer")?.classList.remove("show");
            $("menuOverlay")?.classList.remove("show");
        };
        $("menuClose")?.addEventListener("click", closeMenu);
        $("menuOverlay")?.addEventListener("click", closeMenu);

        // Download modal
        const openModal = () => $("modalBg")?.classList.add("show");
        const closeModal = () => $("modalBg")?.classList.remove("show");
        ["btnDl", "dpDl", "setDl"].forEach((id) => $(id)?.addEventListener("click", openModal));
        $("modalBg")?.addEventListener("click", (e) => {
            if (e.target === $("modalBg")) closeModal();
        });
        $("optCatbox")?.addEventListener("click", () => {
            const url = $("optCatbox")?.dataset.url;
            if (url) window.open(url, "_blank", "noopener");
            closeModal();
        });

        // Share
        ["btnShare", "setShare"].forEach((id) => $(id)?.addEventListener("click", shareCurrentSong));

        // Sleep timer
        $("sleepGo")?.addEventListener("click", () => {
            const val = parseInt($("sleepSel")?.value || "0", 10);
            if (val > 0) startSleep(val);
        });
        $("sleepStop")?.addEventListener("click", clearSleep);
        $("btnTimer")?.addEventListener("click", () => {
            const panel = $("page-settings");
            if (panel) {
                showView("settings");
                panel.scrollIntoView({ behavior: "smooth" });
            }
        });
        $("dpTimer")?.addEventListener("click", () => {
            showView("settings");
        });

        // Not-found back
        $("notFoundBack")?.addEventListener("click", () => {
            navigate("/");
            showView("playlist");
        });

        // Easter egg
        $("headerLogo")?.addEventListener("click", (e) => {
            e.preventDefault();
            registerEggClick();
        });

        // Resize → redraw covers
        window.addEventListener("resize", () => {
            if (SONGS[currentIndex]) updateAllCovers(currentIndex);
        });

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
            switch (e.key) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    if (e.shiftKey) playNext();
                    else aud.currentTime = Math.min(aud.duration || 0, aud.currentTime + 5);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    if (e.shiftKey) playPrev();
                    else aud.currentTime = Math.max(0, aud.currentTime - 5);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    updateVolume(Math.min(1, getVol() + 0.05));
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    updateVolume(Math.max(0, getVol() - 0.05));
                    break;
                case "f":
                    toggleFav();
                    break;
                case "s":
                    $("btnShuffle")?.click();
                    break;
                case "r":
                    $("btnRepeat")?.click();
                    break;
            }
        });

        // Hide skeleton after first successful render
        requestAnimationFrame(() => {
            setTimeout(hideSkeleton, 300);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
