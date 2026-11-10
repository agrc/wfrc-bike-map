import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

export default defineConfig({
  plugins: [react(), loadVersion()],
  optimizeDeps: {
    include: [
      'react-aria > use-sync-external-store/shim/index.js',
      'firebase/app',
      'firebase/analytics',
      'firebase/functions',
      'firebase/remote-config',
    ],
  },
  resolve: {
    dedupe: ['firebase'],
  },
});
