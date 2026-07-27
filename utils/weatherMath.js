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
