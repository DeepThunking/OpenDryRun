function renderWeatherPage(summary) {
  const locationLabel = summary.locationName ? `<p class="location">${summary.locationName}</p>` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>OpenDryRun</title>
      <style>
        body { font-family: sans-serif; background: #121212; color: #e0e0e0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; gap: 1rem; padding: 1rem; flex-wrap: wrap; }
        .card { background: #1e1e1e; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; min-width: 220px; }
        h1 { font-size: 2.5rem; margin: 0 0 0.5rem 0; color: #ffb74d; }
        p { color: #aaa; font-size: 1.1rem; }
        .location { color: #ffb74d; font-weight: 600; margin-bottom: 1rem; }
        .link { margin-top: 1rem; color: #7ec8ff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div style="width: 100%; text-align: center; flex-basis: 100%;">
        ${locationLabel}
        <a class="link" href="/">Choose another location</a>
      </div>
      <div class="card">
        <p>Current Feels Like</p>
        <h1>${summary.feelsLike}°F</h1>
      </div>
      <div class="card">
        <p>Currently Raining</p>
        <h1>${summary.isRaining}</h1>
      </div>
      <div class="card">
        <p>Rain Within 30 Miles</p>
        <h1>${summary.distancePrecipText}</h1>
      </div>
      <div class="card">
        <p>Rain in Next 6 Hours</p>
        <h1>${summary.willRainSoon}</h1>
      </div>
    </body>
    </html>
  `;
}

export { renderWeatherPage };
