import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocation, suggestLocations } from './locationService.js';

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

test('resolveLocation uses reverse geocoding for coordinates', async () => {
  global.fetch = async (url) => ({
    ok: true,
    json: async () => ({
      results: [
        {
          name: 'Columbus',
          admin1: 'Ohio',
          country_code: 'US',
          latitude: 39.96,
          longitude: -82.99
        }
      ]
    })
  });

  const location = await resolveLocation({ latitude: 39.96, longitude: -82.99 });

  assert.equal(location.latitude, 39.96);
  assert.equal(location.longitude, -82.99);
  assert.equal(location.displayName, 'Columbus, OH');
});

test('resolveLocation falls back to a placeholder label when reverse geocoding has no results', async () => {
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ results: [] })
  });

  const location = await resolveLocation({ latitude: 12.34, longitude: -56.78 });

  assert.equal(location.latitude, 12.34);
  assert.equal(location.longitude, -56.78);
  assert.equal(location.displayName, 'Custom location');
});

test('suggestLocations returns city and state suggestions for partial input', async () => {
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      results: [
        {
          name: 'Seattle',
          admin1: 'Washington',
          latitude: 47.61,
          longitude: -122.33
        },
        {
          name: 'Seat Pleasant',
          admin1: 'Maryland',
          latitude: 39.10,
          longitude: -76.90
        }
      ]
    })
  });

  const suggestions = await suggestLocations('seat');

  assert.deepEqual(
    suggestions.map((item) => item.displayName),
    ['Seattle, Washington', 'Seat Pleasant, Maryland']
  );
});
