const toggle = document.getElementById('filter-switch');
const routeTypesControls = document.getElementById('route-types-controls');
const trafficStressControls = document.getElementById(
  'traffic-stress-controls',
);
const block = document.getElementById('filter-block');

const HEADINGS = {
  routeTypes: 'Route Types',
  trafficStress: 'Traffic Stress',
};

toggle.addEventListener('calciteSwitchChange', (event) => {
  const state = event.target.checked ? 'trafficStress' : 'routeTypes';

  routeTypesControls.classList.toggle('hidden', event.target.checked);
  trafficStressControls.classList.toggle('hidden', !event.target.checked);

  block.setAttribute('heading', HEADINGS[state]);
});
