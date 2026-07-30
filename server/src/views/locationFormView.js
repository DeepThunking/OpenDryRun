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
        .autocomplete-wrapper { position: relative; }
        .autocomplete-list { position: absolute; top: calc(100% + 0.35rem); left: 0; right: 0; background: #2a2a2a; border: 1px solid #444; border-radius: 8px; max-height: 220px; overflow-y: auto; display: none; z-index: 20; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .autocomplete-list.visible { display: block; }
        .autocomplete-item { width: 100%; text-align: left; background: transparent; color: #f5f5f5; border: 0; border-radius: 0; padding: 0.75rem 0.8rem; font-weight: 500; cursor: pointer; }
        .autocomplete-item:hover, .autocomplete-item.active { background: #3d3d3d; }
      </style>
    </head>
    <body>
      <div class="panel">
        <h1>Choose a location</h1>
        <p class="hint">Pick a city/state, enter a ZIP code, or use your browser location.</p>
        <form action="/" method="GET">
          <label for="cityState">City or State</label>
          <div class="autocomplete-wrapper">
            <input id="cityState" name="cityState" placeholder="Columbus, OH" autocomplete="off" />
            <div id="locationSuggestions" class="autocomplete-list" role="listbox" aria-label="Location suggestions"></div>
          </div>
          <label for="zipCode">ZIP code</label>
          <input id="zipCode" name="zipCode" placeholder="43210" />
          <button type="submit">Show weather</button>
          <button class="secondary" type="button" id="useBrowserLocation">Allow location access</button>
        </form>
        ${locationError ? `<p class="error">${locationError}</p>` : ''}
      </div>
      <script>
        const locationInput = document.getElementById('cityState');
        const suggestionList = document.getElementById('locationSuggestions');
        const browserLocationButton = document.getElementById('useBrowserLocation');
        let suggestionTimer = null;
        let currentSuggestions = [];
        let activeSuggestionIndex = -1;

        function hideSuggestions() {
          suggestionList.classList.remove('visible');
          suggestionList.innerHTML = '';
          currentSuggestions = [];
          activeSuggestionIndex = -1;
        }

        function highlightActiveSuggestion() {
          const items = Array.from(suggestionList.children);
          items.forEach((item, index) => {
            item.classList.toggle('active', index === activeSuggestionIndex);
          });
        }

        function renderSuggestions(suggestions) {
          currentSuggestions = suggestions;
          activeSuggestionIndex = -1;
          suggestionList.innerHTML = '';

          if (!suggestions.length) {
            hideSuggestions();
            return;
          }

          suggestionList.classList.add('visible');
          suggestions.forEach((item, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'autocomplete-item';
            button.textContent = item.displayName;
            button.addEventListener('click', () => {
              locationInput.value = item.displayName;
              hideSuggestions();
            });
            button.addEventListener('mouseenter', () => {
              activeSuggestionIndex = index;
              highlightActiveSuggestion();
            });
            suggestionList.appendChild(button);
          });
        }

        function selectActiveSuggestion() {
          if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
            locationInput.value = currentSuggestions[activeSuggestionIndex].displayName;
            hideSuggestions();
          }
        }

        locationInput.addEventListener('input', (event) => {
          const value = event.target.value.trim();
          hideSuggestions();

          if (!value || value.length < 2) {
            return;
          }

          if (suggestionTimer) {
            window.clearTimeout(suggestionTimer);
          }

          suggestionTimer = window.setTimeout(async () => {
            try {
              const response = await fetch('/suggest-locations?query=' + encodeURIComponent(value));
              if (!response.ok) {
                return;
              }

              const suggestions = await response.json();
              renderSuggestions(suggestions);
            } catch (error) {
              console.error('Failed to fetch location suggestions:', error);
            }
          }, 200);
        });

        locationInput.addEventListener('keydown', (event) => {
          if (!currentSuggestions.length) {
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex + 1) % currentSuggestions.length;
            highlightActiveSuggestion();
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
            highlightActiveSuggestion();
          } else if (event.key === 'Enter') {
            event.preventDefault();
            selectActiveSuggestion();
          } else if (event.key === 'Escape') {
            event.preventDefault();
            hideSuggestions();
          }
        });

        locationInput.addEventListener('focus', () => {
          if (currentSuggestions.length) {
            suggestionList.classList.add('visible');
          }
        });

        locationInput.addEventListener('blur', () => {
          window.setTimeout(hideSuggestions, 150);
        });

        browserLocationButton.addEventListener('click', () => {
          if (!navigator.geolocation) {
            window.alert('Geolocation is not supported by this browser.');
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              window.location.href = '/?useBrowserLocation=1&latitude=' + latitude + '&longitude=' + longitude;
            },
            () => {
              window.alert('Location access was denied. Please enter a city or ZIP code instead.');
            }
          );
        });
      </script>
    </body>
    </html>
  `;
}

export { renderLocationForm };
