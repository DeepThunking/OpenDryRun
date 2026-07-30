import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWeatherSummary } from './weatherService.js';

test('buildWeatherSummary derives summary values from API payload', () => {
  const data = [
    {
      current: { apparent_temperature: 72, precipitation: 0.1 },
      hourly: { precipitation: [0, 0, 0, 0, 0, 0] }
    },
    {
      current: { apparent_temperature: 68, precipitation: 0.2 },
      hourly: { precipitation: [0, 0, 0, 0, 0, 0] }
    }
  ];

  const allPoints = [
    { name: 'Center', latitude: 39.9575, longitude: -82.9918 },
    { name: 'N', latitude: 40.0, longitude: -82.9918 }
  ];

  const summary = buildWeatherSummary(data, allPoints);

  assert.equal(summary.feelsLike, 72);
  assert.equal(summary.isRaining, 'Yes');
  assert.equal(summary.willRainSoon, 'No');
  assert.equal(summary.distancePrecipText, 'Yes (N at 0.2 in/h)');
});
