import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Home from '@arcgis/core/widgets/Home';
import Track from '@arcgis/core/widgets/Track';
import { mediaMinWidth, mediaQuery } from './utils';

function setTheme(theme) {
  const darkLink = document.getElementById('arcgis-dark-theme');
  const lightLink = document.getElementById('arcgis-light-theme');

  darkLink.disabled = theme === 'light';
  lightLink.disabled = theme === 'dark';
}

mediaQuery('(prefers-color-scheme: dark)', (result) => {
  setTheme(result.matches ? 'dark' : 'light');
});

const map = new WebMap({
  portalItem: {
    id: 'c4186ac9dbad4be79abb4d4b75c3787c',
  },
});

const view = new MapView({
  map: map,
  container: 'viewDiv',
  zoom: 5,
  ui: {
    components: [],
  },
});

view.when(() => {
  const homeWidget = new Home({ view });
  const trackWidget = new Track({ view });

  view.ui.add(homeWidget, 'top-right');
  view.ui.add(trackWidget, 'top-right');
});

mediaMinWidth('m', (result) => {
  if (result.matches) {
    view.ui.components = ['zoom'];
  } else {
    view.ui.components = [];
  }
});

map.when(() => {
  document.querySelector('calcite-loader').hidden = true;
  document.querySelector('calcite-shell').hidden = false;

  console.log('loaded');
});
