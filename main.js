import '@esri/calcite-components/dist/calcite/calcite.css';
import { defineCustomElements } from '@esri/calcite-components/dist/loader';
import './src/about.js';
import './src/components/Checkbox.js';
import './src/filter.js';
import './src/index.css';
import './src/map.js';

defineCustomElements(window, {
  resourcesUrl: '/esri-calcite/assets',
});

console.log(`version: ${import.meta.env.PACKAGE_VERSION}`);
