<div align="center">

<img src="https://i.postimg.cc/VLrVFjF1/haieresignaturebiru.webp" alt="Haiere Signature Music Logo" width="140" />

# Signature Music

<a href="https://signature-music.vercel.app/">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=600&size=20&pause=1000&color=A78BFA&center=true&vCenter=true&width=600&lines=A+premium+web+music+player;Curated+albums+and+independent+releases;No+backend,+no+account,+no+build+step" alt="Typing SVG" />
</a>

<br />

<a href="https://signature-music.vercel.app/">
  <img src="https://img.shields.io/badge/Live_Player-signature--music.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Open Signature Music" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Artist-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Support Signature Music on Buy Me a Coffee" />
</a>

<br />

<img src="https://img.shields.io/badge/Version-2.11.5-blue?style=flat-square" alt="Version 2.11.5" />
<img src="https://img.shields.io/badge/Status-Live-purple?style=flat-square" alt="Website live" />
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />

<br />

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
<img src="https://img.shields.io/badge/Media_Session-API-8B5CF6?style=flat-square" alt="Media Session API" />
<img src="https://img.shields.io/badge/Privacy-Client_Side-success?style=flat-square" alt="Client-side privacy" />
<img src="https://img.shields.io/badge/i18n-EN_%2F_ID-blueviolet?style=flat-square" alt="Bilingual English and Indonesian" />
<img src="https://img.shields.io/badge/Routing-History_API-0EA5E9?style=flat-square" alt="Client-side History API routing" />
<img src="https://img.shields.io/badge/UI-Skeleton_Screen-64748B?style=flat-square" alt="Skeleton screen loading state" />
<img src="https://img.shields.io/badge/A11y-Keyboard_Ready-22C55E?style=flat-square" alt="Keyboard accessible" />

</div>

---

<div align="center">

### Table of Contents

<table>
<tr>
<td valign="top" width="33%">

**Getting Started**

- [Overview](#overview)
- [What's New in v2.11.5](#whats-new-in-v2115)
- [Features](#features)
- [Built With](#built-with)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)

</td>
<td valign="top" width="33%">

**Reference**

- [Usage](#usage)
- [URL Routes](#url-routes)
- [Internationalization](#internationalization)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Local Storage](#local-storage)
- [Project Structure](#project-structure)
- [Music Data](#music-data)
- [Supported Platforms](#supported-platforms)
- [Privacy](#privacy)

</td>
<td valign="top" width="33%">

**Community**

- [Security Considerations](#security-considerations)
- [Performance Notes](#performance-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Development Setup](#development-setup)
- [License](#license)
- [Credits](#credits)
- [Support and Contact](#support-and-contact)

</td>
</tr>
</table>

</div>

---

## Overview

> **Signature Music** is a static web music player designed for independent artists, labels, and curated music catalogues.

<table>
<tr>
<td width="33%" valign="top">

### For Artists and Labels

Share original releases through a polished web player with shareable song links and dynamic metadata.

</td>
<td width="33%" valign="top">

### For Developers

Use a lightweight, customisable music player without a backend, framework, or complex build step.

</td>
<td width="33%" valign="top">

### For Listeners

Browse albums, save favourites, and enjoy responsive playback controls across devices, with a bilingual interface.

</td>
</tr>
</table>

The player provides playlist browsing, favourites, shuffle and repeat controls, a sleep timer, direct downloads, shareable song URLs, bilingual support, responsive layouts, and system media controls where supported by the browser.

> [!NOTE]
> The application does not require a user account or external database. User preferences (favourites, volume, playback state, shuffle, repeat, sleep-timer state, and language) are stored locally in the browser.

---

## What's New in v2.11.5

<table>
<tr>
<td width="50%" valign="top">

### Interface and Experience

- Replaced the loading spinner with a modern skeleton screen featuring smooth shimmer animations that respect `prefers-reduced-motion`.
- Added a bilingual user interface (English and Indonesian) with a seamless language switcher.
- Added a dedicated not-found view for invalid song routes.
- Implemented comprehensive error states for audio, artwork, empty playlists, and clipboard failures.
- Improved accessibility with `aria-label` attributes, slider roles, and complete keyboard navigation.
- Added a mobile bottom navigation dock and mini player.
- Added a subtle ambient background with floating visual orbs.

</td>
<td width="50%" valign="top">

### Playback and State

- Implemented shareable, SEO-friendly song URLs using the History API.
- Added dynamic SEO per active song (Title, Description, Open Graph, Twitter Cards, Canonical).
- Added per-song audio error handling with user-friendly toast notifications.
- Guaranteed fallback artwork for every track to prevent broken images.
- Refactored the song data schema for consistency and future scalability.
- Integrated the Media Session API for OS-level media controls.
- Added a lightweight, non-intrusive easter egg.

</td>
</tr>
</table>

---

## Features

### Playlist

- 13 tracks from Muhaajir's discography.
- Filter tracks by all songs or favourites.
- Search across titles, albums, and artist names.
- Display album, artist, duration, and artwork information.
- Automatically highlight the currently playing track.

### Playback Controls

<table>
<tr>
<td width="50%" valign="top">

- Play and pause with smooth fade-in and fade-out.
- Previous and next track navigation.
- Seek backward and forward.
- Shuffle mode.
- Repeat mode.
- Progress bar with click seeking.

</td>
<td width="50%" valign="top">

- Volume control with percentage display.
- Sleep timer (15, 30, 60, or 90 minutes).
- Playback-state persistence across page reloads.
- Audio error handling with user-friendly messages.

</td>
</tr>
</table>

### Favourites

- Mark tracks as favourites.
- Filter the playlist to show favourites only.
- Save favourites across browser sessions.
- Store favourite state locally using `localStorage`.

### Sharing

- Share the current track through the Web Share API when available.
- Fallback to copying a shareable song URL to the clipboard.
- Copied links follow the `/playing/:slug/:artist` route and open the correct track when visited.

### Artwork

- Dynamic album artwork rendered to HTML canvas.
- Album-specific cover images.
- Guaranteed fallback artwork when a remote image fails to load.
- Per-song fallback URL defined in the song data.

### Bilingual Interface

- English and Indonesian translations.
- Centralized translation file.
- Language preference persisted in `localStorage` under `haiere_lang`.
- Text, placeholders, tooltips, and aria labels translated through `data-i18n` attributes.

### Interface

<table>
<tr>
<td width="50%" valign="top">

- Dark glass-style interface.
- Desktop three-panel layout.
- Mobile bottom navigation with Home, Music, and More.
- Mobile mini player.
- Touch-friendly controls.
- Skeleton loading screen with shimmer effect.

</td>
<td width="50%" valign="top">

- Safe-area support for notched devices (iOS).
- Ambient background effects.
- Keyboard shortcuts.
- Responsive album-art layout.
- Accessible focus states.
- Branded Haiere Signature Music identity.

</td>
</tr>
</table>

---

## Built With

| Layer | Used |
|---|---|
| **Markup** | HTML5 semantic elements |
| **Styling** | CSS3, CSS custom properties, CSS Grid, Flexbox, CSS Animations |
| **Logic** | Vanilla JavaScript, JavaScript ES modules |
| **Audio** | HTML5 Audio API |
| **System Integration** | Media Session API where supported |
| **Routing** | History API (`pushState`, `replaceState`, `popstate`) |
| **Typography** | Google Fonts (Inter, Outfit, JetBrains Mono) |
| **Deployment** | Vercel static hosting with URL rewrites |

> No framework or package installation is required for the static application.

---

## Requirements

| Requirement | Details |
|---|---|
| **Browser** | A modern web browser with JavaScript enabled |
| **Audio** | Support for the HTML `<audio>` element |
| **Modules** | Support for ES modules |
| **Layout** | Support for CSS Grid and Flexbox |
| **Network** | Access to load remote audio and artwork resources |
| **Deployment** | A static host that supports URL rewrites for client-side routing |

**Recommended browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari, Modern Android and iOS browsers.

> [!NOTE]
> Some features, especially Media Session controls and automatic downloads, may behave differently depending on the browser and OS.

---

## Installation

### Use the Live Version

<div align="center">

**[signature-music.vercel.app](https://signature-music.vercel.app/)**

</div>

### Clone the Repository

```bash
git clone https://github.com/haiere/signature-music.git
cd signature-music
```

Then open index.html in a modern browser.

Use a Local Development Server

For reliable ES module behavior and History API routing, use a local static server or the Vercel CLI:

<table>
<tr>
<td width="50%" valign="top">

Node.js

```bash
npx serve .
```

</td>
<td width="50%" valign="top">

Vercel (Recommended for routing)

```bash
npx vercel dev
```

</td>
</tr>
</table>

Then open the local URL printed by the server, typically http://localhost:3000.

[!NOTE]
No build step, package installation, environment variable, or backend service is required. 
Direct navigation to /playing/... and /search/... routes requires the host to rewrite unknown paths to index.html. vercel.json handles this on Vercel. Plain static servers that do not rewrite URLs will return a 404 on direct access, though in-app navigation still works.

---

Quick Start

1. Open Signature Music.
2. Select a song from the playlist.
3. Press the play button.
4. Use the progress bar to seek through the track.
5. Adjust the volume or enable shuffle/repeat.
6. Add tracks to your favourites.
7. Open the More panel to use the sleep timer or change the language.
8. Share or download the current track when available.
9. Support the artist through the Buy Me a Coffee button if you enjoy the music.

---

Usage

Desktop Layout

Panel Content
Left panel Playlist, search, filters, favourites filter, and donation card
Centre panel Album artwork, track information, and playback controls
Right panel Settings, sleep timer, language, quick actions, information, and support links

The right panel can be collapsed with the "More" button in the top action row.

Mobile Layout

<table>
<tr>
<td width="50%" valign="top">

· Home - Main player, artwork, track information, and playback controls.
· Music - Playlist, search, filters, and favourite filtering.
· More - Settings, sleep timer, language, about information, and support links.

</td>
<td width="50%" valign="top">

· Mini player - Persistent playback controls at the bottom of the screen.
· Header - Branding, donation action, and menu controls.
· Menu drawer - Full navigation and external links.

</td>
</tr>
</table>

Responsive Behavior

Viewport Layout
Desktop (768px and above) Three-panel layout (Songs, Player, Settings)
Mobile (below 768px) Single-view navigation with bottom dock and mini player

---

URL Routes

Route Behavior
/ Home. Restores the last active song without forcing a route change.
/playing/:song-slug/:artist-slug Loads the matching song, updates the player, and opens the Home view.
/search/:song-slug/:artist-slug Loads the matching song and opens the Music view.
Unknown /playing/... or /search/... Displays the not-found view with a link back to Music.

Slugs are generated from the song title and artist name by the slugify helper in utils.js.

Example: /playing/lintasan-tak-bermakna/muhaajir

Song routes are read on page load and on browser navigation. Autoplay is not triggered without user interaction.

---

Internationalization

The interface supports two languages: English (en) and Indonesian (id).

How it works

· Translations live in i18n.js.
· UI elements reference translation keys through data-i18n, data-i18n-placeholder, data-i18n-aria, and data-i18n-title attributes.
· The active language is stored in localStorage under haiere_lang.
· The language switcher is available in the More panel.
· Missing keys fall back to English gracefully.

Adding a new translation

1. Add the key to both en and id objects in i18n.js.
2. Reference the key from HTML using the appropriate data-i18n-* attribute.
3. Optionally call applyTranslations() after dynamic content changes.

---

Keyboard Shortcuts

Key or Combination Action
Space or K Play or pause
Left Arrow / Right Arrow Seek backward or forward 5 seconds
Shift + Left Arrow / Shift + Right Arrow Previous or next track
Up Arrow / Down Arrow Increase or decrease volume
F Toggle favourite
S Toggle shuffle
R Toggle repeat

[!NOTE]
Keyboard shortcuts are ignored when focus is inside a text input, select element, or other form control.

---

Local Storage

Signature Music stores preferences locally in the browser.

Key Stored Data
haiere_fav Favourite track identifiers
haiere_vol Volume level
haiere_state Current track, volume, shuffle, and repeat state
haiere_view Last active mobile view
haiere_lang Preferred language (en or id)

Local storage is scoped to the website origin and persists across browser sessions in normal browsing mode.

[!NOTE]
Clearing site data, changing browser profiles, or using private browsing may remove stored preferences. The application does not use local storage as a cloud synchronization system.

---

Project Structure

```text
signature-music/
├── index.html          # Main HTML document and application layout
├── style.css           # Responsive layout, theme, skeleton, and components
├── script.js           # Player logic, controls, state, and UI interactions
├── data-song.js        # Track catalogue and media metadata
├── utils.js            # Shared helpers: slugify, formatTime, song lookup, URL builders
├── i18n.js             # Bilingual translations and language switching
├── router.js           # History API routing for /playing and /search
├── vercel.json         # URL rewrites for client-side routing
├── README.md           # Project documentation
└── LICENSE             # MIT license
```

The project uses separate files to make maintenance, customization, and deployment easier.

---

Music Data

Track information is stored in data-song.js as an array of objects.

```javascript
export const SONGS = [
  {
    id: "lintasan-tak-bermakna",
    title: "Lintasan Tak Bermakna",
    artist: "Muhaajir",
    album: "Fragmen Suara",
    year: 2025,
    duration: "00:00",
    audioUrl: "https://files.catbox.moe/7p3gmt.opus",
    coverUrl: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp",
    fallbackCoverUrl: "https://i.postimg.cc/8PJ0bhb1/H-Muhaajir.webp",
    genre: "Indie",
    description: "Original track from Fragmen Suara by Muhaajir.",
    lyricsUrl: "",
    featured: false
  }
];
```

Typical fields:

Field Description
id Unique, stable identifier for the song
title Track title
artist Artist name
album Album, collection, or release name
year Release year
duration Static placeholder; the real duration is read at runtime from the audio element
audioUrl Remote audio file URL
coverUrl Album-art or track-art URL
fallbackCoverUrl Fallback artwork used when coverUrl fails to load
genre Genre label
description Short description used for metadata
lyricsUrl Optional URL for lyrics
featured Boolean flag for featured status

Remote Media Hosting

Audio and artwork are hosted externally (files.catbox.moe for audio, i.postimg.cc for artwork). The availability, speed, download behavior, and CORS configuration of external hosts may affect playback and downloads.

When adding new tracks

· Use HTTPS URLs.
· Confirm that the audio file is publicly accessible.
· Confirm that the browser can load the audio resource.
· Provide a fallbackCoverUrl for every track.
· Verify that you have permission to distribute the music and artwork.

---

Supported Platforms

<table>
<tr>
<td width="33%" valign="top">

Desktop

· Windows
· macOS
· Linux
· Modern desktop browsers

</td>
<td width="33%" valign="top">

Tablet

· iPadOS browsers
· Android tablet browsers
· Touch-enabled Chromium and WebKit browsers

</td>
<td width="33%" valign="top">

Mobile

· iOS Safari
· Android Chrome
· Other modern mobile browsers

</td>
</tr>
</table>

[!NOTE]
Mobile playback behavior may be affected by operating-system restrictions, background-tab policies, battery-saving modes, and user interaction requirements.

---

Privacy

Signature Music does not require an account or collect personal profile information for its core features.

<table>
<tr>
<td width="50%" valign="top">

During Normal Use

· Favourites and preferences are stored locally.
· The application does not require a remote user database.
· The application does not intentionally transmit favourite lists or playback state.
· The application does not require tracking cookies.
· Audio and cover resources are loaded from their configured external URLs.

</td>
<td width="50%" valign="top">

External Requests

The application may request:

· Remote audio files
· Remote album artwork
· Google Fonts
· The Buy Me a Coffee page when the donation link is selected

</td>
</tr>
</table>

[!IMPORTANT]
The external media host may be able to observe requests for resources it serves. The "client-side" privacy badge refers to local preference processing, not to the network behavior of external audio, image, font, or donation services.

---

Security Considerations

Only use audio and artwork URLs from sources you trust.

<table>
<tr>
<td width="50%" valign="top">

Best Practices

· Confirm that remote media URLs use HTTPS.
· Do not place private or access-controlled media URLs in a public repository.
· Do not include API keys or secret tokens in data-song.js.
· Avoid embedding personal information in track metadata unless intended.
· Review third-party hosting terms before distributing copyrighted media.

</td>
<td width="50%" valign="top">

Deployment

· Use a Content Security Policy when deploying the player on your own domain.
· Validate media URLs before adding them to the catalogue.
· Treat downloaded media according to the license and rights associated with the original content.

</td>
</tr>
</table>

[!WARNING]
The player does not provide access control. Anyone who can access the public application may be able to inspect configured track URLs.

---

Performance Notes

<table>
<tr>
<td width="50%" valign="top">

Design Choices

· Skeleton screen prevents layout shift while content loads.
· Separate assets improve maintainability and browser caching.
· CSS custom properties reduce repeated styling values.
· The player avoids large frontend frameworks.
· DOM updates are limited to relevant controls and panels.
· Ambient background effects use hardware-accelerated CSS animations.
· Reduced-motion preferences are respected where supported.

</td>
<td width="50%" valign="top">

For Better Performance

· Use appropriately sized artwork.
· Prefer efficient audio formats.
· Avoid unnecessarily large source files.
· Compress cover images before hosting them.
· Keep the playlist data lightweight.

</td>
</tr>
</table>

[!NOTE]
Remote audio performance depends on the media host and network connection. Large artwork files may increase memory usage on mobile devices.

---

Troubleshooting

<details>
<summary><b>Audio does not play</b></summary>

<br />

Check that:

· Your internet connection is working.
· The audio URL is accessible.
· The audio format is supported by your browser.
· The media host permits browser playback.
· The browser has received a user interaction.
· The device is not muted.

</details>

<details>
<summary><b>Artwork does not load</b></summary>

<br />

Check that:

· The image URL is correct.
· The image host is accessible and uses HTTPS.
· The fallback artwork appears when the remote image fails.

</details>

<details>
<summary><b>A song URL does not open after refresh</b></summary>

<br />

Client-side routes such as /playing/... and /search/... require the host to rewrite unknown paths to index.html.

· On Vercel, this is handled by vercel.json.
· On other static hosts, configure an equivalent rewrite rule.
· On plain local servers, use npx vercel dev for full routing support.

In-app navigation to a song still updates the URL even without rewrites.

</details>

<details>
<summary><b>The language does not change</b></summary>

<br />

Check that:

· The language switcher is inside the More panel.
· localStorage is available and not blocked by the browser.
· The page is not in a restricted private mode that blocks storage.

</details>

<details>
<summary><b>Download does not work</b></summary>

<br />

Download behavior depends on browser security rules, the remote server's headers, cross-origin configuration, and whether the media host permits downloads. Playback may work even when direct download is restricted.

</details>

<details>
<summary><b>Keyboard shortcuts do not work</b></summary>

<br />

Check that focus is not inside an input or select field, the page is active, and the browser has not reserved the shortcut. You must use the exact key combinations documented above.

</details>

<details>
<summary><b>Media controls are missing</b></summary>

<br />

The Media Session API is not supported consistently in every browser. The player remains fully usable through its own interface even when OS-level media controls are unavailable.

</details>

---

Roadmap

Potential future enhancements include:

<table>
<tr>
<td width="50%" valign="top">

Playback and Content

· User-created playlists.
· Importing playlists from URLs.
· Local-file playback.
· Offline caching with a service worker.
· Lyrics display.
· Equalizer controls.
· Audio visualizer.
· Additional audio sources.

</td>
<td width="50%" valign="top">

Platform and Tooling

· Improved download handling.
· Better metadata editing.
· Additional languages beyond English and Indonesian.
· Optional PWA installation.
· Media queue management.
· Cross-device preference synchronization.

</td>
</tr>
</table>

[!NOTE]
These features are not necessarily implemented in the current version.

---

Contributing

Signature Music is currently maintained as a demonstration and curated listening project. Feedback, suggestions, documentation improvements, and bug reports are welcome.

Before Contributing

<table>
<tr>
<td width="50%" valign="top">

· Keep the interface lightweight.
· Preserve mobile usability.
· Avoid unnecessary dependencies.
· Do not add tracking without clear documentation.
· Do not commit copyrighted media without permission.

</td>
<td width="50%" valign="top">

· Do not add private media URLs or credentials.
· Test playback on both desktop and mobile browsers.
· Test keyboard and touch interactions.
· Verify that changes do not break existing track data.
· Keep translation keys in sync between English and Indonesian.

</td>
</tr>
</table>

Contribution Workflow

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/your-feature-name
3. Make your changes.
4. Test the player locally.
5. Commit your changes: git commit -m "Describe your change"
6. Push the branch: git push origin feature/your-feature-name
7. Open a pull request or submit feedback through the project repository.

---

Development Setup

No build tools are required.

Local Development

1. Clone the repository.
2. Open the project directory.
3. Start a static server or vercel dev.
4. Open the local URL.
5. Edit the source files.
6. Refresh the browser to test changes.

Common Development Tasks

File Purpose
data-song.js Update the track catalogue.
style.css Change themes, layout, and skeleton styling.
script.js Modify playback logic and UI interactions.
i18n.js Update translations and language handling.
router.js Change route patterns and share URL behavior.
utils.js Add or modify shared helpers.
index.html Change structure and metadata.
vercel.json Adjust URL rewrite rules.

Testing Checklist

· Test audio playback on desktop and mobile.
· Test state persistence after reloading the page.
· Test sleep-timer behavior.
· Test shuffle and repeat behavior.
· Test keyboard shortcuts.
· Test the language switcher and confirm text and aria labels update.
· Test direct access to /playing/... and /search/... routes.
· Test unknown routes and confirm the not-found view appears.
· Test sharing and confirm the copied link opens the correct song.
· Test fallback artwork by temporarily breaking a cover URL.

---

License

Signature Music is released under the MIT License. See the LICENSE file for the complete license text.

[!IMPORTANT]
All musical recordings, compositions, artwork, names, and related media remain the property of their respective copyright holders. The project code license does not automatically grant permission to redistribute the included music or artwork.

---

Credits

<div align="center">

Role Attribution
Artist Muhaajir
Design and Development Regina · Resonance Studio
Typography Google Fonts (Inter, Outfit, JetBrains Mono)
Maintainer Regina
Developed by Haiere and HajirStudio
Audio Hosting External media hosting providers
Artwork Hosting External image hosting providers

</div>

---

Support and Contact

For questions, feedback, or bug reports:

· Open an issue in the project repository, if available.
· Contact the project maintainer through the provided contact channel.
· Report broken audio or artwork URLs with the affected track name.
· Include browser and device details when reporting playback problems.
· Include the current route when reporting navigation problems.

You can also support the artist and continued development through Buy Me a Coffee:

<div align="center">

<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Buy_Me_a_Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" />
</a>

<br />
<br />

<sub>Support Signature Music on Buy Me a Coffee.</sub>

</div>

---

<div align="center">

Made for independent music, focused listening, and expressive sound.

<br />

<a href="https://signature-music.vercel.app/">
  <img src="https://img.shields.io/badge/Open_Signature_Music-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Open Signature Music" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Artist-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Support the Artist" />
</a>

<br />
<br />

<sub>
Last updated: October 2026 · Signature Music v2.11.5
</sub>

</div>
