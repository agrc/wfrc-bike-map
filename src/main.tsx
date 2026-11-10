import esriConfig from '@arcgis/core/config';
import initializeTheme from '@ugrc/esri-theme-toggle';
import { FirebaseAnalyticsProvider } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import { FirebaseAppProvider } from '@ugrc/utah-design-system/contexts/FirebaseAppProvider';
import { FirebaseFunctionsProvider } from '@ugrc/utah-design-system/contexts/FirebaseFunctionsProvider';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ErrorBoundary,
  getErrorMessage,
  type FallbackProps,
} from 'react-error-boundary';
import { enableShadowDOM } from 'react-stately/private/flags/flags';
import App from './App';
import FirebaseRemoteConfigsProvider from './context/FirebaseRemoteConfigsProvider';
import './index.css';
import '@utahdts/utah-design-system-header/css';

if (!import.meta.env.VITE_FIREBASE_CONFIG) {
  throw new Error('VITE_FIREBASE_CONFIG is not defined!');
}

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

esriConfig.assetsPath = './assets';
initializeTheme();
// React Aria's private opt-in is required for buttons inside ArcGIS popup shadow roots.
enableShadowDOM();

const ErrorFallback = ({ error }: FallbackProps) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{getErrorMessage(error)}</pre>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FirebaseAppProvider config={firebaseConfig}>
        <FirebaseAnalyticsProvider>
          <FirebaseRemoteConfigsProvider>
            <FirebaseFunctionsProvider>
              <App />
            </FirebaseFunctionsProvider>
          </FirebaseRemoteConfigsProvider>
        </FirebaseAnalyticsProvider>
      </FirebaseAppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
