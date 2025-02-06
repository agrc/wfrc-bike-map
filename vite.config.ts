import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

export default defineConfig({
  plugins: [react(), loadVersion()],
  resolve: {
    // this should only be enabled when pnpm-linking the utah-design-package
    // dedupe: ['firebase', '@arcgis/core'],
  },
});
