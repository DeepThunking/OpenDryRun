const EARTH_RADIUS_MILES = 3958.8;

function getCoordinatesAtBearing(lat, lon, distanceMiles, bearingDegrees) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const latRad = toRad(lat);
    const lonRad = toRad(lon);
    const bearingRad = toRad(bearingDegrees);
    const angularDistance = distanceMiles / EARTH_RADIUS_MILES;

    const lat2Rad = Math.asin(
        Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
    );

    const lon2Rad = lonRad + Math.atan2(
        Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(lat2Rad)
    );

    return {
        latitude: Number(toDeg(lat2Rad).toFixed(4)),
        longitude: Number(toDeg(lon2Rad).toFixed(4))
    };
}

export { getCoordinatesAtBearing };

const centerLat = 39.9575;
const centerLon = -82.9918;
const distance = 30; // miles

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

const surroundingPoints = directions.map(dir => ({
    ...dir,
    ...getCoordinatesAtBearing(centerLat, centerLon, distance, dir.bearing)
}));