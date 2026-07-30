import { getCoordinatesAtBearing } from '../../../utils/weatherMath.js';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const SEARCH_RADIUS_MILES = 30;

const directions = [
  { name: 'N', bearing: 0 },
  { name: 'NE', bearing: 45 },
  { name: 'E', bearing: 90 },
  { name: 'SE', bearing: 135 },
  { name: 'S', bearing: 180 },
  { name: 'SW', bearing: 225 },
  { name: 'W', bearing: 270 },
  { name: 'NW', bearing: 315 }
];

function buildLocationPoints(centerLatitude, centerLongitude) {
  const surroundingPoints = directions.map((dir) => ({
    ...dir,
    ...getCoordinatesAtBearing(centerLatitude, centerLongitude, SEARCH_RADIUS_MILES, dir.bearing)
  }));

  return [
    { name: 'Center', latitude: centerLatitude, longitude: centerLongitude },
    ...surroundingPoints
  ];
}

export {
  WEATHER_BASE_URL,
  SEARCH_RADIUS_MILES,
  buildLocationPoints
};
