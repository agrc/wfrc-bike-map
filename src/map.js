import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';

function initMap() {
  const media = matchMedia('(prefers-color-scheme: dark)');
  if (media.matches) {
    setTheme('dark');
  }
  media.addEventListener('change', (event) => {
    setTheme(event.matches ? 'dark' : 'light');
  });

  const map = new WebMap({
    portalItem: {
      id: 'e691172598f04ea8881cd2a4adaa45ba',
    },
  });

  new MapView({
    map: map,
    container: 'viewDiv',
    zoom: 5,
  });

  map.when(() => {
    document.querySelector('calcite-loader').hidden = true;
    document.querySelector('calcite-shell').hidden = false;

    console.log('loaded');
  });
}

initMap();

function setTheme(theme) {
  const darkLink = document.getElementById('arcgis-dark-theme');
  const lightLink = document.getElementById('arcgis-light-theme');

  darkLink.disabled = theme === 'light';
  lightLink.disabled = theme === 'dark';
}
