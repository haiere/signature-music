import { storage } from './storage.js';

const KEY = 'sig_theme';
const ORDER = ['dark', 'light', 'system'];

export function getTheme() {
  return storage.get(KEY, 'system');
}

export function applyTheme(theme = getTheme()) {
  const root = document.documentElement;
  let resolved = theme;
  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.dataset.theme = resolved;
  root.dataset.themePreference = theme;
}

export function setTheme(theme) {
  storage.set(KEY, theme);
  applyTheme(theme);
}

export function cycleTheme() {
  const current = getTheme();
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  setTheme(next);
  return next;
}

export function initTheme() {
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') applyTheme();
  });
} 
