import { SONGS, getAdjacentSong, getSongArtwork } from '../../data-song.js';
import { storage } from './storage.js';
import { formatDuration } from './format.js';

export class Player {
  constructor(audio, { onSongChange, onStateChange, onTimeUpdate } = {}) {
    this.audio = audio;
    this.current = null;
    this.shuffle = storage.get('sig_shuffle', false);
    this.repeat = storage.get('sig_repeat', false);
    this.autoplay = storage.get('sig_autoplay', true);
    this.loadToken = 0;
    this.handlers = { song: onSongChange, state: onStateChange, time: onTimeUpdate };

    this.audio.volume = storage.get('sig_volume', 0.7);
    this.audio.muted = this.audio.volume === 0;
    this._bindAudio();
    this._restoreLastSong();
  }

  _restoreLastSong() {
    const lastId = storage.get('sig_last_song', null);
    const song = SONGS.find(s => s.id === lastId) || SONGS[0];
    if (song) this.load(song, { autoplay: false });
  }

  _bindAudio() {
    this.audio.addEventListener('timeupdate', () => {
      this.handlers.time?.(this.audio.currentTime, this.audio.duration || 0);
    });
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.current && Number.isFinite(this.audio.duration)) {
        this.current.duration = this.audio.duration;
        this.handlers.time?.(this.audio.currentTime, this.audio.duration);
      }
    });
    this.audio.addEventListener('play', () => this._emitState());
    this.audio.addEventListener('pause', () => this._emitState());
    this.audio.addEventListener('waiting', () => this._emitState('buffering'));
    this.audio.addEventListener('playing', () => this._emitState('playing'));
    this.audio.addEventListener('error', () => this._emitState('error'));
    this.audio.addEventListener('volumechange', () => this._emitState());
    this.audio.addEventListener('ended', () => {
      if (this.repeat) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      } else {
        this.next();
      }
    });
  }

  _emitState(extra) {
    this.handlers.state?.({
      playing: !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      muted: this.audio.muted,
      shuffle: this.shuffle,
      repeat: this.repeat,
      extra
    });
  }

  load(song, { autoplay = false } = {}) {
    if (!song) return;
    if (this.current?.id === song.id && this.audio.src) {
      if (autoplay) this.play();
      return;
    }

    const token = ++this.loadToken;
    this.current = song;
    this.audio.src = song.audioUrl;
    this.audio.load();

    storage.set('sig_last_song', song.id);

    const recent = storage.get('sig_recent', []);
    const nextRecent = [song.id, ...recent.filter(id => id !== song.id)].slice(0, 8);
    storage.set('sig_recent', nextRecent);

    this.handlers.song?.(song);

    if (autoplay) {
      this.play().catch(() => {});
    }

    this._updateMediaSession(song);
    this._emitState();
  }

  async play() {
    try {
      await this.audio.play();
      this._emitState();
    } catch {
      this._emitState('autoplay-blocked');
    }
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    if (this.audio.paused) this.play();
    else this.pause();
  }

  next() {
    if (!this.current) return;
    if (this.shuffle) {
      const pool = SONGS.filter(s => s.id !== this.current.id);
      const pick = pool[Math.floor(Math.random() * pool.length)] || SONGS[0];
      this.load(pick, { autoplay: true });
      return;
    }
    this.load(getAdjacentSong(this.current.id, 1), { autoplay: true });
  }

  prev() {
    if (!this.current) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    this.load(getAdjacentSong(this.current.id, -1), { autoplay: true });
  }

  seek(ratio) {
    if (!this.audio.duration) return;
    this.audio.currentTime = Math.max(0, Math.min(1, ratio)) * this.audio.duration;
  }

  setVolume(value) {
    const v = Math.max(0, Math.min(1, Number(value)));
    this.audio.volume = v;
    this.audio.muted = v === 0;
    storage.set('sig_volume', v);
  }

  toggleMute() {
    if (this.audio.muted || this.audio.volume === 0) {
      this.audio.muted = false;
      if (this.audio.volume === 0) this.audio.volume = 0.7;
    } else {
      this.audio.muted = true;
    }
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    storage.set('sig_shuffle', this.shuffle);
    this._emitState();
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    storage.set('sig_repeat', this.repeat);
    this._emitState();
  }

  _updateMediaSession(song) {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [{ src: getSongArtwork(song), sizes: '512x512' }]
      });
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
      navigator.mediaSession.setActionHandler('seekbackward', d => {
        this.audio.currentTime = Math.max(0, this.audio.currentTime - (d.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler('seekforward', d => {
        this.audio.currentTime = Math.min(this.audio.duration || 0, this.audio.currentTime + (d.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler('seekto', d => {
        this.audio.currentTime = d.seekTime;
      });
    } catch {}
  }
  } 
