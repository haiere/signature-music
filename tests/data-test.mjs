import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SONGS,
  createSlug,
  getSongById,
  getSongBySlug,
  getAdjacentSong,
  searchSongs,
  validateCatalogue
} from '../data-song.js';
import { id } from '../js/i18n/id.js';
import { en } from '../js/i18n/en.js';
import { formatDuration } from '../js/core/format.js';

test('catalogue has no duplicate ids or routes', () => {
  assert.deepEqual(validateCatalogue(), []);
});

test('createSlug normalizes text', () => {
  assert.equal(createSlug('Hello World!'), 'hello-world');
  assert.equal(createSlug('  A  B  '), 'a-b');
});

test('getSongById finds a song', () => {
  assert.equal(getSongById(SONGS[0].id)?.id, SONGS[0].id);
  assert.equal(getSongById('missing'), null);
});

test('getSongBySlug finds by album and slug', () => {
  const song = SONGS[0];
  assert.equal(getSongBySlug(song.albumSlug, song.slug)?.id, song.id);
  assert.equal(getSongBySlug('missing', 'missing'), null);
});

test('getAdjacentSong wraps around', () => {
  const first = SONGS[0];
  const last = SONGS[SONGS.length - 1];
  assert.equal(getAdjacentSong(last.id, 1)?.id, first.id);
  assert.equal(getAdjacentSong(first.id, -1)?.id, last.id);
});

test('searchSongs matches title and album', () => {
  assert.ok(searchSongs('lintasan').length >= 1);
  assert.ok(searchSongs('fragmen').length >= 1);
  assert.equal(searchSongs('zzzzzz').length, 0);
});

test('translation dictionaries have the same keys', () => {
  assert.deepEqual(Object.keys(id).sort(), Object.keys(en).sort());
});

test('formatDuration formats seconds', () => {
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(NaN), '0:00');
});
