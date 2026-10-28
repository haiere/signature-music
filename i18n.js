export const translations = {
    en: {
        nav: { home: "Home", music: "Music", more: "More" },
        home: {
            greeting: "Welcome back",
            subtitle: "Your Signature Music session",
            featured: "Featured",
            recentlyPlayed: "Recently Played",
            quickAccess: "Quick Access",
            noRecent: "Nothing played yet."
        },
        music: {
            title: "Songs & Library",
            all: "All",
            favorites: "Favorites",
            searchPlaceholder: "Search songs, albums…",
            empty: "No songs match your search.",
            totalSongs: "Songs"
        },
        player: {
            selectSong: "Select a song…",
            albumBy: "Muhaajir · 2025",
            favorite: "Favorite",
            share: "Share",
            download: "Download",
            sleepTimer: "Sleep timer",
            playPause: "Play or pause",
            previous: "Previous track",
            next: "Next track",
            shuffle: "Shuffle",
            repeat: "Repeat",
            volume: "Volume"
        },
        settings: {
            title: "More Options",
            support: "Support",
            buyMeACoffee: "Buy Me a Coffee",
            buyMeACoffeeDesc: "Every cup fuels new tracks ☕",
            playback: "Playback",
            volume: "Volume",
            loudness: "Loudness",
            sleepTimer: "Sleep Timer",
            autoPause: "Auto pause",
            select: "Select",
            set: "Set",
            inactive: "Inactive",
            collection: "Collection",
            totalFavorites: "Total Favorites",
            songsYouLove: "Songs you love",
            quickActions: "Quick Actions",
            shareSong: "Share Song",
            shareViaWhatsApp: "Via WhatsApp",
            downloadSong: "Download Song",
            downloadDirect: "Muhaajir · Direct",
            keyboardShortcuts: "Keyboard Shortcuts",
            language: "Language",
            english: "English",
            indonesian: "Bahasa Indonesia",
            about: "About",
            version: "Version"
        },
        toast: {
            addedFav: "Added to favorites",
            removedFav: "Removed from favorites",
            shuffleOn: "Shuffle on",
            shuffleOff: "Shuffle off",
            repeatOn: "Repeat on",
            repeatOff: "Repeat off",
            linkCopied: "Link copied",
            shareFailed: "Could not share. Link copied instead.",
            clipboardFailed: "Could not copy link.",
            sleepEnded: "Sleep timer ended",
            audioError: "Unable to play this song. Please try again.",
            noSongs: "No songs available.",
            routeNotFound: "Song not found.",
            easterEgg: "🎵 You found the hidden signature. Keep listening.",
            languageChanged: "Language updated."
        },
        modal: {
            downloadTitle: "Download Song",
            selectServer: "Select download server",
            haiereStorage: "Haiere Storage",
            directStable: "Direct download · Stable"
        },
        notFound: {
            title: "Song not found",
            body: "The song you are looking for does not exist or has been moved.",
            back: "Back to Music"
        }
    },
    id: {
        nav: { home: "Beranda", music: "Musik", more: "Lainnya" },
        home: {
            greeting: "Selamat datang kembali",
            subtitle: "Sesi Signature Music Anda",
            featured: "Unggulan",
            recentlyPlayed: "Terakhir Diputar",
            quickAccess: "Akses Cepat",
            noRecent: "Belum ada yang diputar."
        },
        music: {
            title: "Lagu & Perpustakaan",
            all: "Semua",
            favorites: "Favorit",
            searchPlaceholder: "Cari lagu, album…",
            empty: "Tidak ada lagu yang cocok.",
            totalSongs: "Lagu"
        },
        player: {
            selectSong: "Pilih lagu…",
            albumBy: "Muhaajir · 2025",
            favorite: "Favorit",
            share: "Bagikan",
            download: "Unduh",
            sleepTimer: "Timer tidur",
            playPause: "Putar atau jeda",
            previous: "Lagu sebelumnya",
            next: "Lagu berikutnya",
            shuffle: "Acak",
            repeat: "Ulangi",
            volume: "Volume"
        },
        settings: {
            title: "Opsi Lainnya",
            support: "Dukungan",
            buyMeACoffee: "Traktir Kopi",
            buyMeACoffeeDesc: "Setiap cangkir membantu lagu baru ☕",
            playback: "Pemutaran",
            volume: "Volume",
            loudness: "Kenyaringan",
            sleepTimer: "Timer Tidur",
            autoPause: "Jeda otomatis",
            select: "Pilih",
            set: "Atur",
            inactive: "Tidak aktif",
            collection: "Koleksi",
            totalFavorites: "Total Favorit",
            songsYouLove: "Lagu yang Anda sukai",
            quickActions: "Aksi Cepat",
            shareSong: "Bagikan Lagu",
            shareViaWhatsApp: "Via WhatsApp",
            downloadSong: "Unduh Lagu",
            downloadDirect: "Muhaajir · Langsung",
            keyboardShortcuts: "Pintasan Keyboard",
            language: "Bahasa",
            english: "English",
            indonesian: "Bahasa Indonesia",
            about: "Tentang",
            version: "Versi"
        },
        toast: {
            addedFav: "Ditambahkan ke favorit",
            removedFav: "Dihapus dari favorit",
            shuffleOn: "Acak aktif",
            shuffleOff: "Acak nonaktif",
            repeatOn: "Ulangi aktif",
            repeatOff: "Ulangi nonaktif",
            linkCopied: "Tautan disalin",
            shareFailed: "Gagal membagikan. Tautan disalin.",
            clipboardFailed: "Gagal menyalin tautan.",
            sleepEnded: "Timer tidur selesai",
            audioError: "Tidak dapat memutar lagu ini. Silakan coba lagi.",
            noSongs: "Tidak ada lagu.",
            routeNotFound: "Lagu tidak ditemukan.",
            easterEgg: "🎵 Anda menemukan tanda tangan tersembunyi. Terus dengarkan.",
            languageChanged: "Bahasa diperbarui."
        },
        modal: {
            downloadTitle: "Unduh Lagu",
            selectServer: "Pilih server unduhan",
            haiereStorage: "Penyimpanan Haiere",
            directStable: "Unduhan langsung · Stabil"
        },
        notFound: {
            title: "Lagu tidak ditemukan",
            body: "Lagu yang Anda cari tidak ada atau telah dipindahkan.",
            back: "Kembali ke Musik"
        }
    }
};

let currentLang = "en";
try {
    const stored = localStorage.getItem("haiere_lang");
    if (stored === "en" || stored === "id") currentLang = stored;
} catch (_) {}

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    if (lang !== "en" && lang !== "id") return;
    currentLang = lang;
    try { localStorage.setItem("haiere_lang", lang); } catch (_) {}
    applyTranslations();
}

export function t(path) {
    const keys = path.split(".");
    let node = translations[currentLang];
    for (const key of keys) {
        if (node && typeof node === "object" && key in node) {
            node = node[key];
        } else {
            // fallback to English
            let fallback = translations.en;
            for (const k of keys) fallback = fallback?.[k];
            return fallback ?? path;
        }
    }
    return node ?? path;
}

export function applyTranslations() {
    // Plain text — only safe on leaf elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const text = t(key);
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });
    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    // Aria labels
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
        el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    // Title tooltips
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
    document.documentElement.lang = currentLang;
            }
