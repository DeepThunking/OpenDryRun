const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

async function resolveLocation(input = {}) {
  if (typeof input.latitude === 'number' && typeof input.longitude === 'number') {
    return {
      latitude: input.latitude,
      longitude: input.longitude,
      displayName: 'Custom location'
    };
  }

  const query = input.cityState?.trim() || input.zipCode?.trim() || '';
  if (!query) {
    throw new Error('A location must be provided.');
  }

  const displayName = input.cityState?.trim() || (input.zipCode ? `ZIP ${input.zipCode.trim()}` : '');

  const params = new URLSearchParams({
    name: query,
    count: '1',
    language: 'en',
    format: 'json'
  });

  const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data.results?.[0];
  if (!result) {
    throw new Error('No location found.');
  }

  return {
    latitude: Number(result.latitude),
    longitude: Number(result.longitude),
    displayName: displayName || [result.name, result.admin1].filter(Boolean).join(', ')
  };
}

export { resolveLocation };
