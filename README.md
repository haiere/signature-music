Signature Music

A web-based music player for streaming original albums by Muhaajir.

---

Overview

Signature Music is a modern, browser-based audio player designed to showcase original music releases. It provides a polished interface for listening to Muhaajir's albums, with playback controls, playlist management, favorites, and a sleep timer. The application runs entirely in the browser with no server-side dependencies.

---

Features

· Full-featured player — Play, pause, skip, seek, and control volume with dedicated controls.
· Playlist management — Browse all tracks, filter by favorites, and switch between albums.
· Favorites system — Mark tracks as favorites, stored locally in your browser.
· Shuffle and repeat — Toggle shuffle mode and repeat playback.
· Sleep timer — Set a timer to automatically pause playback after a specified duration.
· Keyboard shortcuts — Full keyboard support for playback and navigation.
· Download support — Direct download of tracks via the built-in modal.
· Share integration — Share the currently playing track via WhatsApp.
· Responsive design — Optimized for desktop, tablet, and mobile devices with adaptive layouts.
· Persistent state — Remembers your last played track, position, volume, and settings.

---

Preview

https://i.postimg.cc/8PJ0bhb1/H-haiere.webp

The application features a clean dark-themed interface with album art, playback controls, and a searchable playlist.

---

Requirements

· A modern web browser (Chrome, Firefox, Safari, Edge)
· Internet connection for initial loading of audio files
· No additional runtime, package manager, or build tools required

---

Installation

Signature Music is a single-page application. No installation is required.

Clone the repository

```bash
git clone https://github.com/haiere/signature-music.git
cd signature-music
```

Serve locally

Open index.html directly in your browser, or serve with a local development server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then navigate to http://localhost:8000 in your browser.

---

Quick Start

1. Open the application in your browser.
2. The first track loads automatically.
3. Use the play button to start playback.
4. Navigate between tracks using the next/previous buttons.
5. Explore the playlist view to see all available tracks.
6. Use the settings panel to adjust volume, set a sleep timer, or view keyboard shortcuts.

---

Usage

Playback Controls

Control Description
Play / Pause Starts or pauses the current track
Next / Previous Skips to the next or previous track
Seek bar Click or drag to jump to a specific position
Volume slider Adjusts playback volume
Shuffle Randomizes playback order
Repeat Repeats the current track

Navigation

· Home — Returns to the player view
· Songs — Opens the full playlist
· More — Opens settings and configuration

Favorites

Click the heart icon on any track or in the player to add it to your favorites. Favorites are stored locally in your browser and persist across sessions.

Sleep Timer

Set a timer (15, 30, 60, or 90 minutes) from the settings panel. Playback will automatically pause when the timer expires.

Keyboard Shortcuts

Shortcut Action
Space / K Play / Pause
Left / Right Seek backward / forward 5 seconds
Shift + Left / Right Previous / Next track
Up / Down Increase / Decrease volume
F Toggle favorite
S Toggle shuffle
R Toggle repeat
M Open download modal
T Open settings
Escape Close modal / menu

---

Configuration

The application uses localStorage to persist user preferences. No external configuration files are required.

Stored Preferences

Key Description
haiere_fav Favorites list (JSON object)
haiere_state Playback state including current track, position, volume, and sleep timer
haiere_vol Volume level
haiere_view Last active view

---

Project Structure

```
signature-music/
├── index.html          # Single-page application (HTML + CSS + JS)
└── README.md           # Documentation
```

The entire application is contained within a single HTML file, including all styles and JavaScript. This makes deployment simple and eliminates external dependencies.

---

Supported Platforms

· Desktop — Chrome, Firefox, Safari, Edge
· Tablet — iPad, Android tablets
· Mobile — iOS Safari, Android Chrome

The application adapts its layout automatically based on screen size.

---

Troubleshooting

Audio does not play

· Ensure you have an active internet connection.
· The audio files are hosted remotely; check if the URLs are accessible.
· Try reloading the page.

Favorites not persisting

· Favorites are stored in localStorage. Ensure your browser allows local storage.
· Clear site data and re-add favorites if they become corrupted.

Sleep timer not working

· The sleep timer requires the page to remain active. It may not function reliably if the browser tab is suspended.

Mobile layout issues

· Ensure your viewport is set correctly. The application uses viewport-fit=cover and responsive breakpoints.

---

Privacy Considerations

· All user data (favorites, state, preferences) is stored locally in the browser's localStorage.
· No data is transmitted to any external server.
· No analytics, tracking, or cookies are used.
· Audio files are hosted on third-party storage (catbox.moe) and are streamed directly to the client.

---

Performance Notes

· The application is a single-page static site with no external libraries or frameworks.
· Audio playback uses the native <audio> element with Opus codec support.
· Cover art is loaded from remote sources and cached in memory.
· All interactions are optimized for responsiveness with smooth animations.

---

Roadmap

☐ Add album and track metadata display
☐ Implement gapless playback
☐ Add dynamic album art for each track
☐ Support for local audio file upload
☐ Enhanced playlist sorting and search

---

Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes across supported browsers.
5. Submit a pull request with a clear description of the changes.

Development Guidelines

· Maintain the existing code style and structure.
· Keep the application self-contained within a single HTML file.
· Preserve accessibility standards.
· Ensure responsiveness across all supported platforms.
· Document any new features or changes.

---

Development Setup

1. Clone the repository.
2. Open index.html in your browser.
3. Make changes to the HTML, CSS, or JavaScript directly.
4. Refresh the browser to see updates.

No build tools or compilation steps are required.

---

Testing

Test the application across the following environments:

· Desktop — Chrome, Firefox, Safari, Edge
· Mobile — iOS Safari, Android Chrome
· Tablet — Responsive breakpoints at 820px and 480px

Verify that all features (playback, navigation, favorites, sleep timer, keyboard shortcuts) function correctly.

---

Build and Release

The application is distributed as a single HTML file. To create a release:

1. Update the version number if applicable.
2. Commit the final changes.
3. Tag the release and push to the repository.

---

License

This project is open source and available for personal and educational use.

---

Author

Created by Regina & Hajir Studio· Resonance Studio

---

Support and Contact

For issues, questions, or contributions, please open an issue on the repository.

Berikut versi README.md yang sudah dirapikan, distrukturkan ulang, dan dibersihkan tanpa emoji. Saya juga menyesuaikan gaya penulisan agar konsisten dengan README proyek sebelumnya.

```md
# Signature Music

A web-based music player for streaming original albums by Muhaajir.
```md
# Signature Music

A web-based music player for streaming original albums by Muhaajir.

Signature Music is a modern, browser-based audio player designed to showcase original music releases. It provides a polished interface for listening to Muhaajir's albums, with playback controls, playlist management, favorites, and a sleep timer. The application runs entirely in the browser with no server-side dependencies.

***

## Features

- Full-featured player — Play, pause, skip, seek, and control volume with dedicated controls.
- Playlist management — Browse all tracks, filter by favorites, and switch between albums.
- Favorites system — Mark tracks as favorites, stored locally in your browser.
- Shuffle and repeat — Toggle shuffle mode and repeat playback.
- Sleep timer — Set a timer to automatically pause playback after a specified duration.
- Keyboard shortcuts — Full keyboard support for playback and navigation.
- Download support — Direct download of tracks via the built-in modal.
- Share integration — Share the currently playing track via WhatsApp.
- Responsive design — Optimized for desktop, tablet, and mobile devices with adaptive layouts.
- Persistent state — Remembers your last played track, position, volume, and settings.

***

## Preview



The application features a clean dark-themed interface with album art, playback controls, and a searchable playlist.

***

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial loading of audio files
- No additional runtime, package manager, or build tools required

***

## Installation

Signature Music is a single-page application. No installation is required.

### Clone the repository

```bash
git clone https://github.com/haiere/signature-music.git
cd signature-music
```

### Serve locally

Open `index.html` directly in your browser, or serve with a local development server:

```bash
# Python 3
python -m http.server 8000
```

```bash
# Node.js
npx serve .
```

```bash
# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

***

## Quick Start

1. Open the application in your browser.
2. The first track loads automatically.
3. Use the play button to start playback.
4. Navigate between tracks using the next/previous buttons.
5. Explore the playlist view to see all available tracks.
6. Use the settings panel to adjust volume, set a sleep timer, or view keyboard shortcuts.

***

## UsageBerikut versi README.md yang sudah dirapikan, distrukturkan ulang, dan dibersihkan tanpa emoji. Saya juga menyesuaikan gaya penulisan agar konsisten dengan README proyek sebelumnya.

# Signature Music

A web-based music player for streaming original albums by Muhaajir.

Signature Music is a modern, browser-based audio player designed to showcase original music releases. It provides a polished interface for listening to Muhaajir's albums, with playback controls, playlist management, favorites, and a sleep timer. The application runs entirely in the browser with no server-side dependencies.

---

## Features

- Full-featured player — Play, pause, skip, seek, and control volume with dedicated controls.
- Playlist management — Browse all tracks, filter by favorites, and switch between albums.
- Favorites system — Mark tracks as favorites, stored locally in your browser.
- Shuffle and repeat — Toggle shuffle mode and repeat playback.
- Sleep timer — Set a timer to automatically pause playback after a specified duration.
- Keyboard shortcuts — Full keyboard support for playback and navigation.
- Download support — Direct download of tracks via the built-in modal.
- Share integration — Share the currently playing track via WhatsApp.
- Responsive design — Optimized for desktop, tablet, and mobile devices with adaptive layouts.
- Persistent state — Remembers your last played track, position, volume, and settings.

---

## Preview

![Signature Music Preview](https://i.postimg.cc/8PJ0bhb1/H-haiere.webp)

The application features a clean dark-themed interface with album art, playback controls, and a searchable playlist.

---

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial loading of audio files
- No additional runtime, package manager, or build tools required

---

## Installation

Signature Music is a single-page application. No installation is required.

### Clone the repository

```bash
git clone https://github.com/haiere/signature-music.git
cd signature-music
```

### Serve locally

Open `index.html` directly in your browser, or serve with a local development server:

```bash
# Python 3
python -m http.server 8000
```

```bash
# Node.js
npx serve .
```

```bash
# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

---

## Quick Start

1. Open the application in your browser.
2. The first track loads automatically.
3. Use the play button to start playback.
4. Navigate between tracks using the next/previous buttons.
5. Explore the playlist view to see all available tracks.
6. Use the settings panel to adjust volume, set a sleep timer, or view keyboard shortcuts.

---

## Usage

### Playback Controls

| Control | Description |
|---|---|
| Play / Pause | Starts or pauses the current track |
| Next / Previous | Skips to the next or previous track |
| Seek bar | Click or drag to jump to a specific position |
| Volume slider | Adjusts playback volume |
| Shuffle | Randomizes playback order |
| Repeat | Repeats the current track |

### Navigation

- **Home** — Returns to the player view
- **Songs** — Opens the full playlist
- **More** — Opens settings and configuration

### Favorites

Click the heart icon on any track or in the player to add it to your favorites. Favorites are stored locally in your browser and persist across sessions.

### Sleep Timer

Set a timer (15, 30, 60, or 90 minutes) from the settings panel. Playback will automatically pause when the timer expires.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Space / K | Play / Pause |
| Left / Right | Seek backward / forward 5 seconds |
| Shift + Left / Right | Previous / Next track |
| Up / Down | Increase / Decrease volume |
| F | Toggle favorite |
| S | Toggle shuffle |
| R | Toggle repeat |
| M | Open download modal |
| T | Open settings |
| Escape | Close modal / menu |

---

## Configuration

The application uses `localStorage` to persist user preferences. No external configuration files are required.

### Stored Preferences

| Key | Description |
|---|---|
| `haiere_fav` | Favorites list (JSON object) |
| `haiere_state` | Playback state including current track, position, volume, and sleep timer |
| `haiere_vol` | Volume level |
| `haiere_view` | Last active view |

---

## Project Structure

```
signature-music/
├── index.html          # Single-page application (HTML + CSS + JS)
└── README.md           # Documentation
```

The entire application is contained within a single HTML file, including all styles and JavaScript. This makes deployment simple and eliminates external dependencies.

---

## Supported Platforms

- **Desktop** — Chrome, Firefox, Safari, Edge
- **Tablet** — iPad, Android tablets
- **Mobile** — iOS Safari, Android Chrome

The application adapts its layout automatically based on screen size.

---

## Troubleshooting

### Audio does not play

- Ensure you have an active internet connection.
- The audio files are hosted remotely; check if the URLs are accessible.
- Try reloading the page.

### Favorites not persisting

- Favorites are stored in `localStorage`. Ensure your browser allows local storage.
- Clear site data and re-add favorites if they become corrupted.

### Sleep timer not working

- The sleep timer requires the page to remain active. It may not function reliably if the browser tab is suspended.

### Mobile layout issues

- Ensure your viewport is set correctly. The application uses `viewport-fit=cover` and responsive breakpoints.

---

## Privacy Considerations

- All user data (favorites, state, preferences) is stored locally in the browser's `localStorage`.
- No data is transmitted to any external server.
- No analytics, tracking, or cookies are used.
- Audio files are hosted on third-party storage (catbox.moe) and are streamed directly to the client.

---

## Performance Notes

- The application is a single-page static site with no external libraries or frameworks.
- Audio playback uses the native `<audio>` element with Opus codec support.
- Cover art is loaded from remote sources and cached in memory.
- All interactions are optimized for responsiveness with smooth animations.

---

## Roadmap

- Add album and track metadata display
- Implement gapless playback
- Add dynamic album art for each track
- Support for local audio file upload
- Enhanced playlist sorting and search

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes across supported browsers.
5. Submit a pull request with a clear description of the changes.

### Development Guidelines

- Maintain the existing code style and structure.
- Keep the application self-contained within a single HTML file.
- Preserve accessibility standards.
- Ensure responsiveness across all supported platforms.
- Document any new features or changes.

---

## Development Setup

1. Clone the repository.
2. Open `index.html` in your browser.
3. Make changes to the HTML, CSS, or JavaScript directly.
4. Refresh the browser to see updates.

No build tools or compilation steps are required.

---

## Testing

Test the application across the following environments:

- **Desktop** — Chrome, Firefox, Safari, Edge
- **Mobile** — iOS Safari, Android Chrome
- **Tablet** — Responsive breakpoints at 820px and 480px

Verify that all features (playback, navigation, favorites, sleep timer, keyboard shortcuts) function correctly.

---

## Build and Release

The application is distributed as a single HTML file. To create a release:

1. Update the version number if applicable.
2. Commit the final changes.
3. Tag the release and push to the repository.

---

## License

This project is open source and available for personal and educational use.

---

## Author

Created by Regina & Hajir Studio · Resonance Studio

---

## Support and Contact

For issues, questions, or contributions, please open an issue on the repository.
```
