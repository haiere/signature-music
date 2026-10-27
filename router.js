import { findSongBySlug, buildSongPath, buildSearchPath } from "./utils.js";
import { SONGS } from "./data-song.js";

const ROUTE_PLAYING = /^\/playing\/([^/]+)\/([^/]+)\/?$/;
const ROUTE_SEARCH = /^\/search\/([^/]+)\/([^/]+)\/?$/;

let onChange = null;

export function initRouter(handler) {
    onChange = handler;
    window.addEventListener("popstate", handleRoute);
    handleRoute();
}

export function navigate(path, replace = false) {
    if (replace) {
        history.replaceState({}, "", path);
    } else {
        history.pushState({}, "", path);
    }
    handleRoute();
}

function handleRoute() {
    const path = window.location.pathname;
    let song = null;
    let type = "home";

    const playingMatch = path.match(ROUTE_PLAYING);
    const searchMatch = path.match(ROUTE_SEARCH);

    if (playingMatch) {
        song = findSongBySlug(SONGS, playingMatch[1], playingMatch[2]);
        type = "playing";
    } else if (searchMatch) {
        song = findSongBySlug(SONGS, searchMatch[1], searchMatch[2]);
        type = "search";
    }

    if ((playingMatch || searchMatch) && !song) {
        if (onChange) onChange({ type: "not-found", song: null });
        return;
    }

    if (onChange) onChange({ type, song });
}

export function buildShareUrl(song) {
    return window.location.origin + buildSongPath(song);
}
