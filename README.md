# Signature Music

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Static Badge](https://img.shields.io/badge/Single%20File-HTML%20App-blue.svg)
![Privacy First](https://img.shields.io/badge/privacy-first-purple.svg)

A responsive, web-based music player designed for independent artists and curated listening experiences.

Signature Music is a single-file HTML application that delivers a polished, full-featured audio player with a modern three-panel desktop layout and a mobile-optimised bottom navigation. It is built to showcase albums and tracks with zero server dependencies, making it ideal for portfolio projects, artist websites, or private listening collections.

---

## Overview

Haiere solves the problem of presenting a curated music catalogue in a clean, interactive interface without requiring a backend or external libraries. It is designed for:

- Artists and labels — to share their work with a professional player.
- Developers — who need a lightweight, customisable music player.
- End users — who want a seamless listening experience across devices.

The player stores preferences locally, supports keyboard shortcuts, and adapts gracefully from desktop to mobile screens.

---

## Features

- Playlist Management — browse and filter a predefined list of tracks by album or favourites.
- Favourites — mark tracks as favourites; persist across sessions using `localStorage`.
- Playback Controls — play, pause, skip, shuffle, and repeat with visual feedback.
- Sleep Timer — automatically pause playback after a chosen duration (15, 30, 60, or 90 minutes).
- Volume Control — independent slider with real-time percentage display.
- Progress Bar — click or drag to seek; shows current and total time.
- Keyboard Shortcuts — full control via keyboard (Space, arrows, F, S, R, M, T, etc.).
- Responsive Layout — three-panel grid on desktop (Songs, Home, More); bottom navigation with mini player on mobile.
- Album Artwork — dynamic cover display with fallback.
- Media Session API — integrates with system media controls where supported.
- Persistent State — remembers current track, position, volume, shuffle, repeat, and sleep timer across sessions.

---

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge, or any browser that supports ES6, CSS Grid, Flexbox, and the `<audio>` element).
- Internet connection to load remote audio files and cover images hosted externally.
- No server, build tools, or runtime dependencies.

---

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

---

## Quick Start

1. Open `index.html` in your browser.
2. Select a song from the playlist, either the left panel on desktop or the Songs tab on mobile.
3. Use the play button or keyboard shortcuts to control playback.
4. Adjust volume, enable shuffle or repeat, or set a sleep timer from the settings panel.

No configuration files or environment variables are required.

---

## Usage

### Desktop Layout

| Panel | Content |
|---|---|
| Left | Playlist with filter (All / Favourites) |
| Centre | Player controls, artwork, track info |
| Right | Settings, about, and quick actions |

### Mobile Layout

- Bottom Navigation — switch between Home (player), Songs (playlist), and More (settings).
- Mini Player — shows current track, playback controls, and favourite button at the bottom.

### Keyboard Shortcuts

| Key | Action |
|---|---|
| Space / K | Play / Pause |
| ← / → | Seek backward / forward 5s |
| Shift+← / → | Previous / Next track |
| ↑ / ↓ | Increase / Decrease volume |
| F | Toggle favourite |
| S | Toggle shuffle |
| R | Toggle repeat |
| M | Open download modal |
| T | Open settings (timer) |
| Esc | Close modals / menus |

---

## Configuration

All user preferences are stored in the browser’s `localStorage`:

- `haiere_fav` — favourites list.
- `haiere_vol` — volume level.
- `haiere_state` — current track index, playback position, shuffle, repeat, and sleep timer state.

There is no external configuration file.

---

## Project Structure

The entire application is contained in a single file:

```text
index.html
```

It includes:

- HTML structure with semantic markup and accessibility support.
- Embedded CSS with variables, responsive breakpoints, and glass-morphism styling.
- Embedded JavaScript for state management, audio control, and UI updates.

No additional assets or directories are required.

---

## Supported Platforms

- Desktop — Windows, macOS, Linux, any modern browser.
- Tablet — iPadOS, Android browser.
- Mobile — iOS Safari, Android Chrome, with touch-friendly controls and safe-area padding.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Audio does not play | Check your internet connection; the audio files are hosted externally. |
| Cover images not loading | Ensure the image URLs are accessible; fallback will use a solid colour. |
| Keyboard shortcuts not working | Focus may be inside an input or select field; click outside or use the controls. |
| Layout breaks on small screens | Refresh the page; the layout uses `viewport-fit=cover` and safe-area insets. |

---

## Security Considerations

- All audio and image resources are loaded from external services over HTTPS.
- No user data is sent to any server; all state is stored locally.
- The application does not use cookies or tracking.

---

## Privacy Considerations

- Favourites and playback state are stored only in the browser’s `localStorage`.
- No personal information is collected, transmitted, or shared.
- The application does not include analytics or third-party scripts except Google Fonts, if enabled.

---

## Performance Notes

- Single-file architecture reduces network requests.
- Cover images are lazy-loaded.
- Volume changes use smooth fade transitions.
- DOM updates are efficient and do not rely on heavy frameworks.

---

## Roadmap

Potential future enhancements, not currently implemented:

- Support for custom playlists, either user-uploaded or via URLs.
- Offline caching via service worker.
- Lyrics display.
- Equaliser.
- Additional audio sources, including local files.

---

## Contributing

This project is currently maintained as a demonstration. Contributions are not actively sought, but feedback and suggestions are welcome.

---

## Development Setup

As a static HTML file, no build tools are required. To modify the project:

1. Edit the `SONGS` array in the JavaScript to update the track list.
2. Adjust CSS variables in the `<style>` block for theming.
3. Extend functionality by adding new event listeners or UI elements.

---

## License

License not specified. All rights reserved by the original author unless otherwise stated.

---

## Author

Regina & Muhaajir, And More· Resonance Studio  
Maintainer: Regina (placeholder)  
Developed by Haiere and HajirStudio

---

## Support and Contact

For questions or feedback, please open an issue in the repository, if available, or contact the author via the provided email.
