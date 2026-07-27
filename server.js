import express from 'express';
import { getCoordinatesAtBearing } from './utils/weatherMath.js';

const app = express();
const PORT = 3000;

// Open-Meteo API Base URL
const baseUrl = 'https://api.open-meteo.com/v1/forecast';

// Center coordinates (Columbus, OH) and search radius
const centerLat = 39.9575;
const centerLon = -82.9918;
const distance = 30; // miles

// Define 8 cardinal/intercardinal directions
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

// Generate coordinates for the surrounding points
const surroundingPoints = directions.map(dir => ({
    ...dir,
    ...getCoordinatesAtBearing(centerLat, centerLon, distance, dir.bearing)
}));

// Combine Center (Index 0) + 8 surrounding points (Indices 1-8)
const allPoints = [
    { name: 'Center', latitude: centerLat, longitude: centerLon },
    ...surroundingPoints
];

// Build batch query parameters for all 9 locations in a single call
const queryParams = new URLSearchParams({
    latitude: allPoints.map(p => p.latitude).join(','),
    longitude: allPoints.map(p => p.longitude).join(','),
    current: ['apparent_temperature', 'precipitation'].join(','),
    hourly: 'precipitation',       // <-- Add hourly precipitation
    forecast_hours: '6',           // <-- Limit to next 6 hours
    temperature_unit: 'fahrenheit',
    precipitation_unit: 'inch',
    temperature_unit: 'fahrenheit',
    precipitation_unit: 'inch'

});

const weatherUrl = `${baseUrl}?${queryParams.toString()}`;

app.get('/', async (req, res) => {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Center point data (Index 0)
        const centerData = data[0];
        const feelsLike = centerData.current.apparent_temperature;
        const rawPrecip = centerData.current.precipitation;
        const isRaining = rawPrecip > 0 ? 'Yes' : 'No';

        // 6-Hour Forecast Check (Index 0's hourly data)
        const hourlyPrecipArray = centerData.hourly.precipitation; // Returns an array of 6 values
        const willRainSoon = hourlyPrecipArray.some(val => val > 0) ? 'Yes' : 'No';

        // Check indices 1 through 8 for surrounding precipitation
        const surroundingResults = data.slice(1);
        const nearbyPrecipPoints = surroundingResults
            .map((result, index) => ({
                name: allPoints[index + 1].name,
                precipitation: result.current.precipitation
            }))
            .filter(p => p.precipitation > 0);

        let distancePrecipText = "None within 30 miles";
        if (nearbyPrecipPoints.length > 0) {
            const closest = nearbyPrecipPoints[0];
            distancePrecipText = `Yes (${closest.name} at ${closest.precipitation} in/h)`;
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>OpenDryRun</title>
                <style>
                    body { font-family: sans-serif; background: #121212; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; gap: 1rem; }
                    .card { background: #1e1e1e; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; }
                    h1 { font-size: 2.5rem; margin: 0 0 0.5rem 0; color: #ffb74d; }
                    p { color: #aaa; font-size: 1.1rem; }
                </style>
            </head>
            <body>
                <div class="card">
                    <p>Current Feels Like</p>
                    <h1>${feelsLike}°F</h1>
                </div>
                <div class="card">
                    <p>Currently Raining</p>
                    <h1>${isRaining}</h1>
                </div>
                <div class="card">
                    <p>Rain Within 30 Miles</p>
                    <h1>${distancePrecipText}</h1>
                </div>
                <div class="card">
                    <p>Rain in Next 6 Hours</p>
                    <h1>${willRainSoon}</h1>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        res.status(500).send("Error loading weather data.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});