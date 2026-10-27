export function parseLocation() {
  const path = location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/' || path === '/home') return { name: 'home', path: '/' };
  if (path === '/music') return { name: 'music', path: '/music' };
  if (path === '/settings') return { name: 'settings', path: '/settings' };

  const match = path.match(/^\/playing\/([^/]+)\/([^/]+)$/);
  if (match) {
    return {
      name: 'playing',
      albumSlug: decodeURIComponent(match[1]),
      songSlug: decodeURIComponent(match[2]),
      path
    };
  }

  return { name: 'notfound', path };
}

export function navigate(path, { replace = false } = {}) {
  if (location.pathname + location.search === path) return;
  history[replace ? 'replaceState' : 'pushState']({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function initRouter(onRoute) {
  window.addEventListener('popstate', () => onRoute(parseLocation()));
  onRoute(parseLocation());
} 
