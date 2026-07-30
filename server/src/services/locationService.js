const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const US_STATE_ABBREVIATIONS = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY'
};

function formatLocationLabel(result = {}) {
  const city = result.name;
  const state = result.admin1;
  const countryCode = result.country_code?.toLowerCase();

  if (countryCode === 'us' && state) {
    const abbreviation = US_STATE_ABBREVIATIONS[state] || state;
    return [city, abbreviation].filter(Boolean).join(', ');
  }

  return [city, state].filter(Boolean).join(', ');
}

async function resolveLocation(input = {}) {
  if (typeof input.latitude === 'number' && typeof input.longitude === 'number') {
    const params = new URLSearchParams({
      latitude: String(input.latitude),
      longitude: String(input.longitude),
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

    return {
      latitude: input.latitude,
      longitude: input.longitude,
      displayName: result ? formatLocationLabel(result) : 'Custom location'
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
    displayName: displayName || formatLocationLabel(result)
  };
}

async function suggestLocations(query = '', count = 5) {
  const normalizedQuery = typeof query === 'string' ? query.trim() : '';
  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: normalizedQuery,
    count: String(count),
    language: 'en',
    format: 'json'
  });

  const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.results || []).slice(0, count).map((result) => ({
    displayName: formatLocationLabel(result),
    latitude: Number(result.latitude),
    longitude: Number(result.longitude)
  }));
}

export { resolveLocation, suggestLocations };
