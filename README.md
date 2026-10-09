<div align="center">

# Signature Music

**A premium, Hi-Res web music player for independent artists and curated listening experiences**

Built for presenting curated albums and independent releases in a clean, modern interface — no backend, no account, no build step.

<br />

<a href="https://signature-music.netlify.app/">
  <img src="https://img.shields.io/badge/Live_Player-signature--music.netlify.app-8B5CF6?style=for-the-badge&logo=netlify&logoColor=white" alt="Open Signature Music" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Artist-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Support Signature Music on Buy Me a Coffee" />
</a>

<br />

<img src="https://img.shields.io/badge/Version-2.11.5-blue?style=flat-square" alt="Version 2.11.5" />
<img src="https://img.shields.io/badge/Status-Live-purple?style=flat-square" alt="Website live" />
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />

<br />

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
<img src="https://img.shields.io/badge/Media_Session-API-8B5CF6?style=flat-square" alt="Media Session API" />
<img src="https://img.shields.io/badge/Privacy-Client_Side-success?style=flat-square" alt="Client-side privacy" />

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

> **Signature Music** is a static web music player for independent artists, labels, and curated music catalogues.

<table>
<tr>
<td width="33%" valign="top">

### For artists and labels

Share original releases through a polished web player.

</td>
<td width="33%" valign="top">

### For developers

Use a lightweight, customisable music player without a backend.

</td>
<td width="33%" valign="top">

### For listeners

Browse albums, save favourites, and enjoy responsive playback controls across devices.

</td>
</tr>
</table>

The player provides playlist browsing, favourites, shuffle and repeat controls, a sleep timer, direct downloads, WhatsApp sharing, responsive layouts, and system media controls where supported by the browser.

> [!NOTE]
> The application does not require a user account or external database. User preferences — favourites, volume, playback position, shuffle, repeat, and sleep-timer state — are stored locally in the browser.

---

## What's New in v2.11.5

<table>
<tr>
<td width="50%" valign="top">

### Interface & experience

- Added a non-intrusive Buy Me a Coffee button
- Added donation links to the header, playlist, settings panel, and desktop player bar
- Added a subtle ambient background with floating visual orbs
- Improved dark glass-style interface details
- Improved responsive behavior for desktop, tablet, and mobile screens
- Added a mobile bottom navigation dock
- Added a mobile mini player
- Improved album-art fallback behavior
- Added branded Haiere Signature Music identity across the interface

</td>
<td width="50%" valign="top">

### Playback & state

- Improved favourite filtering
- Improved playback-state persistence
- Improved sleep-timer controls
- Improved keyboard shortcut handling
- Added or refined Media Session API integration where supported
- Kept the project dependency-free at runtime
- Updated the application version to `2.11.5`

</td>
</tr>
</table>

---

## Features

### Playlist

- 13 tracks from Muhaajir's discography
- Filter tracks by:
  - All songs
  - Favourite songs
- Display album, artist, duration, and artwork information
- Highlight the currently playing track

### Playback Controls

<table>
<tr>
<td width="50%" valign="top">

- Play and pause
- Previous and next track
- Seek backward and forward
- Shuffle mode
- Repeat mode
- Progress bar with click and drag seeking

</td>
<td width="50%" valign="top">

- Volume control with percentage display
- Sleep timer
- Playback-state persistence

</td>
</tr>
</table>

### Favourites

- Mark tracks as favourites
- Filter the playlist to show favourites only
- Save favourites across browser sessions
- Store favourite state locally using `localStorage`

### Sleep Timer

Choose from:

| Duration | Behavior |
|---|---|
| **15 minutes** | Playback pauses automatically when the timer expires |
| **30 minutes** | Playback pauses automatically when the timer expires |
| **60 minutes** | Playback pauses automatically when the timer expires |
| **90 minutes** | Playback pauses automatically when the timer expires |

### Direct Download

Download the currently selected track directly from its configured audio URL when the hosting server and browser permit downloading.

### Sharing

Share the current track through WhatsApp using a generated track link or message.

> The exact behavior depends on the browser, device, and WhatsApp availability.

### Artwork

- Dynamic album artwork
- Album-specific cover images
- Fallback artwork when an image cannot be loaded
- Lazy loading where supported

### Media Session Integration

Where supported, the player can integrate with operating-system media controls, lock-screen controls, headset buttons, and browser media notifications through the Media Session API.

> [!NOTE]
> Browser support is not universal, so controls may vary by platform.

### Interface

<table>
<tr>
<td width="50%" valign="top">

- Dark glass-style interface
- Desktop three-panel layout
- Mobile bottom navigation
- Mobile mini player
- Touch-friendly controls

</td>
<td width="50%" valign="top">

- Safe-area support for notched devices
- Ambient background effects
- Keyboard shortcuts
- Responsive album-art layout
- Branded Haiere Signature Music identity

</td>
</tr>
</table>

---

## Built With

| Layer | Used |
|---|---|
| **Markup** | HTML5 semantic elements |
| **Styling** | CSS3 · CSS custom properties · CSS Grid · Flexbox |
| **Logic** | Vanilla JavaScript · JavaScript ES modules |
| **Audio** | HTML5 Audio API · Web Audio API where used by the implementation |
| **System integration** | Media Session API where supported |
| **Typography** | Google Fonts — Inter · Outfit · JetBrains Mono |

> No framework or package installation is required for the static application.

---

## Requirements

> Signature Music requires:

| Requirement | Details |
|---|---|
| **Browser** | A modern web browser with JavaScript enabled |
| **Audio** | Support for the HTML `<audio>` element |
| **Modules** | Support for ES modules |
| **Layout** | Support for CSS Grid and Flexbox |
| **Network** | Access to load remote audio and artwork resources |

**Recommended browsers:**

Google Chrome · Mozilla Firefox · Microsoft Edge · Apple Safari · Modern Android browsers · Modern iOS browsers

> [!NOTE]
> Some features — especially Media Session controls and automatic downloads — may behave differently between browsers.

---

## Installation

### Use the Live Version

<div align="center">

**[signature-music.netlify.app](https://signature-music.netlify.app/)**

</div>

### Clone the Repository

```bash
git clone https://github.com/haiere/signature-music.git
cd signature-music
```

Then open index.html in a modern browser.

Use a Local Development Server

For more reliable ES module behavior, use a local static server:

<table>
<tr>
<td width="50%" valign="top">

Node.js

```bash
npx serve .
```

</td>
<td width="50%" valign="top">

Python

```bash
python -m http.server 8000
```

</td>
</tr>
</table>

Then open:

```text
http://localhost:8000
```

[!NOTE]
No build step, package installation, environment variable, or backend service is required.

---

Quick Start

1. Open Signature Music
2. Select a song from the playlist
3. Press the play button
4. Use the progress bar to seek through the track
5. Adjust the volume
6. Enable shuffle or repeat when needed
7. Add tracks to your favourites
8. Open the settings panel to use the sleep timer
9. Download or share the current track when available
10. Support the artist through the Buy Me a Coffee button if you enjoy the music

---

Usage

Desktop Layout

Panel Content
Left panel Playlist, album filter, favourites filter, and donation card
Centre panel Album artwork, track information, and playback controls
Right panel Settings, sleep timer, quick actions, information, and support links

Mobile Layout

<table>
<tr>
<td width="50%" valign="top">

· Home — Main player, artwork, track information, and playback controls
· Songs — Playlist, album filters, and favourite filtering
· More — Settings, sleep timer, about information, and support links

</td>
<td width="50%" valign="top">

· Mini player — Persistent playback controls at the bottom of the screen
· Header — Branding, donation action, and menu controls

</td>
</tr>
</table>

Responsive Behavior

Viewport Layout
Desktop, ≥ 768px Three-panel layout — Songs, Player, Settings
Mobile, < 768px Single-view navigation with bottom dock and mini player

---

Keyboard Shortcuts

Key or Combination Action
Space / K Play or pause
Left Arrow / Right Arrow Seek backward or forward 5 seconds
Shift + Left Arrow / Shift + Right Arrow Previous or next track
Up Arrow / Down Arrow Increase or decrease volume
F Toggle favourite
S Toggle shuffle
R Toggle repeat
M Open download modal
T Open sleep-timer settings
Esc Close modals and menus

[!NOTE]
Keyboard shortcuts may be ignored when focus is inside a text input, select element, or other form control.

---

Local Storage

Signature Music stores preferences locally in the browser.

Key Stored Data
haiere_fav Favourite track identifiers
haiere_vol Volume level
haiere_state Current track, playback position, shuffle, repeat, and sleep-timer state

Local storage is scoped to the website origin and persists across browser sessions in normal browsing mode.

[!NOTE]
Clearing site data, changing browser profiles, or using private browsing may remove stored preferences. The application does not use local storage as a cloud synchronization system. Preferences are not automatically shared between browsers or devices.

---

Project Structure

```text
signature-music/
├── index.html          # Main HTML document and application layout
├── style.css           # Responsive layout, theme, and glass-style components
├── script.js           # Player logic, controls, state, and UI interactions
├── data-song.js        # Track catalogue and media metadata
├── README.md           # Project documentation
└── LICENSE             # MIT license
```

The project uses separate files to make maintenance, customization, and deployment easier.

---

Music Data

Track information is stored in data-song.js as an array of objects.

Example:

```javascript
export const SONGS = [
  {
    name: "Lintasan Tak Bermakna",
    group: "Fragmen Suara",
    url: "https://files.catbox.moe/7p3gmt.opus",
    cover: "https://i.postimg.cc/W3pHjGCQ/fragmen.webp"
  }
];
```

Typical fields:

Field Description
name Track title
group Album, collection, or release name
url Remote audio file URL
cover Album-art or track-art URL

Remote Media Hosting

Audio and artwork are hosted externally, including:

· catbox.moe for audio resources
· postimg.cc for artwork resources

The availability, speed, download behavior, and CORS configuration of external hosts may affect playback and downloads.

When adding new tracks

· Use HTTPS URLs
· Confirm that the audio file is publicly accessible
· Confirm that the browser can load the audio resource
· Use supported browser audio formats
· Check that artwork URLs remain active
· Verify that you have permission to distribute the music and artwork

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

During normal use

· Favourites are stored locally
· Playback preferences are stored locally
· The application does not require a remote user database
· The application does not intentionally transmit favourite lists or playback state
· The application does not require tracking cookies
· Audio and cover resources are loaded from their configured external URLs

</td>
<td width="50%" valign="top">

External requests

The application may request:

· Remote audio files
· Remote album artwork
· Google Fonts
· The Buy Me a Coffee page when the donation link is selected

</td>
</tr>
</table>

[!IMPORTANT]
The external media host may be able to observe requests for resources it serves. For this reason, the "client-side" privacy badge refers to local preference processing, not to the network behavior of external audio, image, font, or donation services.

---

Security Considerations

Only use audio and artwork URLs from sources you trust.

<table>
<tr>
<td width="50%" valign="top">

Best practices

· Confirm that remote media URLs use HTTPS
· Do not place private or access-controlled media URLs in a public repository
· Do not include API keys or secret tokens in data-song.js
· Avoid embedding personal information in track metadata unless intended
· Review third-party hosting terms before distributing copyrighted media
· Keep external assets and libraries updated when applicable

</td>
<td width="50%" valign="top">

Deployment

· Use a Content Security Policy when deploying the player on your own domain
· Validate media URLs before adding them to the catalogue
· Treat downloaded media according to the license and rights associated with the original content

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

Design choices

· Separate assets improve maintainability and browser caching
· Album artwork can be lazy-loaded
· CSS custom properties reduce repeated styling values
· The player avoids large frontend frameworks
· DOM updates are limited to relevant controls and panels
· Ambient background effects use CSS animations
· Reduced-motion preferences should be respected where supported

</td>
<td width="50%" valign="top">

For better performance

· Use appropriately sized artwork
· Prefer efficient audio formats
· Avoid unnecessarily large source files
· Compress cover images before hosting them
· Keep the playlist data lightweight

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

· Your internet connection is working
· The audio URL is accessible
· The audio format is supported by your browser
· The media host permits browser playback
· The browser has received a user interaction
· The device is not muted
· Another application is not controlling audio output

</details>

<details>
<summary><b>Artwork does not load</b></summary>

<br />

Check that:

· The image URL is correct
· The image host is accessible
· The URL uses HTTPS
· The image format is supported
· The fallback artwork appears when the remote image fails

</details>

<details>
<summary><b>Download does not work</b></summary>

<br />

Download behavior depends on:

· Browser security rules
· The remote server's headers
· Cross-origin configuration
· Whether the media host permits downloads
· The audio URL format

[!NOTE]
Playback may work even when direct download is restricted by the remote host.

</details>

<details>
<summary><b>Keyboard shortcuts do not work</b></summary>

<br />

Check that:

· Focus is not inside an input or select field
· The page is active
· The browser has not reserved the shortcut
· You are using the exact key combination documented above
· The visual controls work as expected

</details>

<details>
<summary><b>Media controls are missing</b></summary>

<br />

The Media Session API is not supported consistently in every browser. The player remains usable through its own interface even when operating-system media controls are unavailable.

</details>

<details>
<summary><b>Layout breaks on a small screen</b></summary>

<br />

Try:

1. Refreshing the page
2. Checking the browser zoom level
3. Testing the latest browser version
4. Closing browser overlays or reader modes
5. Testing the application through a local server
6. Checking whether a custom browser stylesheet is interfering

</details>

---

Roadmap

Potential future enhancements include:

<table>
<tr>
<td width="50%" valign="top">

Playback & content

· User-created playlists
· Importing playlists from URLs
· Local-file playback
· Offline caching with a service worker
· Lyrics display
· Equalizer controls
· Audio visualizer
· More audio sources
· Album search
· Artist and album pages

</td>
<td width="50%" valign="top">

Platform & tooling

· Improved download handling
· Better metadata editing
· Internationalization
· Optional PWA installation
· Media queue management
· Cross-device preference synchronization

</td>
</tr>
</table>

[!NOTE]
These features are not necessarily implemented in the current version.

---

Contributing

Signature Music is currently maintained as a demonstration and curated listening project.

Feedback, suggestions, documentation improvements, and bug reports are welcome.

Before contributing

<table>
<tr>
<td width="50%" valign="top">

· Keep the interface lightweight
· Preserve mobile usability
· Avoid unnecessary dependencies
· Do not add tracking without clear documentation
· Do not commit copyrighted media without permission

</td>
<td width="50%" valign="top">

· Do not add private media URLs or credentials
· Test playback on both desktop and mobile browsers
· Test keyboard and touch interactions
· Verify that changes do not break existing track data

</td>
</tr>
</table>

Contribution Workflow

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test the player locally
5. Commit your changes:
   ```bash
   git commit -m "Describe your change"
   ```
6. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a pull request or submit feedback through the project repository

---

Development Setup

No build tools are required.

Local Development

1. Clone the repository
2. Open the project directory
3. Start a static server
4. Open the local URL
5. Edit the source files
6. Refresh the browser to test changes

Example:

<table>
<tr>
<td width="50%" valign="top">

Python

```bash
python -m http.server 8000
```

</td>
<td width="50%" valign="top">

Node.js

```bash
npx serve .
```

</td>
</tr>
</table>

Then open:

```text
http://localhost:8000
```

Common Development Tasks

What to edit for each kind of change:

File Purpose
data-song.js Update the catalogue
style.css Change themes and layout
script.js Modify playback logic and interactions
index.html Change structure and metadata

Testing Checklist

<table>
<tr>
<td width="50%" valign="top">

☐ Test audio playback on desktop and mobile
☐ Test state persistence after reloading the page
☐ Test sleep-timer behavior
☐ Test shuffle and repeat behavior
☐ Test keyboard shortcuts

</td>
<td width="50%" valign="top">

☐ Test the donation links
☐ Test fallback artwork
☐ Test inaccessible or invalid media URLs

</td>
</tr>
</table>

---

License

Signature Music is released under the MIT License.

See the LICENSE file for the complete license text.

[!IMPORTANT]
All musical recordings, compositions, artwork, names, and related media remain the property of their respective copyright holders.

The project code license does not automatically grant permission to redistribute the included music or artwork.

---

Credits

<div align="center">

Role Attribution
Artist Muhaajir
Design and Development Regina · Resonance Studio
Typography Google Fonts — Inter · Outfit · JetBrains Mono
Maintainer Regina
Developed by Haiere and HajirStudio
Audio Hosting External media hosting providers
Artwork Hosting External image hosting providers

</div>

---

Support and Contact

For questions, feedback, or bug reports:

· Open an issue in the project repository, if available
· Contact the project maintainer through the provided contact channel
· Report broken audio or artwork URLs with the affected track name
· Include browser and device details when reporting playback problems

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

<a href="https://signature-music.netlify.app/">
  <img src="https://img.shields.io/badge/Open_Signature_Music-8B5CF6?style=for-the-badge&logo=netlify&logoColor=white" alt="Open Signature Music" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Artist-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Support the Artist" />
</a>

<br />
<br />

<sub>
Last updated: September 2026 · Signature Music v2.11.5
</sub>

</div>
