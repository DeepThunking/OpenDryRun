import { buildLocationPoints, WEATHER_BASE_URL } from '../config/weatherConfig.js';
import { resolveLocation, suggestLocations } from '../services/locationService.js';
import { fetchWeatherSummary } from '../services/weatherService.js';
import { renderLocationForm } from '../views/locationFormView.js';
import { renderWeatherPage } from '../views/weatherView.js';

function createWeatherController() {
  return {
    async getWeatherPage(req, res) {
      try {
        const input = {
          cityState: req.query.cityState,
          zipCode: req.query.zipCode,
          latitude: req.query.latitude ? Number(req.query.latitude) : undefined,
          longitude: req.query.longitude ? Number(req.query.longitude) : undefined
        };

        if (req.query.useBrowserLocation === '1' && req.query.latitude && req.query.longitude) {
          const location = await resolveLocation(input);
          const allPoints = buildLocationPoints(location.latitude, location.longitude);
          const weatherUrl = createWeatherUrl(allPoints);
          const summary = await fetchWeatherSummary(weatherUrl, allPoints);
          res.send(renderWeatherPage({ ...summary, locationName: location.displayName }));
          return;
        }

        if (req.query.cityState || req.query.zipCode || (req.query.latitude && req.query.longitude)) {
          const location = await resolveLocation(input);
          const allPoints = buildLocationPoints(location.latitude, location.longitude);
          const weatherUrl = createWeatherUrl(allPoints);
          const summary = await fetchWeatherSummary(weatherUrl, allPoints);
          res.send(renderWeatherPage({ ...summary, locationName: location.displayName }));
          return;
        }

        res.send(renderLocationForm());
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        res.status(400).send(renderLocationForm(error.message));
      }
    },

    async getLocationSuggestions(req, res) {
      try {
        const suggestions = await suggestLocations(req.query.query);
        res.json(suggestions);
      } catch (error) {
        console.error('Failed to fetch location suggestions:', error);
        res.status(400).json({ error: error.message });
      }
    }
  };
}

function createWeatherUrl(allPoints) {
  const queryParams = new URLSearchParams({
    latitude: allPoints.map((point) => point.latitude).join(','),
    longitude: allPoints.map((point) => point.longitude).join(','),
    current: ['apparent_temperature', 'precipitation'].join(','),
    hourly: 'precipitation',
    forecast_hours: '6',
    temperature_unit: 'fahrenheit',
    precipitation_unit: 'inch'
  });

  return `${WEATHER_BASE_URL}?${queryParams.toString()}`;
}

export { createWeatherController };
