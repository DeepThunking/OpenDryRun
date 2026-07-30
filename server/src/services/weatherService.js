function buildWeatherSummary(data, allPoints) {
  const centerData = data[0];
  const feelsLike = centerData.current.apparent_temperature;
  const rawPrecip = centerData.current.precipitation;
  const isRaining = rawPrecip > 0 ? 'Yes' : 'No';

  const hourlyPrecipArray = centerData.hourly.precipitation;
  const willRainSoon = hourlyPrecipArray.some((val) => val > 0) ? 'Yes' : 'No';

  const surroundingResults = data.slice(1);
  const nearbyPrecipPoints = surroundingResults
    .map((result, index) => ({
      name: allPoints[index + 1].name,
      precipitation: result.current.precipitation
    }))
    .filter((point) => point.precipitation > 0);

  let distancePrecipText = 'None within 30 miles';
  if (nearbyPrecipPoints.length > 0) {
    const closest = nearbyPrecipPoints[0];
    distancePrecipText = `Yes (${closest.name} at ${closest.precipitation} in/h)`;
  }

  return {
    feelsLike,
    isRaining,
    willRainSoon,
    distancePrecipText
  };
}

async function fetchWeatherSummary(weatherUrl, allPoints) {
  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();
  return buildWeatherSummary(data, allPoints);
}

export { buildWeatherSummary, fetchWeatherSummary };
