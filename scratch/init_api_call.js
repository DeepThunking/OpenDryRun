const baseUrl = 'https://api.open-meteo.com/v1/forecast';

// Break the parameters down into a clean configuration object
const queryParams = new URLSearchParams({
    latitude: '39.9575',
    longitude: '-82.9918',
    current: [
        'temperature_2m',
        'apparent_temperature',
        'precipitation'
    ].join(','),
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch'
});

const url = `${baseUrl}?${queryParams.toString()}`;

async function getWeather() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log("Current Temp:", data.current.temperature_2m);
        console.log("Feels Like:", data.current.apparent_temperature);
        console.log("Precipitation:", data.current.precipitation);
    } catch (error) {
        console.error("Failed to fetch weather:", error);
    }
}

getWeather();