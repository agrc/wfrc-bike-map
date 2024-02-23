import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [loadVersion()],
  assetsInclude: ['**/*.json'],
});
