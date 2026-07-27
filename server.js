import express from 'express';

const app = express();
const PORT = 3000;
// Open-Meteo API URL for Columbus, OH
const baseUrl = 'https://api.open-meteo.com/v1/forecast';
const queryParams = new URLSearchParams({
    latitude: '39.9575',
    longitude: '-82.9918',
    current: [ 'apparent_temperature', 'precipitation' ].join(','),
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
        const feelsLike = data.current.apparent_temperature;
        const rawPrecip = data.current.precipitation;
        const isRaining = rawPrecip > 0 ? 'Yes' : 'No';

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>OpenDryRun</title>
                <style>
                    body { font-family: sans-serif; background: #121212; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .card { background: #1e1e1e; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; }
                    h1 { font-size: 3rem; margin: 0 0 0.5rem 0; color: #ffb74d; }
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