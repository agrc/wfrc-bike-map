import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

export default defineConfig({
  plugins: [react(), tailwindcss(), loadVersion()],
  optimizeDeps: {
    // Keep design-system and app imports on the same React Aria contexts.
    exclude: ['react-aria-components'],
    include: [
      'react-aria > use-sync-external-store/shim/index.js',
      'firebase/app',
      'firebase/analytics',
      'firebase/functions',
      'firebase/remote-config',
    ],
  },
  resolve: {
    dedupe: ['firebase', 'react-aria-components'],
  },
});
