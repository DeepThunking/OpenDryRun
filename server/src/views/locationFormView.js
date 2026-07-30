function renderLocationForm(locationError = '') {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>OpenDryRun</title>
      <style>
        body { font-family: sans-serif; background: #121212; color: #e0e0e0; margin: 0; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
        .panel { background: #1e1e1e; padding: 2rem; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); width: min(92vw, 480px); }
        h1 { margin-top: 0; color: #ffb74d; }
        form { display: grid; gap: 0.8rem; }
        label { font-size: 0.95rem; color: #ccc; }
        input, button { padding: 0.8rem; border-radius: 8px; border: 1px solid #333; font-size: 1rem; }
        input { background: #2a2a2a; color: #fff; }
        button { background: #ffb74d; color: #111; cursor: pointer; font-weight: 600; }
        .secondary { background: #2a2a2a; color: #fff; }
        .error { color: #ff8a65; margin-top: 0.4rem; }
        .hint { color: #aaa; font-size: 0.95rem; }
      </style>
    </head>
    <body>
      <div class="panel">
        <h1>Choose a location</h1>
        <p class="hint">Pick a city/state, enter a ZIP code, or use your browser location.</p>
        <form action="/" method="GET">
          <label for="cityState">City or State</label>
          <input id="cityState" name="cityState" placeholder="Columbus, OH" />
          <label for="zipCode">ZIP code</label>
          <input id="zipCode" name="zipCode" placeholder="43210" />
          <button type="submit">Show weather</button>
          <button class="secondary" type="button" onclick="window.location.href='/?useBrowserLocation=1'">Allow location access</button>
        </form>
        ${locationError ? `<p class="error">${locationError}</p>` : ''}
      </div>
    </body>
    </html>
  `;
}

export { renderLocationForm };
