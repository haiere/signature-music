import { id } from '../i18n/id.js';
import { en } from '../i18n/en.js';
import { storage } from './storage.js';

const DICTS = { id, en };
const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'sig_lang';

let lang = storage.get(STORAGE_KEY, null);
if (!lang || !DICTS[lang]) {
  const browser = (navigator.language || '').slice(0, 2);
  lang = DICTS[browser] ? browser : DEFAULT_LANG;
}

export function getLang() {
  return lang;
}

export function setLang(next) {
  if (!DICTS[next]) return;
  lang = next;
  storage.set(STORAGE_KEY, next);
  document.documentElement.lang = next;
  applyTranslations();
  window.dispatchEvent(new CustomEvent('langchange', { detail: next }));
}

export function toggleLang() {
  setLang(lang === 'id' ? 'en' : 'id');
}

export function t(key, params = {}) {
  const dict = DICTS[lang] || DICTS[DEFAULT_LANG];
  const fallback = DICTS[DEFAULT_LANG];
  let str = dict[key] ?? fallback[key] ?? key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return str;
}

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang.toUpperCase();
} 
