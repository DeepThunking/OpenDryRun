import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocation } from './locationService.js';

test('resolveLocation uses geocoding results for city and state input', async () => {
  global.fetch = async (url) => ({
    ok: true,
    json: async () => ({
      results: [
        {
          name: 'Columbus',
          admin1: 'Ohio',
          latitude: 39.96,
          longitude: -82.99
        }
      ]
    })
  });

  const location = await resolveLocation({ cityState: 'Columbus, OH' });

  assert.equal(location.latitude, 39.96);
  assert.equal(location.longitude, -82.99);
  assert.equal(location.displayName, 'Columbus, OH');
});

test('resolveLocation uses provided coordinates directly', async () => {
  const location = await resolveLocation({ latitude: 12.34, longitude: -56.78 });

  assert.equal(location.latitude, 12.34);
  assert.equal(location.longitude, -56.78);
  assert.equal(location.displayName, 'Custom location');
});
