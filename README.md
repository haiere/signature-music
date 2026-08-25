# Signature Music

[![Version](https://img.shields.io/badge/version-2.11.4-blue)](https://github.com/haiere/signature-music/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/website-live-purple)](https://signature-music.netlify.app)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20client--side-success)](#)


> A premium, Hi‑Res web music player built for independent artists and curated listening experiences. Stream original albums with a modern dark interface, favourites, sleep timer, and full playback controls — all in a single HTML file with zero server dependencies.


**Live Demo:** [signature-music.netlify.app](https://signature-music.netlify.app/)

***

## Overview

Signature Music solves the problem of presenting a curated music catalogue in a clean, interactive interface without requiring a backend or external libraries. It is designed for:

- **Artists and labels** — to share their work with a professional player.
- **Developers** — who need a lightweight, customisable music player.
- **End users** — who want a seamless listening experience across devices.

The player stores preferences locally, supports keyboard shortcuts, and adapts gracefully from desktop to mobile screens.

***

## Features

- **Full Playlist** — 13 tracks from Muhaajir's discography, filterable by album or favourites.
- **Favourites** — Mark tracks as favourites; persist across sessions using `localStorage`.
- **Playback Controls** — Play, pause, skip, shuffle, and repeat with visual feedback.
- **Sleep Timer** — Automatically pause playback after a chosen duration (15, 30, 60, or 90 minutes).
- **Direct Download** — Get the current song with one click.
- **Share** — Share the current track via WhatsApp.
- **Volume Control** — Independent slider with real-time percentage display.
- **Progress Bar** — Click or drag to seek; shows current and total time.
- **Keyboard Shortcuts** — Full control via keyboard (Space, K, arrows, F, S, R, M, T, Esc).
- **Responsive Layout** — Three-panel grid on desktop (Songs, Home, More); bottom navigation with mini player on mobile.
- **Album Artwork** — Dynamic cover display with fallback.
- **Media Session API** — Integrates with system media controls where supported.
- **Persistent State** — Remembers current track, position, volume, shuffle, repeat, and sleep timer across sessions.
- **Dark & Glass‑Morphism UI** — Modern, elegant, and easy on the eyes.

***

## Built With

- **Vanilla JavaScript** (ES modules)
- **CSS3** with custom properties, flexbox, and grid
- **HTML5** with semantic tags
- **Web Audio API** for smooth playback
- **Media Session API** for system media controls (desktop)
- **Fonts:** Inter, Outfit, JetBrains Mono (Google Fonts)

***

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge, or any browser that supports ES6, CSS Grid, Flexbox, and the `<audio>` element).
- Internet connection to load remote audio files and cover images hosted externally.
- No server, build tools, or runtime dependencies.

***

## Installation

### Direct Download

1. Download the `index.html` file from the repository.
2. Open it in your browser.

### Clone Repository

```bash
git clone https://github.com/haiere/signature-music.git
cd signature-music
```

Then open `index.html` in your browser.

### Local Development Server

```bash
npx serve
```

***

## Quick Start

1. Open `index.html` in your browser.
2. Select a song from the playlist, either the left panel on desktop or the Songs tab on mobile.
3. Use the play button or keyboard shortcuts to control playback.
4. Adjust volume, enable shuffle or repeat, or set a sleep timer from the settings panel.

No configuration files or environment variables are required.

***

## Usage

### Desktop Layout

| Panel | Content |
|---|---|
| Left | Playlist with filter (All / Favourites) |
| Centre | Player controls, artwork, track info |
| Right | Settings, about, and quick actions |

### Mobile Layout

- **Bottom Navigation** — Switch between Home (player), Songs (playlist), and More (settings).
- **Mini Player** — Shows current track, playback controls, and favourite button at the bottom.

### Responsive Behaviour

- **Desktop (≥768px):** Three‑column layout → Songs | Player | Settings
- **Mobile (<768px):** Single‑page views with a bottom dock and slide‑out menu

***

## Keyboard Shortcuts

| Key / Combo | Action |
|---|---|
| Space / K | Play / Pause |
| ← / → | Seek backward / forward 5s |
| Shift + ← / → | Previous / Next track |
| ↑ / ↓ | Increase / Decrease volume |
| F | Toggle favourite |
| S | Toggle shuffle |
| R | Toggle repeat |
| M | Open download modal |
| T | Open settings (timer) |
| Esc | Close modals / menus |

***

## Configuration

All user preferences are stored in the browser's `localStorage`:

- `haiere_fav` — Favourites list.
- `haiere_vol` — Volume level.
- `haiere_state` — Current track index, playback position, shuffle, repeat, and sleep timer state.

There is no external configuration file.

***

## Project Structure

```text
/
├── index.html          # Main HTML document (includes embedded CSS and JS)
├── style.css           # All styles (responsive + glass UI) [optional, if separated]
├── script.js           # Application logic (player, state, UI) [optional, if separated]
├── data-song.js        # Song data (title, artist, URL, cover)
└── README.md           # This file
```

The entire application can be contained in a single file (`index.html`) with embedded CSS and JavaScript, or split into separate files for clarity.

***

## Data Source

Songs are stored in `data-song.js` as an array of objects:

```javascript
export const SONGS = [
  {
    name: "Lintasan Tak Bermakna",
    group: "Fragmen Suara",
    url: "https://files.catbox.moe/7p3gmt.opus",
    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp"
  },
  // ...
];
```

Covers and audio files are hosted on catbox.moe and postimg.cc.

***

## Supported Platforms

- **Desktop** — Windows, macOS, Linux, any modern browser.
- **Tablet** — iPadOS, Android browser.
- **Mobile** — iOS Safari, Android Chrome, with touch-friendly controls and safe-area padding.

***

## Troubleshooting

| Issue | Solution |
|---|---|
| Audio does not play | Check your internet connection; the audio files are hosted externally. |
| Cover images not loading | Ensure the image URLs are accessible; fallback will use a solid colour. |
| Keyboard shortcuts not working | Focus may be inside an input or select field; click outside or use the controls. |
| Layout breaks on small screens | Refresh the page; the layout uses `viewport-fit=cover` and safe-area insets. |

***

## Security Considerations

- All audio and image resources are loaded from external services over HTTPS.
- No user data is sent to any server; all state is stored locally.
- The application does not use cookies or tracking.

***

## Privacy Considerations

- Favourites and playback state are stored only in the browser's `localStorage`.
- No personal information is collected, transmitted, or shared.
- The application does not include analytics or third-party scripts except Google Fonts, if enabled.

***

## Performance Notes

- Single-file architecture reduces network requests.
- Cover images are lazy-loaded.
- Volume changes use smooth fade transitions.
- DOM updates are efficient and do not rely on heavy frameworks.

***

## Roadmap

Potential future enhancements, not currently implemented:

- Support for custom playlists, either user-uploaded or via URLs.
- Offline caching via service worker.
- Lyrics display.
- Equaliser.
- Additional audio sources, including local files.

***

## Contributing

This project is currently maintained as a demonstration. Contributions are not actively sought, but feedback and suggestions are welcome.

***

## Development Setup

As a static HTML file, no build tools are required. To modify the project:

1. Edit the `SONGS` array in the JavaScript to update the track list.
2. Adjust CSS variables in the `<style>` block for theming.
3. Extend functionality by adding new event listeners or UI elements.

***

## License

Signature Music is released under the MIT license. See the `LICENSE` file for full details.

All musical content belongs to the respective copyright holders.

***

## Credits

- **Artist:** Muhaajir
- **Design & Development:** Regina · Resonance Studio
- **Typography:** Google Fonts (Inter, Outfit, JetBrains Mono)
- **Maintainer:** Regina (placeholder)
- **Developed by:** Haiere and HajirStudio

***

## Support and Contact

For questions or feedback, please open an issue in the repository, if available, or contact the author via the provided email.

***

**Last updated:** 2026