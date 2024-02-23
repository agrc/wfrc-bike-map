import '@esri/calcite-components/dist/calcite/calcite.css';
import { defineCustomElements } from '@esri/calcite-components/dist/loader';
import './src/index.css'

defineCustomElements(window, {
  resourcesUrl: '/esri-calcite/assets',
});
