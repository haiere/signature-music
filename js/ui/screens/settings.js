import { t, getLang, setLang } from '../../core/i18n.js';
import { getTheme, setTheme } from '../../core/theme.js';
import { storage } from '../../core/storage.js';

export function renderSettings() {
  const theme = getTheme();
  const lang = getLang();
  const volume = storage.get('sig_volume', 0.7);
  const autoplay = storage.get('sig_autoplay', true);
  const shuffle = storage.get('sig_shuffle', false);
  const reduce = document.documentElement.classList.contains('reduce-motion');

  return `
    <section class="screen">
      <div class="section-head"><h2>${t('settings.title')}</h2></div>

      <div class="settings-group">
        <div class="setting-row">
          <div class="setting-label">${t('settings.theme')}</div>
          <div class="setting-control">
            <select id="themeSelect" aria-label="${t('settings.theme')}">
              <option value="system" ${theme === 'system' ? 'selected' : ''}>${t('settings.theme.system')}</option>
              <option value="dark" ${theme === 'dark' ? 'selected' : ''}>${t('settings.theme.dark')}</option>
              <option value="light" ${theme === 'light' ? 'selected' : ''}>${t('settings.theme.light')}</option>
            </select>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.language')}</div>
          <div class="setting-control">
            <select id="langSelect" aria-label="${t('settings.language')}">
              <option value="id" ${lang === 'id' ? 'selected' : ''}>Indonesia</option>
              <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.defaultVolume')}</div>
          <div class="setting-control">
            <input id="volumeSetting" type="range" min="0" max="1" step="0.01" value="${volume}" aria-label="${t('settings.defaultVolume')}" />
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.autoplay')}</div>
          <button class="toggle" data-action="toggle-autoplay" aria-pressed="${autoplay}" aria-label="${t('settings.autoplay')}"></button>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.shuffleDefault')}</div>
          <button class="toggle" data-action="toggle-shuffle-default" aria-pressed="${shuffle}" aria-label="${t('settings.shuffleDefault')}"></button>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.reduceMotion')}</div>
          <button class="toggle" data-action="toggle-reduce-motion" aria-pressed="${reduce}" aria-label="${t('settings.reduceMotion')}"></button>
        </div>
      </div>

      <div class="settings-group">
        <div class="setting-row">
          <div class="setting-label">${t('settings.reset')}</div>
          <button class="btn ghost" data-action="reset-player">${t('settings.reset')}</button>
        </div>
      </div>

      <div class="settings-group">
        <div class="setting-row">
          <div class="setting-label">${t('settings.about')}<small>${t('settings.version')} 3.0.0</small></div>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.repository')}</div>
          <a class="support-link" href="https://github.com/haiere/signature-music" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div class="setting-row">
          <div class="setting-label">${t('settings.credits')}</div>
          <span class="muted">Muhaajir · Resonance Studio</span>
        </div>
      </div>
    </section>
  `;
}

export function bindSettingsEvents(root, rerender) {
  root.querySelector('#themeSelect')?.addEventListener('change', e => {
    setTheme(e.target.value);
    rerender();
  });

  root.querySelector('#langSelect')?.addEventListener('change', e => {
    setLang(e.target.value);
    rerender();
  });

  root.querySelector('#volumeSetting')?.addEventListener('input', e => {
    storage.set('sig_volume', parseFloat(e.target.value));
  });

  root.querySelector('[data-action="toggle-autoplay"]')?.addEventListener('click', e => {
    const next = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(next));
    storage.set('sig_autoplay', next);
  });

  root.querySelector('[data-action="toggle-shuffle-default"]')?.addEventListener('click', e => {
    const next = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(next));
    storage.set('sig_shuffle', next);
  });

  root.querySelector('[data-action="toggle-reduce-motion"]')?.addEventListener('click', e => {
    const next = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(next));
    document.documentElement.classList.toggle('reduce-motion', next);
    storage.set('sig_reduce_motion', next);
  });
}
